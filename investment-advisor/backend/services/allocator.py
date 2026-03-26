import pandas as pd
import os
from typing import Dict, List, Tuple

# Define allocation rules based on risk level
ALLOCATION_RULES = {
    "low":    {"equity": 0.20, "debt": 0.50, "funds": 0.30},
    "medium": {"equity": 0.30, "debt": 0.20, "funds": 0.50},
    "high":   {"equity": 0.70, "debt": 0.10, "funds": 0.20},
}

# Risk score mapping for sorting and filtering
RISK_SCORES = {"low": 1, "medium": 2, "high": 3}


def load_asset_data() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Load funds and stocks data from CSV files.
    Returns: (funds_df, stocks_df)
    """
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    
    funds_path = os.path.join(data_dir, "funds.csv")
    stocks_path = os.path.join(data_dir, "stocks.csv")
    
    funds_df = pd.read_csv(funds_path)
    stocks_df = pd.read_csv(stocks_path)
    
    return funds_df, stocks_df


def get_risk_tolerance_range(risk_level: str) -> List[str]:
    """
    Get acceptable risk levels for filtering assets.
    For a given risk level, include assets of same or lower risk.
    """
    user_risk_score = RISK_SCORES[risk_level]
    return [risk for risk, score in RISK_SCORES.items() if score <= user_risk_score]


def filter_assets_by_risk(df: pd.DataFrame, risk_level: str, time_horizon: int) -> pd.DataFrame:
    """
    Filter assets by risk tolerance and time horizon requirements.
    """
    acceptable_risks = get_risk_tolerance_range(risk_level)
    
    # Filter by risk level
    filtered = df[df["risk"].isin(acceptable_risks)].copy()
    
    # For funds, also filter by minimum horizon
    if "min_horizon" in filtered.columns:
        filtered = filtered[filtered["min_horizon"] <= time_horizon]
    
    return filtered


def select_top_assets(df: pd.DataFrame, category: str, count: int = 3) -> pd.DataFrame:
    """
    Select top N assets by expected return for a given category.
    """
    category_assets = df[df["category"].str.lower() == category.lower()].copy()
    
    # Sort by expected_return descending
    category_assets = category_assets.sort_values("expected_return", ascending=False)
    
    # Return top N
    return category_assets.head(count)


def select_stocks_by_sector(df: pd.DataFrame, sector: str, count: int = 3) -> pd.DataFrame:
    """
    Select top N stocks by expected return for a given sector.
    """
    sector_stocks = df[df["sector"].str.lower() == sector.lower()].copy()
    
    # Sort by expected_return descending
    sector_stocks = sector_stocks.sort_values("expected_return", ascending=False)
    
    # Return top N
    return sector_stocks.head(count)


def allocate_funds(amount: float, risk_level: str, time_horizon: int) -> Dict:
    """
    Main allocation function. Determines portfolio allocation and selects assets.
    Returns dict with allocation percentages and selected assets.
    """
    # Get allocation percentages
    allocation = ALLOCATION_RULES[risk_level]
    
    # Calculate rupee amounts for each category
    category_amounts = {
        "equity": amount * allocation["equity"],
        "debt": amount * allocation["debt"],
        "funds": amount * allocation["funds"],
    }
    
    # Load asset data
    funds_df, stocks_df = load_asset_data()
    
    selected_assets = []
    
    # Select stocks for equity allocation
    if category_amounts["equity"] > 0:
        equity_stocks = filter_assets_by_risk(stocks_df, risk_level, time_horizon)
        equity_stocks = equity_stocks[equity_stocks["expected_return"] >= 12.0]  # Higher returns for equity
        top_equity = select_stocks_by_sector(equity_stocks, "Energy", 2)  # Start with energy
        
        # Also get IT and Banking for diversification
        it_stocks = select_stocks_by_sector(equity_stocks, "IT", 1)
        banking_stocks = select_stocks_by_sector(equity_stocks, "Banking", 1)
        
        equity_selection = pd.concat([top_equity, it_stocks, banking_stocks]).drop_duplicates(subset=["name"]).head(3)
        
        if len(equity_selection) > 0:
            per_asset = category_amounts["equity"] / len(equity_selection)
            for _, asset in equity_selection.iterrows():
                selected_assets.append({
                    "name": asset["name"],
                    "category": f"Equity - {asset['sector']}",
                    "risk": asset["risk"],
                    "invested_amount": round(per_asset, 2),
                    "percentage": round((per_asset / amount) * 100, 2),
                    "expected_return": asset["expected_return"],
                    "risk_score": RISK_SCORES[asset["risk"]]
                })
    
    # Select funds for debt allocation (Liquid funds, debt funds)
    if category_amounts["debt"] > 0:
        debt_funds = filter_assets_by_risk(funds_df, "low", time_horizon)
        debt_funds = debt_funds[debt_funds["category"].str.contains("Debt|Liquid", case=False, na=False)]
        top_debt = debt_funds.sort_values("expected_return", ascending=False).head(2)
        
        if len(top_debt) > 0:
            per_asset = category_amounts["debt"] / len(top_debt)
            for _, asset in top_debt.iterrows():
                selected_assets.append({
                    "name": asset["name"],
                    "category": f"Debt - {asset['category']}",
                    "risk": asset["risk"],
                    "invested_amount": round(per_asset, 2),
                    "percentage": round((per_asset / amount) * 100, 2),
                    "expected_return": asset["expected_return"],
                    "risk_score": RISK_SCORES[asset["risk"]]
                })
    
    # Select funds for hybrid/mutual fund allocation
    if category_amounts["funds"] > 0:
        fund_options = filter_assets_by_risk(funds_df, risk_level, time_horizon)
        
        # Exclude already used debt funds
        fund_options = fund_options[~fund_options["category"].str.contains("Debt|Liquid", case=False, na=False)]
        
        if risk_level == "low":
            # For low risk, prefer hybrid and large cap
            hybrid = select_top_assets(fund_options, "Hybrid", 2)
            large_cap = select_top_assets(fund_options, "Large Cap", 1)
            fund_selection = pd.concat([hybrid, large_cap]).drop_duplicates(subset=["name"]).head(3)
        elif risk_level == "medium":
            # For medium risk, ELSS and hybrid
            elss = select_top_assets(fund_options, "ELSS", 2)
            hybrid = select_top_assets(fund_options, "Hybrid", 1)
            fund_selection = pd.concat([elss, hybrid]).drop_duplicates(subset=["name"]).head(3)
        else:  # high risk
            # For high risk, small cap
            fund_selection = select_top_assets(fund_options, "Small Cap", 3)
        
        if len(fund_selection) > 0:
            per_asset = category_amounts["funds"] / len(fund_selection)
            for _, asset in fund_selection.iterrows():
                selected_assets.append({
                    "name": asset["name"],
                    "category": f"Fund - {asset['category']}",
                    "risk": asset["risk"],
                    "invested_amount": round(per_asset, 2),
                    "percentage": round((per_asset / amount) * 100, 2),
                    "expected_return": asset["expected_return"],
                    "risk_score": RISK_SCORES[asset["risk"]]
                })
    
    return {
        "allocation": allocation,
        "assets": selected_assets,
        "total_amount": amount
    }


def calculate_projected_growth(amount: float, assets: List[Dict], years: int) -> List[Dict]:
    """
    Calculate year-by-year projected portfolio growth.
    Uses weighted average expected return across all assets.
    """
    if not assets:
        return []
    
    # Calculate weighted average return
    total_weighted_return = sum(
        asset["invested_amount"] * asset["expected_return"] 
        for asset in assets
    )
    weighted_return = total_weighted_return / amount
    
    # Generate year-by-year projections
    growth_data = []
    for year in range(years + 1):
        projected_value = amount * (1 + weighted_return / 100) ** year
        growth_data.append({
            "year": year,
            "value": round(projected_value, 2)
        })
    
    return growth_data


def get_risk_return_data(assets: List[Dict]) -> List[Dict]:
    """
    Prepare risk vs return data for charting.
    """
    return [
        {
            "name": asset["name"],
            "risk_score": asset["risk_score"],
            "expected_return": asset["expected_return"]
        }
        for asset in assets
    ]
