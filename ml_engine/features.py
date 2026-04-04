import pandas as pd
import numpy as np
from datetime import datetime

class BorrowerFeatureEngineer:
    """
    Generates behavioral features from raw transaction data.
    Tailored for African borrowers with irregular income patterns.
    """
    
    def __init__(self, transactions_df):
        self.df = transactions_df
        # Ensure timestamp is datetime
        self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
        
    def generate_behavioral_profile(self):
        # 1. Income Regularity (Crucial for informal sector)
        income_df = self.df[self.df['is_income'] == True].sort_values('timestamp')
        if not income_df.empty:
            income_intervals = income_df['timestamp'].diff().dt.days.dropna()
            income_regularity_index = income_intervals.std() if len(income_intervals) > 1 else 30 # Default high risk if single data point
            avg_income = income_df['amount'].mean()
        else:
            income_regularity_index = 60 # Penalty for no detectable income
            avg_income = 0

        # 2. Survival Days (How fast they spend their balance)
        # Assuming we have a 'balance_after' field from the API
        df_sorted = self.df.sort_values('timestamp')
        low_balance_days = len(df_sorted[df_sorted['balance_after'] < (avg_income * 0.1)])
        survival_rate = 1.0 - (low_balance_days / 30) # Assuming 30 day window

        # 3. Discretionary vs Essential Spending
        categories = self.df.groupby('category')['amount'].sum()
        total_spend = self.df[self.df['is_income'] == False]['amount'].sum()
        
        # Risk Categories: Betting, Cash Withdrawals (Airtime/Data is often surrogate for income)
        betting_ratio = categories.get('Gambling/Betting', 0) / total_spend if total_spend > 0 else 0
        cash_withdrawal_ratio = categories.get('Cash Withdrawal', 0) / total_spend if total_spend > 0 else 0

        # 4. Debt-to-Income / Loan Stacking
        # Detection of keywords like 'repayment', 'loan', 'credit-ring' in narratives
        loan_repayment_keywords = ['repayment', 'loan', 'credit', 'migo', 'fairmoney', 'carbon']
        loan_stacking_spend = self.df[self.df['narrative'].str.contains('|'.join(loan_repayment_keywords), case=False, na=False)]['amount'].sum()
        debt_to_income_ratio = loan_stacking_spend / avg_income if avg_income > 0 else 2.0

        return {
            "income_regularity": income_regularity_index,
            "avg_monthly_income": avg_income,
            "survival_rate": survival_rate,
            "betting_ratio": betting_ratio,
            "cash_withdrawal_ratio": cash_withdrawal_ratio,
            "debt_to_income_ratio": debt_to_income_ratio,
            "transaction_count": len(self.df)
        }

# Example Usage:
# features = BorrowerFeatureEngineer(df).generate_behavioral_profile()
