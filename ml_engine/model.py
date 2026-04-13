import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle
import os

class RiskScoringModel:
    """
    Predicts initial risk category based on borrower features.
    Uses a hybrid approach: rule-based scoring for MVP with option to use ML model.
    """
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_order = [
            'income_regularity', 
            'avg_monthly_income', 
            'survival_rate', 
            'betting_ratio', 
            'cash_withdrawal_ratio', 
            'debt_to_income_ratio', 
            'transaction_count'
        ]
        
        # Try to load pre-trained model
        model_path = "ml_engine/risk_model_v1.pkl"
        if os.path.exists(model_path):
            try:
                with open(model_path, 'rb') as f:
                    data = pickle.load(f)
                    self.model = data.get('model')
                    self.scaler = data.get('scaler', self.scaler)
                    self.is_trained = data.get('is_trained', False)
            except Exception:
                self._train_synthetic_model()
        else:
            # Train with synthetic data for MVP
            self._train_synthetic_model()

    def _train_synthetic_model(self):
        """
        Train the model with synthetic data based on realistic African borrower patterns.
        """
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic features
        data = {
            'income_regularity': np.random.exponential(15, n_samples),  # Days std dev
            'avg_monthly_income': np.random.lognormal(10, 0.8, n_samples),  # Monthly income
            'survival_rate': np.random.beta(5, 2, n_samples),  # Liquidity survival
            'betting_ratio': np.random.beta(2, 10, n_samples),  # Betting % of spending
            'cash_withdrawal_ratio': np.random.beta(3, 5, n_samples),  # Cash withdrawal %
            'debt_to_income_ratio': np.random.exponential(0.5, n_samples),  # Debt ratio
            'transaction_count': np.random.poisson(80, n_samples)  # Number of transactions
        }
        
        X_synthetic = pd.DataFrame(data)
        
        # Generate synthetic labels (1 = repaid, 0 = defaulted)
        # Based on logical rules
        y_synthetic = []
        for _, row in X_synthetic.iterrows():
            score = 50  # Base score
            
            # Income regularity (lower is better)
            if row['income_regularity'] < 10:
                score += 15
            elif row['income_regularity'] > 25:
                score -= 15
            
            # Survival rate (higher is better)
            if row['survival_rate'] > 0.7:
                score += 20
            elif row['survival_rate'] < 0.3:
                score -= 20
            
            # Betting ratio (lower is better)
            if row['betting_ratio'] < 0.05:
                score += 15
            elif row['betting_ratio'] > 0.15:
                score -= 20
            
            # Debt to income (lower is better)
            if row['debt_to_income_ratio'] < 0.3:
                score += 10
            elif row['debt_to_income_ratio'] > 1.0:
                score -= 15
            
            # Cash withdrawal (lower is better)
            if row['cash_withdrawal_ratio'] < 0.2:
                score += 5
            elif row['cash_withdrawal_ratio'] > 0.5:
                score -= 10
            
            # Add some noise
            score += np.random.normal(0, 10)
            
            # Convert to binary (repaid if score > 50)
            y_synthetic.append(1 if score > 50 else 0)
        
        X_scaled = self.scaler.fit_transform(X_synthetic[self.feature_order])
        self.model = GradientBoostingClassifier(n_estimators=100, random_state=42, max_depth=4)
        self.model.fit(X_scaled, y_synthetic)
        self.is_trained = True
        
        # Save the model
        try:
            os.makedirs('ml_engine', exist_ok=True)
            with open('ml_engine/risk_model_v1.pkl', 'wb') as f:
                pickle.dump({
                    'model': self.model,
                    'scaler': self.scaler,
                    'is_trained': self.is_trained
                }, f)
        except Exception:
            pass

    def train_initial_model(self, X_train, y_train):
        """Train the model with real data."""
        X_scaled = self.scaler.fit_transform(X_train[self.feature_order])
        self.model = GradientBoostingClassifier(n_estimators=100, random_state=42, max_depth=4)
        self.model.fit(X_scaled, y_train)
        self.is_trained = True

    def predict_risk_score(self, feature_vector):
        """
        Returns a score from 0 to 100 where 100 is LOW RISK.
        """
        if not self.is_trained or self.model is None:
            # Fallback to rule-based scoring
            return self._rule_based_scoring(feature_vector)
        
        input_df = pd.DataFrame([feature_vector])[self.feature_order]
        X_scaled = self.scaler.transform(input_df)
        
        # Get probability of repayment (class 1)
        prob_repaid = self.model.predict_proba(X_scaled)[0][1]
        
        # Apply calibration to make scores more interpretable
        raw_score = int(prob_repaid * 100)
        
        # Risk Category Logic
        category = "High" if raw_score < 35 else ("Moderate" if raw_score < 70 else "Low")
        
        return {
            "score": raw_score,
            "category": category,
            "recommendation": "Reject" if category == "High" else ("Review" if category == "Moderate" else "Approve")
        }
    
    def _rule_based_scoring(self, feature_vector):
        """
        Fallback rule-based scoring when ML model is not available.
        """
        score = 50  # Base score
        
        # Income regularity (lower std dev is better)
        income_reg = feature_vector.get('income_regularity', 30)
        if income_reg < 10:
            score += 15
        elif income_reg < 20:
            score += 5
        elif income_reg > 25:
            score -= 15
        
        # Survival rate (higher is better)
        survival = feature_vector.get('survival_rate', 0.5)
        if survival > 0.7:
            score += 20
        elif survival > 0.5:
            score += 5
        elif survival < 0.3:
            score -= 20
        
        # Betting ratio (lower is better)
        betting = feature_vector.get('betting_ratio', 0)
        if betting < 0.05:
            score += 15
        elif betting < 0.1:
            score += 5
        elif betting > 0.15:
            score -= 20
        
        # Debt to income (lower is better)
        debt_ratio = feature_vector.get('debt_to_income_ratio', 0.5)
        if debt_ratio < 0.3:
            score += 10
        elif debt_ratio < 0.5:
            score += 0
        elif debt_ratio > 1.0:
            score -= 15
        
        # Cash withdrawal ratio (lower is better)
        cash_ratio = feature_vector.get('cash_withdrawal_ratio', 0.3)
        if cash_ratio < 0.2:
            score += 5
        elif cash_ratio > 0.5:
            score -= 10
        
        # Clamp score to 0-100
        raw_score = max(0, min(100, int(score)))
        
        # Risk Category Logic
        category = "High" if raw_score < 35 else ("Moderate" if raw_score < 70 else "Low")
        
        return {
            "score": raw_score,
            "category": category,
            "recommendation": "Reject" if category == "High" else ("Review" if category == "Moderate" else "Approve")
        }

    def save_model(self, path="ml_engine/risk_model_v1.pkl"):
        """Save the model to disk."""
        if self.model and self.is_trained:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'wb') as f:
                pickle.dump({
                    'model': self.model,
                    'scaler': self.scaler,
                    'is_trained': self.is_trained
                }, f)

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
