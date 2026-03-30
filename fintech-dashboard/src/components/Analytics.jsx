import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useInvestment } from '../context/InvestmentContext'
import { useNavigate } from 'react-router-dom'

const TrendingUp = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const ArrowLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m17 17-10-10m0 0v6m0-6h6"/>
  </svg>
)

export default function Analytics() {
  const { portfolio, assets } = useInvestment()
  const navigate = useNavigate()
  const [chartData, setChartData] = useState(null)

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Generate chart data on component mount
  useEffect(() => {
    if (assets && assets.length > 0) {
      generateChartData()
    }
  }, [assets])

  const generateChartData = () => {
    // Pie Chart Data - Asset Allocation
    const pieData = assets.map(asset => ({
      name: asset.name,
      value: asset.invested_amount || 0,
      percentage: asset.percentage || 0,
      color: getAssetColor(asset.category)
    }))

    // Line Chart Data - Portfolio Growth Over Time
    const totalInvestment = assets.reduce((sum, asset) => sum + (asset.invested_amount || 0), 0)
    const expectedReturn = portfolio?.expected_return || 12
    const years = 10
    
    const growthData = []
    for (let year = 0; year <= years; year++) {
      const value = totalInvestment * Math.pow(1 + (expectedReturn / 100), year)
      growthData.push({
        year,
        value: Math.round(value)
      })
    }

    // Bar Chart Data - Returns Comparison
    const barData = assets.map(asset => ({
      name: asset.name.length > 15 ? asset.name.substring(0, 15) + '...' : asset.name,
      expected: asset.expected_return || 0,
      category: asset.category
    }))

    // Risk vs Return Data
    const riskReturnData = assets.map(asset => ({
      name: asset.name.length > 12 ? asset.name.substring(0, 12) + '...' : asset.name,
      risk: getRiskLevel(asset.category),
      return: asset.expected_return || 0,
      category: asset.category
    }))

    setChartData({
      pie: pieData,
      growth: growthData,
      bar: barData,
      riskReturn: riskReturnData
    })
  }

  const getAssetColor = (category) => {
    const colors = {
      'equity': '#10b981',
      'debt': '#3b82f6', 
      'fund': '#8b5cf6',
      'stock': '#10b981',
      'bond': '#3b82f6',
      'crypto': '#f59e0b',
      'commodity': '#ec4899'
    }
    return colors[category.toLowerCase()] || '#6b7280'
  }

  const getRiskLevel = (category) => {
    const riskLevels = {
      'equity': 8,
      'debt': 2,
      'fund': 5,
      'stock': 8,
      'bond': 2,
      'crypto': 10,
      'commodity': 6
    }
    return riskLevels[category.toLowerCase()] || 5
  }

  if (!chartData) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
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
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Portfolio Analytics
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Detailed analysis of your investment portfolio performance and allocation.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/results')}
            className="flex items-center gap-2 px-6 py-3 glass border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
          >
            <ArrowLeft />
            Back to Results
          </motion.button>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart - Asset Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-xl"
          >
            <h3 className="text-xl font-bold text-white mb-6">Asset Allocation</h3>
            <div className="space-y-4">
              {chartData.pie.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300 text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{item.percentage.toFixed(1)}%</div>
                    <div className="text-gray-400 text-sm">{formatCurrency(item.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Line Chart - Portfolio Growth */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-xl"
          >
            <h3 className="text-xl font-bold text-white mb-6">Portfolio Growth (10 Years)</h3>
            <div className="relative h-80 w-full">
              {/* SVG Line Chart */}
              <svg className="w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Y-axis labels */}
                <text x="10" y="15" fill="#6b7280" fontSize="10">Value</text>
                
                {/* X-axis labels */}
                <text x="10" y="295" fill="#6b7280" fontSize="10">Years</text>
                
                {/* Area fill under the line */}
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 1 }}
                  d={`M 50 250 ${chartData.growth.map((point, index) => {
                    const x = 50 + (index / (chartData.growth.length - 1)) * 500
                    const y = 250 - ((point.value - chartData.growth[0].value) / (chartData.growth[chartData.growth.length - 1].value - chartData.growth[0].value)) * 200
                    return `L ${x} ${y}`
                  }).join(' ')} L 550 250 Z`}
                  fill="url(#lineGradient)"
                />
                
                {/* Gradient for area */}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                
                {/* The main line */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d={`M 50 250 ${chartData.growth.map((point, index) => {
                    const x = 50 + (index / (chartData.growth.length - 1)) * 500
                    const y = 250 - ((point.value - chartData.growth[0].value) / (chartData.growth[chartData.growth.length - 1].value - chartData.growth[0].value)) * 200
                    return `L ${x} ${y}`
                  }).join(' ')}`}
                  fill="none"
                  stroke="url(#strokeGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Gradient for stroke */}
                <defs>
                  <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
                
                {/* Data points on the line */}
                {chartData.growth.map((point, index) => {
                  const x = 50 + (index / (chartData.growth.length - 1)) * 500
                  const y = 250 - ((point.value - chartData.growth[0].value) / (chartData.growth[chartData.growth.length - 1].value - chartData.growth[0].value)) * 200
                  return (
                    <motion.g key={index}>
                      {/* Outer glow */}
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="rgba(6, 182, 212, 0.3)"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      />
                      {/* Inner point */}
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#fff"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      />
                      {/* Value label */}
                      {index % 2 === 0 && (
                        <motion.text
                          x={x}
                          y={y - 15}
                          fill="#fff"
                          fontSize="10"
                          textAnchor="middle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + index * 0.05 }}
                        >
                          {formatCurrency(point.value)}
                        </motion.text>
                      )}
                      {/* Year label */}
                      <motion.text
                        x={x}
                        y="270"
                        fill="#9ca3af"
                        fontSize="10"
                        textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        Y{point.year}
                      </motion.text>
                    </motion.g>
                  )
                })}
              </svg>
            </div>
            
            {/* Summary Stats Below Chart */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-gray-400 text-sm">Initial Investment</div>
                <div className="text-white font-semibold">{formatCurrency(chartData.growth[0].value)}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Final Value (10 Years)</div>
                <div className="text-cyan-400 font-semibold">{formatCurrency(chartData.growth[chartData.growth.length - 1].value)}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Total Growth</div>
                <div className="text-green-400 font-semibold">
                  +{((chartData.growth[chartData.growth.length - 1].value - chartData.growth[0].value) / chartData.growth[0].value * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bar Chart - Returns Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 rounded-xl mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Expected Returns Comparison</h3>
          <div className="space-y-4">
            {chartData.bar.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-gray-300 text-sm w-32">{item.name}</span>
                <div className="flex-1 bg-white/5 rounded-full h-8 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.expected * 5, 100)}%` }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  />
                </div>
                <span className="text-white text-sm font-medium w-16 text-right">
                  {item.expected.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk vs Return Scatter Plot */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 rounded-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6">Risk vs Return Analysis</h3>
          <div className="relative h-64 bg-white/5 rounded-lg p-4">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="border border-white/5" />
              ))}
            </div>
            
            {/* Data points */}
            {chartData.riskReturn.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{
                  backgroundColor: getAssetColor(item.category),
                  left: `${(item.risk / 10) * 100}%`,
                  bottom: `${(item.return / 20) * 100}%`,
                  transform: 'translate(-50%, 50%)'
                }}
                title={`${item.name}: Risk ${item.risk}/10, Return ${item.return}%`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {item.name}
                </div>
              </motion.div>
            ))}
            
            {/* Axes labels */}
            <div className="absolute bottom-0 left-0 text-xs text-gray-400">Low Risk</div>
            <div className="absolute bottom-0 right-0 text-xs text-gray-400">High Risk</div>
            <div className="absolute top-0 left-0 text-xs text-gray-400">High Return</div>
            <div className="absolute bottom-0 left-0 text-xs text-gray-400">Low Return</div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-4 gap-6 mt-8"
        >
          {[
            {
              label: 'Total Investment',
              value: formatCurrency(assets.reduce((sum, asset) => sum + (asset.invested_amount || 0), 0)),
              icon: '💰'
            },
            {
              label: 'Expected Annual Return',
              value: `${portfolio?.expected_return || 12}%`,
              icon: '📈'
            },
            {
              label: 'Number of Assets',
              value: assets.length.toString(),
              icon: '📊'
            },
            {
              label: 'Risk Profile',
              value: portfolio?.portfolio_type?.charAt(0).toUpperCase() + portfolio?.portfolio_type?.slice(1) || 'Balanced',
              icon: '⚡'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="glass-card p-6 rounded-xl text-center"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <h4 className="text-gray-400 text-sm mb-2">{stat.label}</h4>
              <p className="text-xl font-bold gradient-text">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
