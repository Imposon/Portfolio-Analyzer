"""
Portfolio analysis API routes.
Handles GET /get-analysis/{portfolio_id} endpoint.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.db import get_db, Portfolio as PortfolioModel
from database.models import AnalysisResponse, GrowthData, RiskReturnData, Allocation
from services.allocator import calculate_projected_growth, get_risk_return_data

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/get-analysis/{portfolio_id}", response_model=AnalysisResponse)
async def get_analysis(portfolio_id: int, db: Session = Depends(get_db)):
    """
    Get analysis data for a specific portfolio.
    Returns growth projections, risk-return data, and allocation info.
    """
    # Fetch portfolio from database
    portfolio = db.query(PortfolioModel).filter(PortfolioModel.id == portfolio_id).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail=f"Portfolio with ID {portfolio_id} not found")
    
    # Parse stored data
    try:
        assets = json.loads(portfolio.assets_json)
        allocation_dict = json.loads(portfolio.allocation_json)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error parsing portfolio data: {str(e)}")
    
    # Get user input for time horizon
    user_input = portfolio.user_input
    
    # Calculate growth data
    growth_data = calculate_projected_growth(
        amount=user_input.amount,
        assets=assets,
        years=user_input.time_horizon
    )
    
    # Format growth data
    growth_data_formatted = [
        GrowthData(year=item["year"], value=item["value"])
        for item in growth_data
    ]
    
    # Get risk-return data
    risk_return_raw = get_risk_return_data(assets)
    risk_return_data = [
        RiskReturnData(
            name=item["name"],
            risk_score=item["risk_score"],
            expected_return=item["expected_return"]
        )
        for item in risk_return_raw
    ]
    
    # Format allocation data
    allocation_data = Allocation(**allocation_dict)
    
    return AnalysisResponse(
        growth_data=growth_data_formatted,
        risk_return_data=risk_return_data,
        allocation_data=allocation_data
    )
