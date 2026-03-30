import React from 'react';
import '../styles/base.css';

const Hero = ({ onGetStarted }) => {
  return (
    <section className="hero">
      {}
      <div className="floating-card" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Portfolio Value</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>₹12.5L</div>
      </div>
      <div className="floating-card" style={{ top: '20%', right: '15%', animationDelay: '2s' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Returns</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>+14.2%</div>
      </div>
      <div className="floating-card" style={{ bottom: '30%', left: '15%', animationDelay: '4s' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Risk Score</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>Medium</div>
      </div>

      <div className="hero-content">
        <h1 className="hero-title animate-fade-in">
          AI-Powered<br />
          <span className="gradient-text">Investment Advisor</span>
        </h1>
        <p className="hero-subtitle animate-fade-in delay-100">
          Get personalized portfolio recommendations powered by advanced AI.
          Build wealth smarter with data-driven insights.
        </p>
        <button className="btn btn-primary animate-fade-in delay-200" onClick={onGetStarted}>
          Get Started
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 50% 50%, rgba(79, 142, 247, 0.08) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite;
        }

        .hero-content {
          text-align: center;
          max-width: 700px;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .floating-card {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
