import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInvestment } from '../context/InvestmentContext'

const Plus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const X = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function PortfolioModal({ isOpen, onClose }) {
  const { createPortfolio, allocateFunds, loading } = useInvestment()
  const [activeTab, setActiveTab] = useState('create')
  const [formData, setFormData] = useState({
    name: '',
    initial_amount: '',
    risk_tolerance: 'medium',
    investment_horizon: 'medium',
    goal: 'wealth', // Add financial goal
  })
  const [allocationData, setAllocationData] = useState({
    total_amount: '',
    stocks: 40,
    bonds: 30,
    crypto: 20,
    commodities: 10,
  })

  const handleSubmitCreate = async (e) => {
    e.preventDefault()
    
    // Form validation
    if (!formData.name.trim()) {
      alert('Please enter a portfolio name')
      return
    }
    
    if (!formData.initial_amount || parseFloat(formData.initial_amount) < 1000) {
      alert('Investment amount must be at least ₹1,000')
      return
    }
    
    try {
      await createPortfolio({
        ...formData,
        initial_amount: parseFloat(formData.initial_amount),
        // Map investment_horizon to years
        investment_horizon: formData.investment_horizon === 'short' ? 3 : 
                         formData.investment_horizon === 'medium' ? 7 : 15,
      })
      onClose()
    } catch (error) {
      console.error('Error creating portfolio:', error)
      alert('Failed to create portfolio. Please try again.')
    }
  }

  const handleSubmitAllocate = async (e) => {
    e.preventDefault()
    try {
      await allocateFunds({
        ...allocationData,
        total_amount: parseFloat(allocationData.total_amount),
      })
      onClose()
    } catch (error) {
      console.error('Error allocating funds:', error)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        data-portfolio-modal
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold gradient-text">Portfolio Manager</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
          >
            <X />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            Create Portfolio
          </button>
          <button
            onClick={() => setActiveTab('allocate')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'allocate'
                ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            Allocate Funds
          </button>
        </div>

        {/* Create Portfolio Form */}
        {activeTab === 'create' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitCreate}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Portfolio Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder-gray-500"
                placeholder="My Investment Portfolio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Amount (₹)
              </label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={formData.initial_amount}
                onChange={(e) => setFormData({ ...formData, initial_amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder-gray-500"
                placeholder="100000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Risk Tolerance
              </label>
              <select
                value={formData.risk_tolerance}
                onChange={(e) => setFormData({ ...formData, risk_tolerance: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-cyan-400 focus:outline-none text-white"
              >
                <option value="low">Conservative</option>
                <option value="medium">Moderate</option>
                <option value="high">Aggressive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Financial Goal
              </label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-cyan-400 focus:outline-none text-white"
              >
                <option value="wealth">Wealth Creation</option>
                <option value="tax">Tax Saving</option>
                <option value="passive">Passive Income</option>
                <option value="capital">Capital Preservation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Investment Horizon
              </label>
              <select
                value={formData.investment_horizon}
                onChange={(e) => setFormData({ ...formData, investment_horizon: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-cyan-400 focus:outline-none text-white"
              >
                <option value="short">Short Term (1-3 years)</option>
                <option value="medium">Medium Term (3-7 years)</option>
                <option value="long">Long Term (7+ years)</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Portfolio'}
            </motion.button>
          </motion.form>
        )}

        {/* Allocate Funds Form */}
        {activeTab === 'allocate' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmitAllocate}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Amount to Allocate (₹)
              </label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={allocationData.total_amount}
                onChange={(e) => setAllocationData({ ...allocationData, total_amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder-gray-500"
                placeholder="50000"
              />
            </div>

            {/* Allocation Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Stocks</label>
                  <span className="text-cyan-400 font-medium">{allocationData.stocks}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocationData.stocks}
                  onChange={(e) => setAllocationData({ ...allocationData, stocks: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Bonds</label>
                  <span className="text-purple-400 font-medium">{allocationData.bonds}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocationData.bonds}
                  onChange={(e) => setAllocationData({ ...allocationData, bonds: parseInt(e.target.value) })}
                  className="w-full accent-purple-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Cryptocurrency</label>
                  <span className="text-orange-400 font-medium">{allocationData.crypto}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocationData.crypto}
                  onChange={(e) => setAllocationData({ ...allocationData, crypto: parseInt(e.target.value) })}
                  className="w-full accent-orange-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Commodities</label>
                  <span className="text-green-400 font-medium">{allocationData.commodities}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocationData.commodities}
                  onChange={(e) => setAllocationData({ ...allocationData, commodities: parseInt(e.target.value) })}
                  className="w-full accent-green-400"
                />
              </div>
            </div>

            {/* Total Percentage */}
            <div className="glass p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Allocation</span>
                <span className={`font-bold ${
                  allocationData.stocks + allocationData.bonds + allocationData.crypto + allocationData.commodities === 100
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {allocationData.stocks + allocationData.bonds + allocationData.crypto + allocationData.commodities}%
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || allocationData.stocks + allocationData.bonds + allocationData.crypto + allocationData.commodities !== 100}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Allocating...' : 'Allocate Funds'}
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </motion.div>
  )
}
