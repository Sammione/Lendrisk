import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
class RiskExplainerLLM:
    """
    Connects to OpenAI/Groq/Anthropic to explain borrower scores.
    """

    def generate_explanation(self, score_result, features):
        """
        Converts probability scores into understandable narratives for the lender.
        """
        
        # 1. Gather raw context
        context = {
            "score": score_result['score'],
            "risk_category": score_result['category'],
            "income_regularity": features['income_regularity'],
            "betting_ratio": features['betting_ratio'],
            "survival_rate": features['survival_rate'],
            "debt_to_income": features['debt_to_income_ratio']
        }

        # 2. Construct Prompt (African Context focus)
        prompt = f"""
        System Goal: You are a Fintech Risk Analyst for a bank in Africa.
        Explain this borrower's risk score (0-100, where 100 is low risk) to a banker.
        
        Borrower Data: {json.dumps(context)}
        
        Instructions:
        - Keep it brief (max 3-4 sentences).
        - Use simple banker-friendly language.
        - Highlight if behavior indicates 'informal income regularity' or 'irregular spending clusters'.
        - Be objective and specific.
        
        Response Format: 
        Analysis: [Brief breakdown]
        Conclusion: [Final recommendation]
        """
        
        # 3. Model call
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=150
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Analysis: Borrower score is {score_result['score']}. \nConclusion: {score_result['recommendation']} \n(Error reaching AI: {str(e)})"

# Example Prompt:
"""
Analysis: Score is 72. Although income shows 25% volatility month-on-month (common in informal trade), they maintain a liquidity survival rate of 0.85, meaning they rarely run out of cash before the next inflow.
Conclusion: Approve but monitor monthly for income drift.
"""
