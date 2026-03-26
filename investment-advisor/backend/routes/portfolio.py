"""
Portfolio generation API routes.
Handles POST /generate-portfolio endpoint with modular services.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.db import get_db, UserInput as UserInputModel, Portfolio as PortfolioModel
from database.models import PortfolioRequest, PortfolioResponse, Asset, Allocation
from services.portfolio_recommender import PortfolioRecommender
from services.groq_service import generate_explanation

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.post("/generate-portfolio", response_model=PortfolioResponse)
async def generate_portfolio(request: PortfolioRequest, db: Session = Depends(get_db)):
    """
    Generate a portfolio recommendation based on user input.
    Uses modular services for risk assessment and allocation.
    """
    # Validate inputs
    if request.amount < 1000:
        raise HTTPException(status_code=400, detail="Investment amount must be at least ₹1,000")
    
    if request.horizon < 1 or request.horizon > 30:
        raise HTTPException(status_code=400, detail="Time horizon must be between 1 and 30 years")
    
    valid_risks = ["low", "medium", "high"]
    if request.risk not in valid_risks:
        raise HTTPException(status_code=400, detail=f"Risk must be one of: {valid_risks}")
    
    valid_goals = ["wealth", "tax", "passive", "capital"]
    if request.goal not in valid_goals:
        raise HTTPException(status_code=400, detail=f"Goal must be one of: {valid_goals}")
    
    # Generate portfolio allocation using modular services
    portfolio_data = PortfolioRecommender.allocate_portfolio(
        amount=request.amount,
        risk_level=request.risk,
        horizon=request.horizon,
        goal=request.goal
    )
    
    # Create user input record
    user_input = UserInputModel(
        amount=request.amount,
        risk_level=request.risk,
        time_horizon=request.horizon,
        goal=request.goal
    )
    db.add(user_input)
    db.commit()
    db.refresh(user_input)
    
    # Generate AI explanation
    assets_json = json.dumps(portfolio_data["assets"], indent=2)
    ai_explanation = generate_explanation(
        amount=request.amount,
        risk=request.risk,
        horizon=request.horizon,
        goal=request.goal,
        portfolio_json=assets_json
    )
    
    # Create portfolio record
    portfolio = PortfolioModel(
        user_input_id=user_input.id,
        allocation_json=json.dumps(portfolio_data["allocation"]),
        assets_json=assets_json,
        ai_explanation=ai_explanation
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    
    # Build response using new structure
    allocation_dict = portfolio_data["allocation"]
    
    # Convert to expected format for frontend
    allocation = Allocation(
        equity=allocation_dict.get('stocks', 0),
        debt=allocation_dict.get('debt', 0),
        funds=allocation_dict.get('mutual_funds', 0)
    )
    
    assets = [
        Asset(
            name=asset["name"],
            category=asset["category"],
            risk=asset["risk"],
            invested_amount=asset["invested_amount"],
            percentage=asset["percentage"],
            expected_return=asset["expected_return"]
        )
        for asset in portfolio_data["assets"]
    ]
    
    return PortfolioResponse(
        portfolio_id=portfolio.id,
        portfolio_type=portfolio_data["portfolio_type"],
        allocation=allocation,
        assets=assets,
        expected_return=portfolio_data["expected_return"],
        ai_explanation=ai_explanation
    )
