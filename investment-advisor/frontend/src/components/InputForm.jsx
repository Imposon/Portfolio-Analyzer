import React, { useState } from 'react';

const InputForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    risk: 'medium',
    horizon: 5,
    goal: 'wealth'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (amount < 1000) {
      alert('Please enter an amount of at least ₹1,000');
      return;
    }
    onSubmit({
      amount,
      risk: formData.risk,
      horizon: parseInt(formData.horizon),
      goal: formData.goal
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="input-section" id="input-form">
      <div className="container">
        <div className="card form-card animate-fade-in">
          <h2 className="form-title">Create Your Portfolio</h2>
          <p className="form-subtitle">Tell us about your investment goals</p>

          <form onSubmit={handleSubmit}>
            {/* Investment Amount */}
            <div className="form-group">
              <label className="form-label">Investment Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount (min ₹1,000)"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                min="1000"
                required
              />
            </div>

            {/* Risk Level */}
            <div className="form-group">
              <label className="form-label">Risk Level</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="risk"
                    value="low"
                    checked={formData.risk === 'low'}
                    onChange={(e) => handleChange('risk', e.target.value)}
                  />
                  <span className="radio-label">Conservative</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="risk"
                    value="medium"
                    checked={formData.risk === 'medium'}
                    onChange={(e) => handleChange('risk', e.target.value)}
                  />
                  <span className="radio-label">Balanced</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="risk"
                    value="high"
                    checked={formData.risk === 'high'}
                    onChange={(e) => handleChange('risk', e.target.value)}
                  />
                  <span className="radio-label">Aggressive</span>
                </label>
              </div>
            </div>

            {/* Time Horizon */}
            <div className="form-group">
              <label className="form-label">Time Horizon: {formData.horizon} years</label>
              <div className="range-container">
                <input
                  type="range"
                  className="range-input"
                  min="1"
                  max="30"
                  value={formData.horizon}
                  onChange={(e) => handleChange('horizon', e.target.value)}
                />
                <span className="range-value">{formData.horizon}y</span>
              </div>
            </div>

            {/* Financial Goal */}
            <div className="form-group">
              <label className="form-label">Financial Goal</label>
              <select
                className="form-select"
                value={formData.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
              >
                <option value="wealth">Wealth Growth</option>
                <option value="tax">Tax Saving (80C)</option>
                <option value="passive">Passive Income</option>
                <option value="capital">Capital Preservation</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating Portfolio...
                </>
              ) : (
                <>
                  Generate Portfolio
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .input-section {
          padding: 4rem 2rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .container {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
        }
        
        .form-card {
          padding: 2.5rem;
        }
        
        .form-title {
          font-size: 1.875rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .form-subtitle {
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .submit-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 1.125rem;
          font-size: 1.1rem;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default InputForm;
