import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generatePortfolio = async (data) => {
  try {
    const response = await api.post('/portfolio/generate-portfolio', data);
    return response.data;
  } catch (error) {
    console.error('Error generating portfolio:', error);
    throw error;
  }
};

export const getAnalysis = async (portfolioId) => {
  try {
    const response = await api.get(`/analysis/get-analysis/${portfolioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }
};

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
