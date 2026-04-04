import random
import datetime
from typing import List, Dict

class OpenBankingService:
    """
    Simulates Mono/Okra fetching 90-day transaction history.
    In production, this would make authenticated requests to 'https://api.withmono.com/v1/accounts/{id}/transactions'.
    """

    @staticmethod
    def fetch_transaction_history(auth_code: str) -> List[Dict]:
        """
        Generates realistic 90-day transaction data.
        """
        transactions = []
        base_date = datetime.datetime.utcnow() - datetime.timedelta(days=90)
        current_balance = 15000.0
        
        for i in range(1, 91):
            date = base_date + datetime.timedelta(days=i)
            
            # Simulate Salary/Income every ~30 days
            if i % 30 == 0:
                amount = random.uniform(250000.0, 480000.0)
                current_balance += amount
                transactions.append({
                    "id": f"txn_inc_{i}",
                    "amount": round(amount, 2),
                    "category": "Salary/Income",
                    "narrative": "COMPANY PAYROLL INFLOW",
                    "timestamp": date.isoformat(),
                    "is_income": True,
                    "balance_after": round(current_balance, 2)
                })

            # Random daily discretionary spending (Food, Airtime)
            for _ in range(random.randint(0, 3)):
                amount = random.uniform(500.0, 4500.0)
                current_balance -= amount
                transactions.append({
                    "id": f"txn_exp_{i}_{random.randint(100,999)}",
                    "amount": round(amount, 2),
                    "category": "Airtime/Data/Food",
                    "narrative": "POS/WEB PAYMENT",
                    "timestamp": date.isoformat(),
                    "is_income": False,
                    "balance_after": round(current_balance, 2)
                })

            # Simulate Betting Drift probability (15% chance to hit a cluster of betting)
            if random.random() < 0.15:
                for _ in range(random.randint(2, 5)):
                    amount = random.uniform(1000.0, 10000.0)
                    current_balance -= amount
                    transactions.append({
                        "id": f"txn_bet_{i}_{random.randint(100,999)}",
                        "amount": round(amount, 2),
                        "category": "Betting",
                        "narrative": "SPORTYBET/BET9JA FUNDING",
                        "timestamp": date.isoformat(),
                        "is_income": False,
                        "balance_after": round(current_balance, 2)
                    })
                    
        return transactions
