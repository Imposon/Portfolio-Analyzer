import React, { useState, useRef } from 'react';
import Hero from './components/Hero';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import { generatePortfolio, getAnalysis } from './api/api';
import './styles/base.css';

const App = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const inputRef = useRef(null);
  const dashboardRef = useRef(null);
  const analyticsRef = useRef(null);

  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGeneratePortfolio = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await generatePortfolio(formData);
      setPortfolio(data);
      setAnalysisData(null);
      
      // Scroll to dashboard after a short delay
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (portfolioId) => {
    try {
      const data = await getAnalysis(portfolioId);
      setAnalysisData(data);
      
      // Scroll to analytics
      setTimeout(() => {
        analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load analytics. Please try again.');
    }
  };

  return (
    <div className="app">
      <Hero onGetStarted={scrollToInput} />
      
      <div ref={inputRef}>
        <InputForm onSubmit={handleGeneratePortfolio} loading={loading} />
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {portfolio && (
        <div ref={dashboardRef}>
          <Dashboard portfolio={portfolio} onAnalyze={handleAnalyze} />
        </div>
      )}

      {analysisData && portfolio && (
        <div ref={analyticsRef}>
          <Analytics analysisData={analysisData} portfolio={portfolio} />
        </div>
      )}

      <style>{`
        .error-banner {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(239, 68, 68, 0.9);
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }
        
        .error-banner button {
          background: white;
          color: #ef4444;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default App;
