import { createContext, useContext, useReducer, useEffect } from 'react'
import { investmentAPI } from '../services/api'

const initialState = {
  portfolio: null,
  assets: [],
  analysis: null,
  recommendations: [],
  loading: false,
  error: null,
  totalValue: 0,
  totalReturn: 0,
  riskScore: 'Medium',
}

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PORTFOLIO: 'SET_PORTFOLIO',
  SET_ASSETS: 'SET_ASSETS',
  SET_ANALYSIS: 'SET_ANALYSIS',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  UPDATE_PORTFOLIO: 'UPDATE_PORTFOLIO',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  CLEAR_PORTFOLIO: 'CLEAR_PORTFOLIO',
}

function investmentReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    case ACTIONS.SET_PORTFOLIO:
      return {
        ...state,
        portfolio: action.payload,
        loading: false,
        error: null
      }
    case ACTIONS.SET_ASSETS:
      return {
        ...state,
        assets: action.payload,
        loading: false,
        error: null
      }
    case ACTIONS.SET_ANALYSIS:
      return {
        ...state,
        analysis: action.payload,
        loading: false,
        error: null
      }
    case ACTIONS.SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: action.payload,
        loading: false,
        error: null
      }
    case ACTIONS.UPDATE_PORTFOLIO:
      return {
        ...state,
        portfolio: { ...state.portfolio, ...action.payload },
        loading: false,
        error: null
      }
    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          transactions: [action.payload, ...(state.portfolio?.transactions || [])]
        },
        loading: false,
        error: null
      }
    case ACTIONS.CLEAR_PORTFOLIO:
      return {
        ...state,
        portfolio: null,
        assets: [],
        analysis: null,
        recommendations: [],
        loading: false,
        error: null,
        totalValue: 0,
        totalReturn: 0,
        riskScore: 'Medium',
      }
    default:
      return state
  }
}

const InvestmentContext = createContext()

export function InvestmentProvider({ children }) {
  const [state, dispatch] = useReducer(investmentReducer, initialState)

  const createPortfolio = async (formData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })

      const response = await investmentAPI.generatePortfolio(formData)

      const transformedData = {
        total_value: response.assets?.reduce((sum, asset) => sum + asset.invested_amount, 0) || 0,
        total_return: response.expected_return || 15.5,
        portfolio_type: response.portfolio_type || 'balanced',
        ai_explanation: response.ai_explanation,
        allocation: response.allocation,
        expected_return: response.expected_return,
        portfolio_id: response.portfolio_id
      }

      dispatch({ type: ACTIONS.SET_PORTFOLIO, payload: transformedData })
      dispatch({ type: ACTIONS.SET_ASSETS, payload: response.assets || [] })

      return response
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
      throw error
    } finally {

      dispatch({ type: ACTIONS.SET_LOADING, payload: false })
    }
  }

  const getAIAnalysis = async (portfolioData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })

      const response = await investmentAPI.getAIAnalysis(portfolioData)
      dispatch({ type: ACTIONS.SET_ANALYSIS, payload: response.analysis })

      return response
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }

  const clearPortfolio = () => {
    dispatch({ type: ACTIONS.CLEAR_PORTFOLIO })
  }

  const updatePortfolio = (updates) => {
    dispatch({ type: ACTIONS.UPDATE_PORTFOLIO, payload: updates })
  }

  const addTransaction = (transaction) => {
    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transaction })
  }

  useEffect(() => {
    if (state.assets && state.assets.length > 0) {
      const total = state.assets.reduce((sum, asset) => sum + (asset.current_value || asset.value || 0), 0)
      const returns = state.portfolio?.total_return || 0

      dispatch({ type: ACTIONS.UPDATE_PORTFOLIO, payload: { total_value: total } })
    }
  }, [state.assets])

  const value = {
    ...state,
    createPortfolio,
    getAIAnalysis,
    clearPortfolio,
    updatePortfolio,
    addTransaction,
  }

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  )
}

export function useInvestment() {
  const context = useContext(InvestmentContext)
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider')
  }
  return context
}

export default InvestmentContext
