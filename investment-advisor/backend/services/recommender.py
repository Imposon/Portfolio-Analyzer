"""
Recommender service - wrapper for asset selection logic.
The actual allocation and asset selection is handled by allocator.py.
This module provides a clean interface for the API routes.
"""
from .allocator import allocate_funds
def generate_recommendation(amount: float, risk_level: str, time_horizon: int) -> dict:
    """
    Generate a complete investment recommendation.
    Delegates to allocate_funds for deterministic allocation.
    """
    return allocate_funds(amount, risk_level, time_horizon)
def get_recommended_assets(risk_level: str, time_horizon: int, category: str = None) -> list:
    """
    Get a list of recommended assets for a given risk profile.
    Optionally filter by category.
    """
    from .allocator import load_asset_data, filter_assets_by_risk
    funds_df, stocks_df = load_asset_data()
    all_assets = []
    filtered_stocks = filter_assets_by_risk(stocks_df, risk_level, time_horizon)
    for _, asset in filtered_stocks.iterrows():
        all_assets.append({
            "name": asset["name"],
            "type": "stock",
            "category": asset["sector"],
            "risk": asset["risk"],
            "expected_return": asset["expected_return"]
        })
    filtered_funds = filter_assets_by_risk(funds_df, risk_level, time_horizon)
    for _, asset in filtered_funds.iterrows():
        all_assets.append({
            "name": asset["name"],
            "type": "fund",
            "category": asset["category"],
            "risk": asset["risk"],
            "expected_return": asset["expected_return"],
            "min_horizon": asset.get("min_horizon", 1)
        })
    if category:
        all_assets = [a for a in all_assets if category.lower() in a["category"].lower()]
    all_assets.sort(key=lambda x: x["expected_return"], reverse=True)
    return all_assets