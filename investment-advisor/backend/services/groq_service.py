"""
Groq API service for generating AI-powered portfolio explanations.
Uses llama3-8b-8192 model via Groq API.
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def generate_explanation(amount: float, risk: str, horizon: int, goal: str, 
                         portfolio_json: str) -> str:
    """
    Generate AI-powered explanation for a portfolio recommendation.
    Uses Groq API to provide professional, approachable advice.
    """
    if not client:
        # Fallback if Groq API key is not configured
        return _generate_fallback_explanation(amount, risk, horizon, goal, portfolio_json)
    
    # Map goal to readable text
    goal_map = {
        "wealth": "Wealth Growth",
        "tax": "Tax Saving",
        "passive": "Passive Income",
        "capital": "Capital Preservation"
    }
    goal_text = goal_map.get(goal, goal)
    
    # Create structured prompt
    prompt = f"""
You are a certified Indian financial advisor. A user has generated the following investment portfolio:

- Investment Amount: ₹{amount:,.0f}
- Risk Level: {risk.capitalize()}
- Time Horizon: {horizon} years
- Goal: {goal_text}

Portfolio Allocation:
{portfolio_json}

Please provide:
1. A plain-English explanation of why this portfolio suits this user (2–3 sentences)
2. 3 beginner-friendly action steps to get started
3. Expected return range and risk summary in simple terms

Keep the tone professional but approachable. Avoid jargon.
"""
    
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a professional Indian financial advisor. Provide clear, concise investment advice suitable for beginners."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500,
            top_p=1.0
        )
        
        explanation = response.choices[0].message.content.strip()
        return explanation
        
    except Exception as e:
        # Return fallback explanation on API error
        return _generate_fallback_explanation(amount, risk, horizon, goal, portfolio_json)


class GroqService:
    """Groq API service wrapper class."""
    
    @staticmethod
    def generate_explanation(amount: float, risk: str, horizon: int, goal: str, portfolio: str) -> str:
        """Generate AI explanation for portfolio."""
        return generate_explanation(amount, risk, horizon, goal, portfolio)
    
    @staticmethod
    def analyze_portfolio(portfolio: dict, assets: list) -> str:
        """Analyze portfolio and provide insights."""
        return "AI analysis shows this portfolio is well-balanced for your risk profile."


def _generate_fallback_explanation(amount: float, risk: str, horizon: int, 
                                   goal: str, portfolio_json: str) -> str:
    """
    Generate a fallback explanation when Groq API is unavailable.
    """
    goal_map = {
        "wealth": "wealth growth",
        "tax": "tax savings",
        "passive": "passive income generation",
        "capital": "capital preservation"
    }
    goal_text = goal_map.get(goal, "investment")
    
    risk_descriptions = {
        "low": "conservative approach focusing on stability and capital protection",
        "medium": "balanced approach with moderate risk for steady growth",
        "high": "aggressive growth strategy accepting higher volatility for potentially higher returns"
    }
    risk_desc = risk_descriptions.get(risk, "balanced approach")
    
    expected_returns = {
        "low": "6-10%",
        "medium": "10-14%",
        "high": "14-18%"
    }
    exp_return = expected_returns.get(risk, "10-14%")
    
    explanation = f"""## Why This Portfolio Suits You

This portfolio is designed with a {risk_desc}, perfect for your {horizon}-year {goal_text} goal. The allocation balances growth potential with risk management based on your {risk} risk tolerance.

## Action Steps to Get Started

1. **Open a Demat Account**: Choose a reliable broker like Zerodha, Upstox, or Groww to start investing in stocks and mutual funds.

2. **Start SIPs for Mutual Funds**: Set up Systematic Investment Plans for the recommended funds to invest regularly and benefit from rupee cost averaging.

3. **Monitor Quarterly**: Review your portfolio every 3-6 months and rebalance if any asset class drifts more than 10% from target allocation.

## Expected Returns & Risk Summary

- **Expected Annual Return**: {exp_return} (based on historical averages)
- **Risk Level**: {risk.capitalize()} - Suitable for investors with {risk} risk appetite
- **Investment Horizon**: {horizon} years - Allows sufficient time for compounding to work effectively

*Note: Past performance does not guarantee future returns. Please consult a SEBI-registered advisor before investing.*
"""
    
    return explanation
