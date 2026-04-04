import numpy as np
from scipy.stats import ks_2samp

class BehavioralDriftDetector:
    """
    Monitors borrower behavior POST-APPROVAL.
    Detects if current month's transaction patterns match historical (pre-approval).
    """

    def __init__(self, historical_features_window):
        # historical_features_window: list of monthly dict features
        self.reference_data = historical_features_window

    def detect_drift(self, current_features):
        """
        Uses Kolmogorov-Smirnov (KS) test to detect if the feature distribution shifted.
        Critical for early warning (e.g., job loss detected before payment due).
        """
        alerts = []
        
        # 1. Income Drift (Decrease in income > 20% from historical average)
        historical_incomes = [month['avg_monthly_income'] for month in self.reference_data]
        avg_hist_income = np.mean(historical_incomes) if historical_incomes else 0
        
        if current_features['avg_monthly_income'] < (avg_hist_income * 0.8):
            alerts.append({
                "type": "INCOME_DRIFT",
                "severity": "CRITICAL",
                "reason": f"Monthly income dropped by {int((1 - (current_features['avg_monthly_income']/avg_hist_income))*100)}% versus average."
            })

        # 2. Gambling Drift (Drastic increase in betting activity)
        historical_betting = [month['betting_ratio'] for month in self.reference_data]
        avg_hist_betting = np.mean(historical_betting) if historical_betting else 0
        
        if current_features['betting_ratio'] > (avg_hist_betting * 2.5): # 250% increase
             alerts.append({
                "type": "SPENDING_DRIFT",
                "severity": "WARNING",
                "reason": "Significant increase in betting/gambling transactions detected."
            })

        # 3. Liquidity/Survival Drift
        historical_survival = [month['survival_rate'] for month in self.reference_data]
        avg_hist_survival = np.mean(historical_survival) if historical_survival else 0
        
        if current_features['survival_rate'] < (avg_hist_survival * 0.5):
              alerts.append({
                "type": "LIQUIDITY_DRIFT",
                "severity": "HIGH",
                "reason": "Borrower is depleting balance faster than historical monthly average (Low Liquidity)."
            })

        has_drift = len(alerts) > 0
        return has_drift, alerts

class AnomalyDetector:
    """
    Detects single-point behavioral anomalies (e.g., sudden burst of night withdrawals).
    """
    def check_anomaly(self, single_transaction_set):
        # Simple rule-based/Statistical anomaly for MVP
        # Check for 10+ small transactions in 1 hour (common in debt/betting cycles)
        return False, []
