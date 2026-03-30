from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.groq_service import GroqService
router = APIRouter()
class AIAnalysisRequest(BaseModel):
    portfolio: Dict[str, Any]
    assets: list
class AIAnalysisResponse(BaseModel):
    analysis: str
@router.post("/ai-analysis", response_model=AIAnalysisResponse)
async def generate_ai_analysis(request: AIAnalysisRequest):
    """
    Generate AI-powered analysis of the investment portfolio using Groq API.
    """
    try:
        groq_service = GroqService()
        portfolio_summary = {
            'total_value': request.portfolio.get('total_value', 0),
            'portfolio_type': request.portfolio.get('portfolio_type', 'balanced'),
            'expected_return': request.portfolio.get('expected_return', 0),
            'assets': [
                {
                    'name': asset.get('name', 'Unknown'),
                    'category': asset.get('category', 'unknown'),
                    'invested_amount': asset.get('invested_amount', 0),
                    'percentage': asset.get('percentage', 0),
                    'expected_return': asset.get('expected_return', 0)
                }
                for asset in request.assets
            ]
        }
        analysis = groq_service.generate_portfolio_analysis(portfolio_summary)
        return AIAnalysisResponse(analysis=analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))