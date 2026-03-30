"""
Portfolio allocation and recommendation service.
Handles asset selection based on risk profile and allocation strategy.
"""
import json
from typing import List, Dict, Any
from .risk import RiskScorer
class PortfolioRecommender:
    """Handles portfolio allocation and asset recommendations."""
    ASSETS_DATASET = {
        'debt': [
            {
                'name': 'HDFC Short Term Debt Fund',
                'category': 'Debt - Short Term',
                'risk_level': 'low',
                'expected_return': 7.2
            },
            {
                'name': 'SBI Liquid Fund',
                'category': 'Debt - Liquid',
                'risk_level': 'low',
                'expected_return': 6.8
            }
        ],
        'mutual_funds': [
            {
                'name': 'SBI Bluechip Fund',
                'category': 'Fund - Large Cap',
                'risk_level': 'medium',
                'expected_return': 12.5
            },
            {
                'name': 'Axis Growth Opportunities Fund',
                'category': 'Fund - Mid Cap',
                'risk_level': 'medium',
                'expected_return': 14.2
            },
            {
                'name': 'Nippon India Index Fund',
                'category': 'Fund - Index',
                'risk_level': 'low',
                'expected_return': 11.8
            }
        ],
        'stocks': [
            {
                'name': 'Reliance Industries',
                'category': 'Equity - Large Cap',
                'risk_level': 'high',
                'expected_return': 15.3
            },
            {
                'name': 'TCS',
                'category': 'Equity - IT',
                'risk_level': 'medium',
                'expected_return': 12.8
            },
            {
                'name': 'HDFC Bank',
                'category': 'Equity - Banking',
                'risk_level': 'medium',
                'expected_return': 14.5
            },
            {
                'name': 'Zomato',
                'category': 'Equity - Consumer',
                'risk_level': 'high',
                'expected_return': 18.2
            }
        ]
    }
    @classmethod
    def allocate_portfolio(cls, amount: float, risk_level: str, horizon: int, goal: str) -> Dict[str, Any]:
        """
        Generate portfolio allocation based on user input.
        Args:
            amount: Total investment amount
            risk_level: User's risk tolerance
            horizon: Investment horizon in years
            goal: Financial goal
        Returns:
            Complete portfolio allocation with recommendations
        """
        risk_assessment = RiskScorer.calculate_risk_score(risk_level, horizon, goal)
        profile = risk_assessment['profile']
        allocation_strategy = RiskScorer.get_allocation_strategy(profile)
        allocations = {}
        for asset_class, percentage in allocation_strategy.items():
            allocated_amount = (amount * percentage) / 100
            allocations[asset_class] = {
                'percentage': percentage,
                'amount': allocated_amount
            }
        selected_assets = cls._select_assets(allocation_strategy)
        portfolio_assets = cls._distribute_amounts(selected_assets, allocations)
        expected_return = cls._calculate_expected_return(portfolio_assets)
        return {
            'portfolio_type': profile,
            'risk_assessment': risk_assessment,
            'allocation': allocation_strategy,
            'assets': portfolio_assets,
            'expected_return': round(cls._calculate_expected_return(portfolio_assets), 2),
            'total_amount': amount
        }
    @classmethod
    def _select_assets(cls, allocation_strategy: Dict[str, int]) -> Dict[str, List[Dict]]:
        """
        Select specific assets based on allocation strategy.
        """
        selected = {}
        for asset_class, percentage in allocation_strategy.items():
            if percentage > 0 and asset_class in cls.ASSETS_DATASET:
                available_assets = cls.ASSETS_DATASET[asset_class]
                if asset_class == 'stocks':
                    selected[asset_class] = sorted(available_assets,
                                               key=lambda x: x['expected_return'],
                                               reverse=True)[:3]
                elif asset_class == 'mutual_funds':
                    selected[asset_class] = sorted(available_assets,
                                               key=lambda x: x['expected_return'],
                                               reverse=True)[:2]
                else:
                    selected[asset_class] = available_assets
        return selected
    @classmethod
    def _distribute_amounts(cls, selected_assets: Dict[str, List[Dict]],
                           allocations: Dict[str, Dict]) -> List[Dict]:
        """
        Distribute allocated amounts among selected assets.
        """
        portfolio_assets = []
        for asset_class, assets in selected_assets.items():
            if asset_class in allocations:
                total_amount = allocations[asset_class]['amount']
                percentage = allocations[asset_class]['percentage']
                amount_per_asset = total_amount / len(assets)
                for asset in assets:
                    portfolio_assets.append({
                        'name': asset['name'],
                        'category': asset['category'],
                        'risk': asset['risk_level'],
                        'invested_amount': amount_per_asset,
                        'percentage': percentage / len(assets),
                        'expected_return': asset['expected_return']
                    })
        return portfolio_assets
    @classmethod
    def _calculate_expected_return(cls, assets: List[Dict]) -> float:
        """
        Calculate weighted average expected return.
        """
        if not assets:
            return 0.0
        total_amount = sum(asset['invested_amount'] for asset in assets)
        weighted_return = sum(
            asset['invested_amount'] * asset['expected_return']
            for asset in assets
        )
        return round(weighted_return / total_amount, 2) if total_amount > 0 else 0.0