import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

const Dashboard = ({ portfolio, onAnalyze }) => {
  const [animatedAmounts, setAnimatedAmounts] = useState({});

  useEffect(() => {
    if (portfolio?.assets) {
      const initialAmounts = {};
      portfolio.assets.forEach((asset, index) => {
        initialAmounts[index] = 0;
      });
      setAnimatedAmounts(initialAmounts);

      portfolio.assets.forEach((asset, index) => {
        const duration = 1000;
        const steps = 30;
        const increment = asset.invested_amount / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= asset.invested_amount) {
            current = asset.invested_amount;
            clearInterval(timer);
          }
          setAnimatedAmounts(prev => ({
            ...prev,
            [index]: Math.round(current)
          }));
        }, duration / steps);
      });
    }
  }, [portfolio]);

  if (!portfolio) return null;

  const { allocation, assets, ai_explanation, portfolio_id } = portfolio;

  return (
    <section className="dashboard-section">
      <div className="container">
        <h2 className="section-title animate-fade-in">Your Portfolio</h2>

        <div className="dashboard-grid">
          {}
          <div className="card allocation-card animate-fade-in delay-100">
            <h3 className="card-title">Allocation</h3>
            <div className="allocation-bars">
              <div className="allocation-item">
                <div className="allocation-header">
                  <span>Equity</span>
                  <span className="allocation-value">{(allocation.equity * 100).toFixed(0)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill equity"
                    style={{ width: `${allocation.equity * 100}%` }}
                  />
                </div>
              </div>
              <div className="allocation-item">
                <div className="allocation-header">
                  <span>Debt</span>
                  <span className="allocation-value">{(allocation.debt * 100).toFixed(0)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill debt"
                    style={{ width: `${allocation.debt * 100}%` }}
                  />
                </div>
              </div>
              <div className="allocation-item">
                <div className="allocation-header">
                  <span>Funds</span>
                  <span className="allocation-value">{(allocation.funds * 100).toFixed(0)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill funds"
                    style={{ width: `${allocation.funds * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="card assets-card animate-fade-in delay-200">
            <h3 className="card-title">Selected Assets</h3>
            <div className="assets-list">
              {assets.map((asset, index) => (
                <div key={index} className="asset-item">
                  <div className="asset-info">
                    <span className="asset-name">{asset.name}</span>
                    <span className="asset-category">{asset.category}</span>
                  </div>
                  <div className="asset-values">
                    <span className="asset-amount">
                      ₹{formatCurrency(animatedAmounts[index] || 0)}
                  </span>
                    <span className="asset-percentage">{asset.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="card ai-card animate-fade-in delay-300">
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              AI Insights
            </h3>
            <div className="ai-content">
              {ai_explanation ? (
                <div className="ai-text" dangerouslySetInnerHTML={{
                  __html: ai_explanation.replace(/\n/g, '<br/>')
                }} />
              ) : (
                <p className="ai-placeholder">AI analysis loading...</p>
              )}
            </div>
          </div>
        </div>

        <button className="btn btn-primary analyze-btn" onClick={() => onAnalyze(portfolio_id)}>
          View Analytics
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>

      <style>{`
        .dashboard-section {
          padding: 4rem 2rem;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .allocation-card {
          grid-row: span 1;
        }

        .assets-card {
          grid-row: span 1;
          max-height: 500px;
          overflow-y: auto;
        }

        .ai-card {
          grid-row: span 1;
        }

        .card-title {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .allocation-bars {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .allocation-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .allocation-value {
          color: var(--accent-blue);
          font-weight: 600;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease-out;
        }

        .progress-fill.equity {
          background: linear-gradient(90deg, #4f8ef7, #6b8cff);
        }

        .progress-fill.debt {
          background: linear-gradient(90deg, #22c55e, #4ade80);
        }

        .progress-fill.funds {
          background: linear-gradient(90deg, #9b59f5, #b47cff);
        }

        .assets-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .asset-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid var(--border-glass);
        }

        .asset-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .asset-name {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .asset-category {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .asset-values {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .asset-amount {
          font-weight: 600;
          color: var(--accent-blue);
        }

        .asset-percentage {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .ai-content {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-muted);
        }

        .ai-content h2, .ai-content h3 {
          color: var(--text-primary);
          margin: 1rem 0 0.5rem 0;
          font-size: 1.1rem;
        }

        .ai-content ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .ai-content li {
          margin: 0.5rem 0;
        }

        .ai-placeholder {
          font-style: italic;
          opacity: 0.6;
        }

        .analyze-btn {
          display: flex;
          margin: 0 auto;
          padding: 1rem 2rem;
        }
      `}</style>
    </section>
  );
};

export default Dashboard;
