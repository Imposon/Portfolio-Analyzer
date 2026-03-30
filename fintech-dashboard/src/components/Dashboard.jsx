import { motion } from 'framer-motion'
import { useState } from 'react'
import { useInvestment } from '../context/InvestmentContext'
import { useNavigate } from 'react-router-dom'

const ArrowRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m7 17 10-10m0 0v6m0-6h-6"/>
  </svg>
)

const Sparkles = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="m12 2-2 7-7 2 7 2-2 7 2-7 7-2z"/>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0-7.78z"/>
  </svg>
)

const DollarSign = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

const TrendingUp = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

export default function Dashboard() {
  const { createPortfolio, loading } = useInvestment()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    amount: '',
    risk: 'moderate',
    goal: 'wealth',
    duration: 5,
    durationType: 'years'
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleRiskChange = (value) => {
    setFormData(prev => ({
      ...prev,
      risk: value
    }))
  }

  const handleDurationChange = (e) => {
    setFormData(prev => ({
      ...prev,
      duration: parseInt(e.target.value)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount || parseFloat(formData.amount) < 1000) {
      newErrors.amount = 'Minimum investment amount is ₹1,000'
    }

    if (!formData.risk) {
      newErrors.risk = 'Please select a risk level'
    }

    if (!formData.goal) {
      newErrors.goal = 'Please select a financial goal'
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Please select a valid duration'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const timeoutId = setTimeout(() => {
      setErrors({ submit: 'Request timed out. Please refresh and try again.' })
    }, 20000)

    try {

      const horizon = formData.durationType === 'years'
        ? formData.duration
        : Math.round(formData.duration / 12)

      console.log('Submitting portfolio request:', {
        amount: parseFloat(formData.amount),
        risk: formData.risk,
        goal: formData.goal,
        horizon: horizon
      })

      await createPortfolio({
        amount: parseFloat(formData.amount),
        risk: formData.risk,
        goal: formData.goal,
        horizon: horizon
      })

      clearTimeout(timeoutId)

      navigate('/results')
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Portfolio generation error:', error)
      setErrors({ submit: error.message || 'Failed to generate portfolio. Please try again.' })
    }
  }

  const riskLevels = [
    { value: 'conservative', label: 'Conservative', description: 'Low risk, stable returns' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced risk and returns' },
    { value: 'aggressive', label: 'Aggressive', description: 'High risk, high returns' }
  ]

  const financialGoals = [
    { value: 'wealth', label: 'Wealth Creation', description: 'Grow your capital over time' },
    { value: 'savings', label: 'Savings', description: 'Build emergency funds' },
    { value: 'passive', label: 'Passive Income', description: 'Generate regular income' }
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-cyan-400 mb-6">
            <Sparkles />
            <span>Create Your Investment Profile</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Personalized Investment Plan
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tell us about your investment preferences and we'll create a customized portfolio
            tailored to your financial goals.
          </p>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {}
            <div>
              <label className="block text-white font-medium mb-3">
                <DollarSign className="inline w-4 h-4 mr-2" />
                Investment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="10,000"
                  className={`w-full pl-10 pr-4 py-4 rounded-xl bg-white/5 border ${
                    errors.amount ? 'border-red-500' : 'border-white/10'
                  } text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors`}
                />
              </div>
              {errors.amount && (
                <p className="text-red-400 text-sm mt-2">{errors.amount}</p>
              )}
            </div>

            {}
            <div>
              <label className="block text-white font-medium mb-3">
                <TrendingUp className="inline w-4 h-4 mr-2" />
                Risk Level
              </label>
              <div className="space-y-2">
                {riskLevels.map((level, index) => (
                  <div key={level.value} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                       onClick={() => handleRiskChange(level.value)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.risk === level.value
                          ? 'border-cyan-400 bg-cyan-400'
                          : 'border-gray-400'
                      }`}>
                        {formData.risk === level.value && (
                          <div className="w-2 h-2 rounded-full bg-white m-0.5" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{level.label}</div>
                        <div className="text-gray-400 text-sm">{level.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.risk && (
                <p className="text-red-400 text-sm mt-2">{errors.risk}</p>
              )}
            </div>

            {}
            <div>
              <label className="block text-white font-medium mb-3">Financial Goal</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 rounded-xl bg-white/5 border ${
                  errors.goal ? 'border-red-500' : 'border-white/10'
                } text-white focus:outline-none focus:border-cyan-400 transition-colors`}
              >
                <option value="">Select your goal</option>
                {financialGoals.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
              {errors.goal && (
                <p className="text-red-400 text-sm mt-2">{errors.goal}</p>
              )}
            </div>

            {}
            <div>
              <label className="block text-white font-medium mb-3">
                Investment Duration: {formData.duration} {formData.durationType}
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {formData.durationType === 'years' ? '1 year' : '6 months'}
                  </span>
                  <input
                    type="range"
                    name="duration"
                    min={formData.durationType === 'years' ? 1 : 6}
                    max={formData.durationType === 'years' ? 30 : 60}
                    value={formData.duration}
                    onChange={handleDurationChange}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-gray-400">
                    {formData.durationType === 'years' ? '30 years' : '60 months'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setFormData(prev => ({ ...prev, durationType: 'years', duration: 5 }))
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      formData.durationType === 'years'
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                        : 'border-white/10 text-gray-400 hover:border-white/20'
                    } transition-colors`}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setFormData(prev => ({ ...prev, durationType: 'months', duration: 12 }))
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      formData.durationType === 'months'
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                        : 'border-white/10 text-gray-400 hover:border-white/20'
                    } transition-colors`}
                  >
                    Months
                  </button>
                </div>
              </div>
              {errors.duration && (
                <p className="text-red-400 text-sm mt-2">{errors.duration}</p>
              )}
            </div>

            {}
            {errors.submit && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-400">{errors.submit}</p>
              </div>
            )}

            {}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Portfolio...</span>
                </>
              ) : (
                <>
                  <span>Generate Portfolio</span>
                  <ArrowRight />
                </>
              )}
            </motion.button>

            {}
            {loading && (
              <motion.button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Taking too long? Click to reset
              </motion.button>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
