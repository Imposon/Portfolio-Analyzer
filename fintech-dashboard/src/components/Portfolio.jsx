import { motion } from 'framer-motion'
import { useState } from 'react'
import { useInvestment } from '../context/InvestmentContext'
import PortfolioModal from './PortfolioModal'

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

const Bitcoin = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.06 13.94a2.5 2.5 0 0 0 0-3.88 2.5 2.5 0 0 0 0 3.88Z"/>
    <path d="M12 2v20M8 7h5a3 3 0 0 1 0 6M8 17h5a3 3 0 0 1 0 6"/>
  </svg>
)

const Wallet = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>
    <path d="M3 12h18"/>
    <path d="M15 12v-2"/>
  </svg>
)

const DollarSign = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

const PoundSterling = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M16 7H8.5a2.5 2.5 0 0 0 0 5h6a2.5 2.5 0 0 1 0 5H7"/>
  </svg>
)

const X = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const Plus = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

export default function Portfolio() {
  const { portfolio, assets, loading, error, totalValue, totalReturn } = useInvestment()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  function getAssetIcon(category) {
    const icons = {
      'crypto': Bitcoin,
      'stock': Wallet,
      'forex': DollarSign,
      'commodity': PoundSterling,
    }
    return icons[category.toLowerCase()] || Wallet
  }

  function getAssetColor(category) {
    const colors = {
      'crypto': 'from-orange-400 to-yellow-500',
      'stock': 'from-green-400 to-emerald-500',
      'forex': 'from-blue-400 to-cyan-500',
      'commodity': 'from-purple-400 to-pink-500',
    }
    return colors[category.toLowerCase()] || 'from-gray-400 to-gray-500'
  }

  // Show empty state if no portfolio exists
  if (!portfolio || assets.length === 0) {
    return (
      <section id="portfolio" className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass mb-8">
              <Wallet />
              <span className="text-gray-400">No Portfolio Yet</span>
            </div>
            
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Start Your Investment Journey
            </h2>
            
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Create your first portfolio to get personalized investment recommendations 
              based on your risk profile and financial goals.
            </p>

            {/* Create Portfolio Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-3 px-8 py-4 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <Plus />
              <span>Create Portfolio</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Portfolio Modal */}
        <PortfolioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </section>
    )
  }

  // Show portfolio results if portfolio exists
  const transformedAssets = assets.map(asset => ({
    name: asset.name || 'Unknown Asset',
    symbol: asset.symbol || asset.ticker || 'N/A',
    value: asset.value || formatCurrency(asset.current_value || asset.value || 0),
    change: asset.change || `${asset.change_percent >= 0 ? '+' : ''}${asset.change_percent?.toFixed(2) || '0.00'}%`,
    up: asset.up || asset.change_percent >= 0,
    icon: asset.icon || getAssetIcon(asset.category || 'stock'),
    color: asset.color || getAssetColor(asset.category || 'stock'),
    amount: asset.amount || `${asset.quantity || 0} ${asset.symbol || asset.ticker || 'units'}`,
  }))

  return (
    <section id="portfolio" className="relative py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Total Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 mb-12 max-w-2xl mx-auto text-center"
        >
          <p className="text-gray-400 mb-2">
            Total Balance <span className="text-xs ml-2 text-cyan-400">({portfolio?.portfolio_type || 'BALANCED'} PROFILE)</span>
          </p>
          <h3 className="text-5xl font-bold gradient-text mb-4">
            {formatCurrency(portfolio?.total_value || totalValue || 0)}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp />
            <span className="text-green-400">
              {portfolio?.total_return >= 0 ? '+' : ''}{portfolio?.total_return?.toFixed(2) || totalReturn?.toFixed(2) || '0.00'}%
            </span>
            <span className="text-gray-500">expected annual return</span>
          </div>
        </motion.div>

        {/* Asset Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transformedAssets.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, rotateX: -5 }}
              className="group glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Asset Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${asset.color}`}>
                  <asset.icon />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  asset.up ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {asset.up ? <TrendingUp /> : <TrendingDown />}
                  <span>{asset.change}</span>
                </div>
              </div>

              {/* Asset Info */}
              <div>
                <h4 className="font-semibold text-white mb-1">{asset.name}</h4>
                <p className="text-2xl font-bold text-white mb-2">{asset.value}</p>
                <p className="text-sm text-gray-500">{asset.amount}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Explanation Section */}
        {portfolio?.ai_explanation && showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 glass-card p-8 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold gradient-text">AI Investment Analysis</h3>
              <button
                onClick={() => setShowExplanation(false)}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
              >
                <X />
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: portfolio.ai_explanation
                    .replace(/## /g, '<h3 class="text-xl font-bold text-white mb-4">')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>')
                    .replace(/\n/g, '<br class="mb-2">')
                }} 
                className="text-gray-300 leading-relaxed"
              />
            </div>
          </motion.div>
        )}

        {/* Show Explanation Button */}
        {portfolio?.ai_explanation && !showExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExplanation(true)}
              className="px-6 py-3 glass border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all"
            >
              View AI Analysis
            </motion.button>
          </motion.div>
        )}

        {/* Action Button */}
        {transformedAssets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 glass border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
            >
              Manage Portfolio
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Portfolio Modal */}
      <PortfolioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
