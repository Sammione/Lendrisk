import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier # Replace with XGBoost in prod
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle

class RiskScoringModel:
    """
    Predicts initial risk category based on borrower features.
    """
    
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.feature_order = [
            'income_regularity', 
            'avg_monthly_income', 
            'survival_rate', 
            'betting_ratio', 
            'cash_withdrawal_ratio', 
            'debt_to_income_ratio', 
            'transaction_count'
        ]

    def train_initial_model(self, X_train, y_train):
        X_scaled = self.scaler.fit_transform(X_train[self.feature_order])
        self.model.fit(X_scaled, y_train)

    def predict_risk_score(self, feature_vector):
        """
        Returns a score from 0 to 100 where 100 is LOW RISK.
        """
        input_df = pd.DataFrame([feature_vector])[self.feature_order]
        X_scaled = self.scaler.transform(input_df)
        
        # Binary prediction (Repaid vs No Repayment)
        prob_repaid = self.model.predict_proba(X_scaled)[0][1] # Probability of CLASS 1 (Repaid)
        
        # Risk Category Logic
        raw_score = int(prob_repaid * 100)
        category = "High" if raw_score < 35 else ("Moderate" if raw_score < 70 else "Low")
        
        return {
            "score": raw_score,
            "category": category,
            "recommendation": "Reject" if category == "High" else ("Review" if category == "Moderate" else "Approve")
        }

    def save_model(self, path="models/risk_model_v1.pkl"):
        # Logic to save to storage
        pass

# Basic Anomaly Detection (Isolation Forest)
from sklearn.ensemble import IsolationForest

def detect_unusual_spending(recent_transactions_features):
    """
    Detects sudden spikes in risk-related behavior versus borrower's historical average.
    """
    # X = past N months of borrower's features
    clf = IsolationForest(contamination=0.01, random_state=42)
    # clf.fit(...)
    return "Neutral" # Placeholder for result
