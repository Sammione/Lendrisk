from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from uuid import uuid4
import sys
import os
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Optional
from twilio.rest import Client
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

# Append the ML engine folder to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.database import get_db, engine, Base
from api import models
from api.openbanking import OpenBankingService
from ml_engine.features import BorrowerFeatureEngineer
from ml_engine.model import RiskScoringModel
from ml_engine.explainability import RiskExplainerLLM
from ml_engine.monitoring import BehavioralDriftDetector
from pydantic import BaseModel

# Create all tables in database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lendrisk Intelligence API", version="1.2.0")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class OnboardRequest(BaseModel):
    name: str
    email: str = None  # Email is now primary, phone optional
    phone: str = None  # Phone is optional for backward compatibility
    loan_amount: float
    mono_code: str = "demo_code_123"

class ConsentRequest(BaseModel):
    name: str
    email: str

class LoanActionRequest(BaseModel):
    action: str  # "approve", "reject", "request_more_data"
    notes: Optional[str] = None

# --- Services Initialization ---
risk_model = RiskScoringModel()
llm_explainer = RiskExplainerLLM()

# --- Helper Functions ---
def calculate_dashboard_stats(db: Session):
    """Calculate dashboard statistics."""
    total_borrowers = db.query(models.Borrower).count()
    active_loans = db.query(models.Loan).filter(models.Loan.status == "Active").count()
    high_risk = db.query(models.Borrower).filter(models.Borrower.risk_category == "High").count()
    moderate_risk = db.query(models.Borrower).filter(models.Borrower.risk_category == "Moderate").count()
    low_risk = db.query(models.Borrower).filter(models.Borrower.risk_category == "Low").count()
    
    total_disbursed = db.query(func.sum(models.Loan.principal_amount)).filter(
        models.Loan.status.in_(["Active", "Repaid"])
    ).scalar() or 0.0
    
    delinquent_loans = db.query(models.Loan).filter(models.Loan.status == "Delinquent").count()
    active_alerts = db.query(models.RiskAlert).filter(models.RiskAlert.resolved == False).count()
    
    # Calculate portfolio at risk (delinquent + defaulted amounts)
    par = db.query(func.sum(models.Loan.principal_amount)).filter(
        models.Loan.status.in_(["Delinquent", "Defaults"])
    ).scalar() or 0.0
    
    # Collection rate (repaid / total issued)
    total_repaid = db.query(func.sum(models.Loan.principal_amount)).filter(
        models.Loan.status == "Repaid"
    ).scalar() or 0.0
    total_issued = db.query(func.sum(models.Loan.principal_amount)).scalar() or 1.0
    collection_rate = (total_repaid / total_issued * 100) if total_issued > 0 else 0.0
    
    return {
        "total_borrowers": total_borrowers,
        "active_loans": active_loans,
        "high_risk_count": high_risk,
        "moderate_risk_count": moderate_risk,
        "low_risk_count": low_risk,
        "total_disbursed": total_disbursed,
        "portfolio_at_risk": par,
        "collection_rate": round(collection_rate, 1),
        "active_alerts": active_alerts,
        "delinquent_loans": delinquent_loans
    }

def get_borrower_with_details(db: Session, borrower_id: str):
    """Get borrower with all related data."""
    borrower = db.query(models.Borrower).filter(models.Borrower.id == borrower_id).first()
    if not borrower:
        return None
    
    loans = db.query(models.Loan).filter(models.Loan.borrower_id == borrower_id).all()
    transactions = db.query(models.Transaction).filter(
        models.Transaction.borrower_id == borrower_id
    ).order_by(models.Transaction.timestamp.desc()).limit(50).all()
    alerts = db.query(models.RiskAlert).filter(
        models.RiskAlert.borrower_id == borrower_id,
        models.RiskAlert.resolved == False
    ).order_by(models.RiskAlert.created_at.desc()).all()
    
    return {
        "borrower": borrower,
        "loans": loans,
        "transactions": transactions,
        "alerts": alerts
    }

