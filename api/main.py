from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from uuid import uuid4
import sys
import os
import pandas as pd
from datetime import datetime

# Append the ML engine folder to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.database import get_db, engine, Base
from api import models
from api.openbanking import OpenBankingService
from ml_engine.features import BorrowerFeatureEngineer
from ml_engine.model import RiskScoringModel
from ml_engine.explainability import RiskExplainerLLM
from pydantic import BaseModel

# Create all tables in database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lendrisk Intelligence API", version="1.1.0")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow localhost:5173 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class OnboardRequest(BaseModel):
    name: str
    loan_amount: float
    mono_code: str = "demo_code_123"

# --- Services Initialization ---
risk_model = RiskScoringModel()
llm_explainer = RiskExplainerLLM()

@app.get("/")
def health_check():
    return {"status": "ok", "service": "Lendrisk Intelligence Engine Connected to DB"}

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
            phone="000-000-0000",
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
