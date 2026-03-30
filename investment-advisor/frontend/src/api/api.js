import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Generate a portfolio recommendation
 * @param {Object} data - Portfolio request data
 * @param {number} data.amount - Investment amount
 * @param {string} data.risk - Risk level (low, medium, high)
 * @param {number} data.horizon - Time horizon in years
 * @param {string} data.goal - Financial goal (wealth, tax, passive, capital)
 * @returns {Promise<Object>} Portfolio response with allocation, assets, and AI explanation
 */
export const generatePortfolio = async (data) => {
  try {
    const response = await api.post('/portfolio/generate-portfolio', data);
    return response.data;
  } catch (error) {
    console.error('Error generating portfolio:', error);
    throw error;
  }
};

/**
 * Get analysis data for a portfolio
 * @param {number} portfolioId - Portfolio ID
 * @returns {Promise<Object>} Analysis data with growth, risk-return, and allocation
 */
export const getAnalysis = async (portfolioId) => {
  try {
    const response = await api.get(`/analysis/get-analysis/${portfolioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }
};

/**
 * Health check
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;
