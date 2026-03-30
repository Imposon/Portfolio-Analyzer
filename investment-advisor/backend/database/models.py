from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
class Asset(BaseModel):
    """Individual asset in the portfolio."""
    name: str
    category: str
    risk: str
    invested_amount: float
    percentage: float
    expected_return: float
class Allocation(BaseModel):
    """Portfolio allocation across asset classes."""
    equity: float
    debt: float
    funds: float
class PortfolioRequest(BaseModel):
    """Request body for portfolio generation."""
    amount: float
    risk: str
    horizon: int
    goal: str
class PortfolioResponse(BaseModel):
    """Response body for portfolio generation."""
    portfolio_id: int
    portfolio_type: str
    allocation: Allocation
    assets: List[Asset]
    expected_return: float
    ai_explanation: str
class GrowthData(BaseModel):
    """Year-by-year projected growth data."""
    year: int
    value: float
class RiskReturnData(BaseModel):
    """Risk vs return data point for charting."""
    name: str
    risk_score: int
    expected_return: float
class AnalysisResponse(BaseModel):
    """Response body for portfolio analysis."""
    growth_data: List[GrowthData]
    risk_return_data: List[RiskReturnData]
    allocation_data: Allocation