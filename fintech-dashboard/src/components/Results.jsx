import { motion } from 'framer-motion'
import { useState } from 'react'
import { useInvestment } from '../context/InvestmentContext'
import { useNavigate } from 'react-router-dom'
import { investmentAPI } from '../services/api'

const TrendingUp = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const TrendingDown = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
)

const Brain = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5c0 1.39-1.11 2.5-2.5 2.5S7 5.89 7 4.5 8.11 2 9.5 2z"/>
    <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5c0 1.39-1.11 2.5-2.5 2.5S12 5.89 12 4.5 13.11 2 14.5 2z"/>
    <path d="M12 4.5v8"/>
    <path d="M12 12.5a5 5 0 0 1-5 5c-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5 2.5 1.11 2.5 2.5"/>
    <path d="M12 12.5a5 5 0 0 0 5 5c1.39 0 2.5-1.11 2.5-2.5s-1.11-2.5-2.5-2.5-2.5 1.11-2.5 2.5"/>
  </svg>
)

const ArrowRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m7 17 10-10m0 0v6m0-6h-6"/>
  </svg>
)

export default function Results() {
  const { portfolio, assets, loading, error } = useInvestment()
  const navigate = useNavigate()
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [aiAnalysis, setAIAnalysis] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)

  // Calculate total investment from assets or portfolio amount
  const totalInvestment = assets.reduce((sum, asset) => sum + (asset.invested_amount || 0), 0) || portfolio?.amount || 0

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getAssetIcon = (category) => {
    const icons = {
      'equity': '📈',
      'debt': '🏦',
      'fund': '💼',
      'stock': '📊',
      'bond': '🏛️',
      'crypto': '₿',
      'commodity': '🥇'
    }
    return icons[category.toLowerCase()] || '💰'
  }

  const getAssetColor = (category) => {
    const colors = {
      'equity': 'from-green-400 to-emerald-500',
      'debt': 'from-blue-400 to-cyan-500',
      'fund': 'from-purple-400 to-pink-500',
      'stock': 'from-green-400 to-emerald-500',
      'bond': 'from-blue-400 to-cyan-500',
      'crypto': 'from-orange-400 to-yellow-500',
      'commodity': 'from-purple-400 to-pink-500'
    }
    return colors[category.toLowerCase()] || 'from-gray-400 to-gray-500'
  }

  const handleAIAnalysis = async () => {
    if (aiAnalysis) {
      setShowAIAnalysis(true)
      return
    }

    setLoadingAI(true)
    try {
      // Use the API service with timeout and fallback
      const data = await investmentAPI.getAIAnalysis({
        portfolio: portfolio,
        assets: assets
      })
      
      setAIAnalysis(data.analysis || 'Analysis not available')
      setShowAIAnalysis(true)
    } catch (error) {
      console.error('AI Analysis error:', error)
      // Fallback should already be handled by API service, but just in case
      setAIAnalysis(generateFallbackAnalysis())
      setShowAIAnalysis(true)
    } finally {
      setLoadingAI(false)
    }
  }

  // Generate fallback analysis when API fails
  const generateFallbackAnalysis = () => {
    const totalValue = assets.reduce((sum, asset) => sum + (asset.invested_amount || 0), 0)
    const avgReturn = portfolio?.expected_return || 12
    const dailyRevenue = (totalValue * (avgReturn / 100)) / 365
    
    return `## AI Investment Analysis

### Why This Portfolio Suits You

This **${portfolio?.portfolio_type || 'balanced'}** portfolio is designed to match your risk profile and investment goals. The allocation balances growth potential with stability through diversified assets across equity, debt, and funds.

### Daily Expected Revenue

Based on your total investment of **${formatCurrency(totalValue)}** and expected annual return of **${avgReturn}%**:

- **Daily Revenue**: ~${formatCurrency(dailyRevenue)}
- **Monthly Revenue**: ~${formatCurrency(dailyRevenue * 30)}
- **Annual Revenue**: ~${formatCurrency(dailyRevenue * 365)}

### Action Steps to Get Started

1. **Open Investment Accounts**
   - Zerodha or Upstox for stocks
   - Groww or Coin by Zerodha for mutual funds
   - Your bank for FD/RD

2. **Start Systematic Investment**
   - Set up SIPs for mutual funds
   - Use STP (Systematic Transfer Plan) for debt funds
   - Schedule recurring deposits

3. **Monitor & Rebalance**
   - Review portfolio quarterly
   - Rebalance if allocation drifts >5%
   - Track performance against benchmarks

### Risk Summary

- **Portfolio Risk Level**: ${portfolio?.portfolio_type?.toUpperCase() || 'MODERATE'}
- **Volatility**: ${avgReturn > 15 ? 'High' : avgReturn > 10 ? 'Medium' : 'Low'}
- **Suitable for**: ${avgReturn > 15 ? 'Aggressive investors' : avgReturn > 10 ? 'Balanced investors' : 'Conservative investors'}

*Note: This analysis is AI-generated based on your portfolio configuration. Past performance does not guarantee future returns.*`
  }

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your investment plan...</p>
        </div>
      </section>
    )
  }

  if (!portfolio) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8 max-w-md">
          <h3 className="text-2xl font-bold gradient-text mb-4">No Portfolio Found</h3>
          <p className="text-gray-400 mb-6">Please create a portfolio first to view your investment recommendations.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Create Portfolio
          </button>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8 max-w-md">
          <h3 className="text-2xl font-bold text-red-400 mb-4">Error</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-cyan-400 text-black rounded-lg hover:bg-cyan-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Your Investment Portfolio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Here's your personalized investment plan based on your risk profile and financial goals.
          </p>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 mb-12 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">{getAssetIcon('equity')}</div>
              <h3 className="text-white font-semibold mb-1">Total Investment</h3>
              <p className="text-2xl font-bold gradient-text">
                {formatCurrency(totalInvestment)}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">{getAssetIcon('fund')}</div>
              <h3 className="text-white font-semibold mb-1">Risk Profile</h3>
              <p className="text-2xl font-bold gradient-text capitalize">
                {portfolio.portfolio_type || 'Balanced'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="text-white font-semibold mb-1">Expected Return</h3>
              <p className="text-2xl font-bold gradient-text">
                {portfolio.expected_return ? `${portfolio.expected_return}%` : '12-15%'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Investment Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold gradient-text text-center mb-8">
            Investment Recommendations
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300"
              >
                {/* Asset Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getAssetColor(asset.category)}`}>
                    <span className="text-2xl">{getAssetIcon(asset.category)}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    asset.expected_return >= 0 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {asset.expected_return >= 0 ? <TrendingUp /> : <TrendingDown />}
                    <span>{asset.expected_return >= 0 ? '+' : ''}{asset.expected_return?.toFixed(2) || '0.00'}%</span>
                  </div>
                </div>

                {/* Asset Info */}
                <div>
                  <h3 className="font-semibold text-white mb-2">{asset.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{asset.category}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Investment:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(asset.invested_amount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Allocation:</span>
                      <span className="text-white font-medium">
                        {asset.percentage?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected:</span>
                      <span className="text-white font-medium">
                        {asset.expected_return?.toFixed(2) || '0.00'}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAIAnalysis}
            disabled={loadingAI}
            className="group flex items-center gap-3 px-8 py-4 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
          >
            {loadingAI ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Brain />
                <span>AI Analysis</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* AI Analysis Modal */}
        {showAIAnalysis && aiAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowAIAnalysis(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold gradient-text">AI Investment Analysis</h3>
                <button
                  onClick={() => setShowAIAnalysis(false)}
                  className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: aiAnalysis
                      .replace(/## /g, '<h3 class="text-xl font-bold text-white mb-4">')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>')
                      .replace(/\n/g, '<br class="mb-2">')
                  }} 
                  className="text-gray-300 leading-relaxed"
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/analytics')}
              className="px-8 py-4 glass border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
            >
              View Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 glass border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all"
            >
              Create New Portfolio
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
