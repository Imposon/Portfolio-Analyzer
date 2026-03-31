
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const fetchWithTimeout = async (url, options, timeout = 20000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend not responding')
    }
    throw error
  }
}

class InvestmentAdvisorAPI {

  async generatePortfolio(data) {
    console.log('Generating portfolio with data:', data)

    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/portfolio/generate-portfolio`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: data.amount,
            risk: data.risk,
            horizon: data.horizon,
            goal: data.goal
          }),
        },
        15000
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to generate portfolio')
      }

      const result = await response.json()
      console.log('Portfolio generated successfully:', result)
      return result

    } catch (error) {
      console.error('Error generating portfolio:', error)
      console.log('Falling back to mock data...')

      return this.getMockPortfolioData(data)
    }
  }

  getMockPortfolioData(data) {
    const amount = data.amount || 100000
    const risk = data.risk || 'moderate'

    const allocations = {
      conservative: { equity: 0.3, debt: 0.5, fund: 0.15, commodity: 0.05 },
      moderate: { equity: 0.5, debt: 0.3, fund: 0.15, commodity: 0.05 },
      aggressive: { equity: 0.7, debt: 0.15, fund: 0.1, commodity: 0.05 }
    }

    const alloc = allocations[risk] || allocations.moderate

    return {
      portfolio_id: 1,
      portfolio_type: risk,
      expected_return: risk === 'conservative' ? 8.5 : risk === 'moderate' ? 12.5 : 16.8,
      allocation: { equity: alloc.equity, debt: alloc.debt, fund: alloc.fund, commodity: alloc.commodity },
      assets: [
        { name: 'Reliance Industries', category: 'equity', invested_amount: amount * alloc.equity * 0.4, percentage: alloc.equity * 40, expected_return: 15.5 },
        { name: 'HDFC Bank', category: 'equity', invested_amount: amount * alloc.equity * 0.35, percentage: alloc.equity * 35, expected_return: 14.2 },
        { name: 'TCS', category: 'equity', invested_amount: amount * alloc.equity * 0.25, percentage: alloc.equity * 25, expected_return: 13.8 },
        { name: 'Axis Growth Fund', category: 'fund', invested_amount: amount * alloc.fund * 0.6, percentage: alloc.fund * 60, expected_return: 12.5 },
        { name: 'HDFC Short Term Debt', category: 'debt', invested_amount: amount * alloc.debt * 0.7, percentage: alloc.debt * 70, expected_return: 7.2 },
        { name: 'SBI Fixed Deposit', category: 'debt', invested_amount: amount * alloc.debt * 0.3, percentage: alloc.debt * 30, expected_return: 6.5 }
      ],
      ai_explanation: `## Why This Portfolio Suits You\\n\\nThis ${risk} portfolio is designed to balance risk and reward based on your investment horizon of ${data.horizon} years. **Equity allocation** provides growth potential through quality Indian stocks like Reliance and HDFC Bank.\\n\\n## Action Steps\\n\\n1. **Open a Demat Account** with a registered broker\\n2. **Start SIPs** for mutual fund investments\\n3. **Review quarterly** and rebalance as needed\\n\\n## Expected Returns\\n\\n- **Expected Annual Return**: ${risk === 'conservative' ? '8-10%' : risk === 'moderate' ? '12-15%' : '15-20%'}\\n- **Risk Level**: ${risk.charAt(0).toUpperCase() + risk.slice(1)}\\n- **Investment Horizon**: ${data.horizon} years`
    }
  }

  async getAIAnalysis(data) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/ai-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portfolio: data.portfolio,
            assets: data.assets
          }),
        },
        20000
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to get AI analysis')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting AI analysis:', error)
      console.log('Falling back to mock AI analysis...')

      return this.getMockAIAnalysis(data)
    }
  }

  getMockAIAnalysis(data) {
    const portfolio = data.portfolio || {}
    const assets = data.assets || []
    const totalValue = assets.reduce((sum, asset) => sum + (asset.invested_amount || 0), 0)
    const avgReturn = portfolio.expected_return || 12
    const dailyRevenue = totalValue > 0 ? (totalValue * (avgReturn / 100)) / 365 : 0

    return {
      analysis: `## AI Investment Analysis

### Why This Portfolio Suits You

This **${portfolio.portfolio_type || 'balanced'}** portfolio is designed to match your risk profile and investment goals. The allocation balances growth potential with stability through diversified assets across equity, debt, and funds.

### Daily Expected Revenue

Based on your total investment of **₹${totalValue.toLocaleString('en-IN')}** and expected annual return of **${avgReturn}%**:

- **Daily Revenue**: ~₹${Math.round(dailyRevenue).toLocaleString('en-IN')}
- **Monthly Revenue**: ~₹${Math.round(dailyRevenue * 30).toLocaleString('en-IN')}
- **Annual Revenue**: ~₹${Math.round(dailyRevenue * 365).toLocaleString('en-IN')}

### Action Steps to Get Started

1. **Open Investment Accounts**
   - Zerodha or Upstox for stocks
   - Groww or Coin by Zerodha for mutual funds
   - Your bank for FD/RD

2. **Start Systematic Investment**
   - Set up SIPs for mutual funds
   - Use STP for debt funds
   - Schedule recurring deposits

3. **Monitor & Rebalance**
   - Review portfolio quarterly
   - Rebalance if allocation drifts >5%
   - Track performance against benchmarks

### Risk Summary

- **Portfolio Risk Level**: ${(portfolio.portfolio_type || 'moderate').toUpperCase()}
- **Volatility**: ${avgReturn > 15 ? 'High' : avgReturn > 10 ? 'Medium' : 'Low'}
- **Suitable for**: ${avgReturn > 15 ? 'Aggressive investors' : avgReturn > 10 ? 'Balanced investors' : 'Conservative investors'}

*Note: This analysis is AI-generated. Past performance does not guarantee future returns.*`
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      if (!response.ok) throw new Error('Backend not available')
      return await response.json()
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }

  getCategoryFromName(name) {
    if (!name) return 'stock'
    const lowerName = name.toLowerCase()
    if (lowerName.includes('bitcoin') || lowerName.includes('crypto') || lowerName.includes('btc')) return 'crypto'
    if (lowerName.includes('gold') || lowerName.includes('silver') || lowerName.includes('commodity')) return 'commodity'
    if (lowerName.includes('bond') || lowerName.includes('debenture')) return 'bond'
    return 'stock'
  }

  async getPortfolio() {

    console.warn('getPortfolio() is deprecated. Use generatePortfolio() instead.')
    return null
  }

  async createPortfolio(data) {

    console.warn('createPortfolio() is deprecated. Use generatePortfolio() instead.')
    return this.generatePortfolio({
      amount: data.initial_amount,
      risk: data.risk_tolerance === 'moderate' ? 'medium' : data.risk_tolerance,
      horizon: data.investment_horizon === 'short' ? 3 : data.investment_horizon === 'medium' ? 7 : 15,
      goal: 'wealth'
    })
  }

  async allocateFunds(data) {

    console.warn('allocateFunds() is deprecated. Use generatePortfolio() instead.')
    return this.generatePortfolio({
      amount: data.total_amount,
      risk: 'moderate',
      horizon: 5,
      goal: 'wealth'
    })
  }

  async getAnalysis() {

    console.warn('getAnalysis() is deprecated.')
    return {
      overview: {
        total_return: 18.5,
        risk_score: 'Medium',
        diversification: 'Good',
        performance: 'Above Average'
      }
    }
  }

  async getRecommendations() {

    console.warn('getRecommendations() is deprecated.')
    return {
      recommendations: [
        'Consider increasing equity allocation for long-term growth',
        'Diversify into international funds',
        'Review portfolio quarterly for rebalancing'
      ]
    }
  }

  async getRiskAnalysis(data) {

    console.warn('getRiskAnalysis() is deprecated.')
    throw new Error('Use the new portfolio generation flow instead')
  }

  async getAIInsights(query) {

    console.warn('getAIInsights() is deprecated.')
    throw new Error('Use the new AI analysis flow instead')
  }
}

export const investmentAPI = new InvestmentAdvisorAPI()
