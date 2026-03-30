"""
Risk scoring service for investment advisor.
Converts user input into numeric risk scores and profiles.
"""

class RiskScorer:
    """Handles risk assessment and user profiling."""
    
    @staticmethod
    def calculate_risk_score(risk_level: str, horizon: int, goal: str) -> dict:
        """
        Calculate risk score and determine user profile.
        
        Args:
            risk_level: User's risk tolerance (low, medium, high)
            horizon: Investment time horizon in years
            goal: Financial goal (wealth, tax, passive, capital)
            
        Returns:
            dict with risk_score, profile, and risk_factors
        """
        
        # Base risk score from user input
        risk_scores = {
            'low': 1,
            'medium': 2,
            'high': 3
        }
        
        base_score = risk_scores.get(risk_level, 2)
        
        # Adjust score based on time horizon
        if horizon <= 3:
            horizon_adjustment = -0.5  # Short term = lower risk
        elif horizon <= 7:
            horizon_adjustment = 0     # Medium term = no change
        else:
            horizon_adjustment = 0.5   # Long term = higher risk tolerance
            
        # Adjust score based on goal
        goal_adjustments = {
            'capital': -0.5,    # Capital preservation = lower risk
            'tax': 0,           # Tax saving = neutral
            'passive': 0.2,       # Passive income = slightly higher
            'wealth': 0.3          # Wealth creation = higher risk
        }
        
        goal_adjustment = goal_adjustments.get(goal, 0)
        
        # Calculate final risk score
        final_score = base_score + horizon_adjustment + goal_adjustment
        
        # Determine profile
        if final_score <= 1.5:
            profile = 'conservative'
        elif final_score <= 2.5:
            profile = 'balanced'
        else:
            profile = 'aggressive'
            
        return {
            'risk_score': round(final_score, 2),
            'profile': profile,
            'base_risk': risk_level,
            'horizon_years': horizon,
            'goal': goal,
            'risk_factors': {
                'base_score': base_score,
                'horizon_adjustment': horizon_adjustment,
                'goal_adjustment': goal_adjustment
            }
        }
    
    @staticmethod
    def get_allocation_strategy(profile: str) -> dict:
        """
        Get allocation percentages based on risk profile.
        
        Args:
            profile: User's risk profile (conservative, balanced, aggressive)
            
        Returns:
            dict with allocation percentages
        """
        
        strategies = {
            'conservative': {
                'debt': 50,
                'mutual_funds': 30,
                'stocks': 20
            },
            'balanced': {
                'debt': 20,
                'mutual_funds': 50,
                'stocks': 30
            },
            'aggressive': {
                'debt': 10,
                'mutual_funds': 20,
                'stocks': 70
            }
        }
        
        return strategies.get(profile, strategies['balanced'])