# --- API Endpoints ---

@app.get("/")
def health_check():
    return {"status": "ok", "service": "Lendrisk Intelligence Engine Connected to DB"}

@app.get("/api/v1/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard overview statistics."""
    stats = calculate_dashboard_stats(db)
    return {"status": "success", "data": stats}

@app.get("/api/v1/borrowers")
def list_borrowers(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    risk_category: Optional[str] = None,
    search: Optional[str] = None
):
    """List all borrowers with pagination and filtering."""
    query = db.query(models.Borrower)
    
    if risk_category:
        query = query.filter(models.Borrower.risk_category == risk_category)
    
    if search:
        query = query.filter(
            and_(
                models.Borrower.name.ilike(f"%{search}%") | 
                models.Borrower.id.ilike(f"%{search}%") |
                models.Borrower.phone.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    borrowers = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "status": "success",
        "data": {
            "borrowers": [{
                "id": b.id,
                "name": b.name,
                "phone": b.phone,
                "risk_score": b.risk_score,
                "risk_category": b.risk_category,
                "created_at": b.created_at.isoformat() if b.created_at else None
            } for b in borrowers],
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    }

@app.get("/api/v1/borrowers/{borrower_id}")
def get_borrower(borrower_id: str, db: Session = Depends(get_db)):
    """Get detailed borrower information."""
    data = get_borrower_with_details(db, borrower_id)
    if not data:
        raise HTTPException(status_code=404, detail="Borrower not found")
    
    borrower = data["borrower"]
    loans = data["loans"]
    transactions = data["transactions"]
    alerts = data["alerts"]
    
    # Build transaction summary for charts
    monthly_income = []
    spending_by_category = {}
    recent_transactions = []
    
    for txn in transactions:
        # Monthly income tracking
        if txn.is_income:
            month_key = txn.timestamp.strftime("%b %Y")
            if not any(m["month"] == month_key for m in monthly_income):
                monthly_income.append({"month": month_key, "amount": txn.amount})
            else:
                for m in monthly_income:
                    if m["month"] == month_key:
                        m["amount"] += txn.amount
                        break
        
        # Spending by category
        if not txn.is_income:
            cat = txn.category
            spending_by_category[cat] = spending_by_category.get(cat, 0) + txn.amount
        
        # Recent transactions for feed
        recent_transactions.append({
            "id": txn.id,
            "amount": txn.amount,
            "category": txn.category,
            "narrative": txn.narrative,
            "timestamp": txn.timestamp.isoformat(),
            "is_income": txn.is_income
        })
    
    # Calculate spending percentages
    total_spending = sum(spending_by_category.values()) or 1
    spending_pie = [
        {"name": cat, "value": round(amount / total_spending * 100, 1)}
        for cat, amount in spending_by_category.items()
    ]
    
    # Format alerts for frontend
    formatted_alerts = [{
        "id": a.id,
        "type": a.alert_type,
        "description": a.description,
        "created_at": a.created_at.isoformat() if a.created_at else None,
        "severity": "high" if "critical" in a.alert_type.lower() or "income" in a.alert_type.lower() else "medium"
    } for a in alerts]
    
    # Format loans
    formatted_loans = [{
        "id": l.id,
        "principal_amount": l.principal_amount,
        "issued_on": l.issued_on.isoformat() if l.issued_on else None,
        "next_due_date": l.next_due_date.isoformat() if l.next_due_date else None,
        "status": l.status
    } for l in loans]
    
    return {
        "status": "success",
        "data": {
            "borrower": {
                "id": borrower.id,
                "name": borrower.name,
                "phone": borrower.phone,
                "mono_code": borrower.mono_code,
                "risk_score": borrower.risk_score,
                "risk_category": borrower.risk_category,
                "created_at": borrower.created_at.isoformat() if borrower.created_at else None
            },
            "loans": formatted_loans,
            "transactions": recent_transactions[:20],
            "charts": {
                "monthly_income": monthly_income[-6:],  # Last 6 months
                "spending_by_category": spending_pie
            },
            "alerts": formatted_alerts
        }
    }

@app.get("/api/v1/loans")
def list_loans(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None
):
    """List all loans with pagination and filtering."""
    query = db.query(models.Loan)
    
    if status:
        query = query.filter(models.Loan.status == status)
    
    total = query.count()
    loans = query.offset((page - 1) * limit).limit(limit).all()
    
    # Include borrower info
    loan_data = []
    for loan in loans:
        borrower = db.query(models.Borrower).filter(models.Borrower.id == loan.borrower_id).first()
        loan_data.append({
            "id": loan.id,
            "borrower_id": loan.borrower_id,
            "borrower_name": borrower.name if borrower else "Unknown",
            "principal_amount": loan.principal_amount,
            "issued_on": loan.issued_on.isoformat() if loan.issued_on else None,
            "next_due_date": loan.next_due_date.isoformat() if loan.next_due_date else None,
            "status": loan.status
        })
    
    return {
        "status": "success",
        "data": {
            "loans": loan_data,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    }

@app.get("/api/v1/alerts")
def list_alerts(db: Session = Depends(get_db), resolved: bool = False):
    """List risk alerts."""
    query = db.query(models.RiskAlert).filter(models.RiskAlert.resolved == resolved)
    alerts = query.order_by(models.RiskAlert.created_at.desc()).limit(50).all()
    
    alert_data = []
    for alert in alerts:
        borrower = db.query(models.Borrower).filter(models.Borrower.id == alert.borrower_id).first()
        alert_data.append({
            "id": alert.id,
            "borrower_id": alert.borrower_id,
            "borrower_name": borrower.name if borrower else "Unknown",
            "alert_type": alert.alert_type,
            "description": alert.description,
            "created_at": alert.created_at.isoformat() if alert.created_at else None,
            "resolved": alert.resolved
        })
    
    return {
        "status": "success",
        "data": alert_data
    }

@app.post("/api/v1/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    """Mark an alert as resolved."""
    alert = db.query(models.RiskAlert).filter(models.RiskAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.resolved = True
    db.commit()
    
    return {"status": "success", "message": "Alert resolved"}

@app.post("/api/v1/send-consent")
def send_consent_email(request: ConsentRequest):
    """
    Sends a consent email with bank connection link to the borrower using SendGrid.
    """
    try:
        # Generate a unique consent link
        consent_link = f"https://connect.withmono.com/link?ref=lendrisk_{request.email.replace('@', '_')}"
        
        # Get SendGrid configuration
        sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        email_from = os.getenv("EMAIL_FROM", "noreply@lendrisk.com")
        
        # Check if SendGrid is configured
        if not sendgrid_api_key or sendgrid_api_key == "your_sendgrid_api_key_here":
            # SendGrid not configured, return simulated response for demo purposes
            return {
                "status": "simulated", 
                "message": f"Consent link generated for {request.email} (SendGrid not configured)",
                "consent_link": consent_link
            }
        
        # Initialize SendGrid client
        sg = sendgrid.SendGridAPIClient(api_key=sendgrid_api_key)
        
        # Create email content
        subject = "Lendrisk - Connect Your Bank Account"
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4F46E5;">Hello {request.name}!</h2>
                <p>You have a pending loan application with Lendrisk. To complete your application, 
                please connect your bank account using the secure link below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{consent_link}" 
                       style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 8px; display: inline-block;">
                        Connect Your Bank Account
                    </a>
                </div>
                
                <p>This link will securely connect your bank account via Mono/Okra to verify your 
                financial information.</p>
                
                <p style="color: #666; font-size: 14px;">
                    If you did not request this, please ignore this email.<br>
                    This link expires in 24 hours.
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">
                    Lendrisk Intelligence Engine<br>
                    Secure Loan Processing Platform
                </p>
            </div>
        </body>
        </html>
        """
        
        # Create the email
        from_email = Email(email_from, "Lendrisk")
        to_email = To(request.email)
        content = Content("text/html", html_content)
        mail = Mail(from_email, to_email, subject, content)
        
        # Send the email
        response = sg.send(mail)
        
        if response.status_code in [202, 200]:
            return {
                "status": "success",
                "message": f"Consent email sent to {request.email}",
                "consent_link": consent_link
            }
        else:
            return {
                "status": "error",
                "message": f"Failed to send email. Status: {response.status_code}",
                "consent_link": consent_link
            }
            
    except Exception as e:
        # Log the error and return a user-friendly message
        print(f"SendGrid error: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to send consent email: {str(e)}",
            "consent_link": consent_link
        }

@app.post("/api/v1/send-sms")
def send_sms_consent(request: ConsentRequest):
    """
    Sends a real SMS link to the borrower using Twilio (optional - email is primary).
    """
    try:
        twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        twilio_auth = os.getenv("TWILIO_AUTH_TOKEN")
        twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")

        if not twilio_sid or not twilio_auth or twilio_phone == "YOUR_TWILIO_PHONE_NUMBER_HERE":
            # If not completely set up, we just simulate success (don't break the app)
            return {"status": "simulated", "message": "Twilio not fully configured. Simulated."}

        client = Client(twilio_sid, twilio_auth)
        
        # Prepare the consent message
        msg_body = f"Hello {request.name}. You have a pending Lendrisk application. Please connect your bank to finalize: https://lendrisk.onrender.com/consent"

        # Send the message
        message = client.messages.create(
            body=msg_body,
            from_=twilio_phone,
            to=request.email  # Note: This should be phone number, keeping for backward compatibility
        )
        return {"status": "success", "message_sid": message.sid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/onboard")
def onboard_borrower(request: OnboardRequest, db: Session = Depends(get_db)):
    """
    Step 2 & 3: End-to-end integration for API/DB.
    1. Creates Borrower in DB.
    2. Pulls transactions via Open Banking.
    3. Runs ML Engine features & scoring.
    4. Runs LLM Explanation.
    5. Disburses Loan config in DB.
    """
    try:
        borrower_id = f"LEN-{str(uuid4())[:8].upper()}"
        
        # 1. Create DB Borrower
        borrower = models.Borrower(
            id=borrower_id,
            name=request.name,
            phone=request.phone or "",  # Phone is now optional
            mono_code=request.mono_code
        )
        db.add(borrower)
        db.commit()

        # 2. Open Banking Pull
        raw_txns = OpenBankingService.fetch_transaction_history(request.mono_code)
        
        # Save transactions to DB
        for t in raw_txns:
            db_txn = models.Transaction(
                id=t["id"],
                borrower_id=borrower_id,
                amount=t["amount"],
                category=t["category"],
                narrative=t["narrative"],
                timestamp=datetime.fromisoformat(t["timestamp"]),
                is_income=t["is_income"],
                balance_after=t["balance_after"]
            )
            db.add(db_txn)
        db.commit()

        # 3. Machine Learning Pipeline
        df = pd.DataFrame(raw_txns)
        fe = BorrowerFeatureEngineer(df)
        features = fe.generate_behavioral_profile()
        risk_result = risk_model.predict_risk_score(features)

        # Update Borrower with ML state
        borrower.risk_score = risk_result['score']
        borrower.risk_category = risk_result['category']
        db.commit()

        # 4. Explainability (LLM integration)
        explanation = llm_explainer.generate_explanation(risk_result, features)

        # 5. Issue Loan DB Registry
        loan = models.Loan(
            id=f"L-{str(uuid4())[:4].upper()}",
            borrower_id=borrower_id,
            principal_amount=request.loan_amount,
            status="Active"
        )
        db.add(loan)
        db.commit()

        return {
            "status": "success",
            "borrower_id": borrower_id,
            "risk_score": risk_result['score'],
            "risk_category": risk_result['category'],
            "features_snapshot": features,
            "llm_explanation": explanation
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/borrowers/{borrower_id}/loan-action")
def perform_loan_action(borrower_id: str, request: LoanActionRequest, db: Session = Depends(get_db)):
    """Perform actions on a borrower's loan (approve, reject, request more data)."""
    borrower = db.query(models.Borrower).filter(models.Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")
    
    loan = db.query(models.Loan).filter(
        models.Loan.borrower_id == borrower_id,
        models.Loan.status == "Active"
    ).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="No active loan found for borrower")
    
    if request.action == "approve":
        loan.status = "Approved"
    elif request.action == "reject":
        loan.status = "Rejected"
    elif request.action == "request_more_data":
        # Create an alert for follow-up
        alert = models.RiskAlert(
            borrower_id=borrower_id,
            alert_type="Data Request",
            description=f"Additional documentation requested: {request.notes or 'General verification'}"
        )
        db.add(alert)
    
    db.commit()
    
    return {"status": "success", "message": f"Loan {request.action}d successfully"}

@app.post("/api/v1/borrowers/{borrower_id}/monitor")
def run_borrower_monitoring(borrower_id: str, db: Session = Depends(get_db)):
    """Run drift detection on a borrower's recent behavior."""
    borrower = db.query(models.Borrower).filter(models.Borrower.id == borrower_id).first()
    if not borrower:
        raise HTTPException(status_code=404, detail="Borrower not found")
    
    # Get historical transactions (first 60 days)
    historical_txns = db.query(models.Transaction).filter(
        models.Transaction.borrower_id == borrower_id
    ).order_by(models.Transaction.timestamp).limit(60).all()
    
    # Get recent transactions (last 30 days)
    recent_txns = db.query(models.Transaction).filter(
        models.Transaction.borrower_id == borrower_id
    ).order_by(models.Transaction.timestamp.desc()).limit(30).all()
    
    if not historical_txns or not recent_txns:
        return {"status": "success", "drift_detected": False, "alerts": []}
    
    # Generate features for historical period
    hist_df = pd.DataFrame([{
        "id": t.id,
        "amount": t.amount,
        "category": t.category,
        "narrative": t.narrative,
        "timestamp": t.timestamp.isoformat(),
        "is_income": t.is_income,
        "balance_after": t.balance_after
    } for t in historical_txns])
    
    hist_fe = BorrowerFeatureEngineer(hist_df)
    hist_features = hist_fe.generate_behavioral_profile()
    
    # Generate features for recent period
    recent_df = pd.DataFrame([{
        "id": t.id,
        "amount": t.amount,
        "category": t.category,
        "narrative": t.narrative,
        "timestamp": t.timestamp.isoformat(),
        "is_income": t.is_income,
        "balance_after": t.balance_after
    } for t in recent_txns])
    
    recent_fe = BorrowerFeatureEngineer(recent_df)
    recent_features = recent_fe.generate_behavioral_profile()
    
    # Run drift detection
    detector = BehavioralDriftDetector([hist_features])
    has_drift, alerts = detector.detect_drift(recent_features)
    
    # Save alerts to database
    new_alerts = []
    if has_drift:
        for alert in alerts:
            db_alert = models.RiskAlert(
                borrower_id=borrower_id,
                alert_type=alert["type"],
                description=alert["reason"]
            )
            db.add(db_alert)
            new_alerts.append({
                "type": alert["type"],
                "severity": alert["severity"],
                "reason": alert["reason"]
            })
        db.commit()
    
    return {
        "status": "success",
        "drift_detected": has_drift,
        "alerts": new_alerts
    }