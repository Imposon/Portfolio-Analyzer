import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';

const COLORS = ['#4f8ef7', '#9b59f5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = ({ analysisData, portfolio }) => {
  const [activeTab, setActiveTab] = useState('growth');

  if (!analysisData || !portfolio) return null;

  const { growth_data, risk_return_data, allocation_data } = analysisData;

  // Prepare allocation data for pie chart
  const allocationChartData = [
    { name: 'Equity', value: allocation_data.equity * 100 },
    { name: 'Debt', value: allocation_data.debt * 100 },
    { name: 'Funds', value: allocation_data.funds * 100 }
  ].filter(item => item.value > 0);

  // Custom tooltip for charts
  const GrowthTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'rgba(10, 10, 26, 0.95)', 
          padding: '12px', 
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ margin: 0, color: '#8888aa' }}>Year {label}</p>
          <p style={{ margin: 0, color: '#4f8ef7', fontWeight: 600 }}>
            ₹{formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const RiskTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ 
          background: 'rgba(10, 10, 26, 0.95)', 
          padding: '12px', 
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ margin: 0, color: '#f0f0ff', fontWeight: 600 }}>{data.name}</p>
          <p style={{ margin: 0, color: '#8888aa' }}>Risk: {data.risk_score === 1 ? 'Low' : data.risk_score === 2 ? 'Medium' : 'High'}</p>
          <p style={{ margin: 0, color: '#4f8ef7', fontWeight: 600 }}>{data.expected_return}% return</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'rgba(10, 10, 26, 0.95)', 
          padding: '12px', 
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ margin: 0, color: '#f0f0ff', fontWeight: 600 }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: '#4f8ef7', fontWeight: 600 }}>{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="analytics-section">
      <div className="container">
        <h2 className="section-title">Portfolio Analytics</h2>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'growth' ? 'active' : ''}`}
            onClick={() => setActiveTab('growth')}
          >
            Growth Projection
          </button>
          <button 
            className={`tab ${activeTab === 'risk' ? 'active' : ''}`}
            onClick={() => setActiveTab('risk')}
          >
            Risk vs Return
          </button>
          <button 
            className={`tab ${activeTab === 'allocation' ? 'active' : ''}`}
            onClick={() => setActiveTab('allocation')}
          >
            Allocation
          </button>
        </div>

        {/* Chart Container */}
        <div className="chart-card card">
          {activeTab === 'growth' && (
            <div className="chart-wrapper">
              <h3 className="chart-title">Projected Portfolio Growth</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={growth_data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#8888aa"
                    tick={{ fill: '#8888aa' }}
                    label={{ value: 'Years', position: 'bottom', fill: '#8888aa' }}
                  />
                  <YAxis 
                    stroke="#8888aa"
                    tick={{ fill: '#8888aa' }}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                    label={{ value: 'Value (₹)', angle: -90, position: 'insideLeft', fill: '#8888aa' }}
                  />
                  <Tooltip content={<GrowthTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f8ef7" 
                    strokeWidth={3}
                    dot={{ fill: '#4f8ef7', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#4f8ef7', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="chart-subtitle">
                Based on historical returns and compound growth calculations
              </p>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="chart-wrapper">
              <h3 className="chart-title">Risk vs Expected Return</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    type="number" 
                    dataKey="risk_score" 
                    name="Risk Level"
                    stroke="#8888aa"
                    tick={{ fill: '#8888aa' }}
                    tickFormatter={(value) => value === 1 ? 'Low' : value === 2 ? 'Medium' : 'High'}
                    domain={[0.5, 3.5]}
                    ticks={[1, 2, 3]}
                    label={{ value: 'Risk Level', position: 'bottom', fill: '#8888aa' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="expected_return" 
                    name="Expected Return %"
                    stroke="#8888aa"
                    tick={{ fill: '#8888aa' }}
                    tickFormatter={(value) => `${value}%`}
                    label={{ value: 'Expected Return (%)', angle: -90, position: 'insideLeft', fill: '#8888aa' }}
                  />
                  <ZAxis type="number" dataKey="expected_return" range={[100, 400]} />
                  <Tooltip content={<RiskTooltip />} />
                  <Scatter 
                    data={risk_return_data} 
                    fill="#4f8ef7"
                    stroke="#4f8ef7"
                    strokeWidth={2}
                  >
                    {risk_return_data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <p className="chart-subtitle">
                Each point represents an asset in your portfolio
              </p>
            </div>
          )}

          {activeTab === 'allocation' && (
            <div className="chart-wrapper">
              <h3 className="chart-title">Asset Class Allocation</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={allocationChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {allocationChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend">
                {allocationChartData.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <span 
                      className="legend-dot" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="legend-label">{entry.name}</span>
                    <span className="legend-value">{entry.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .analytics-section {
          padding: 4rem 2rem;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .section-title {
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.5rem;
          border-radius: 12px;
          border: 1px solid var(--border-glass);
        }
        
        .tab {
          flex: 1;
          padding: 0.875rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        
        .tab:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        
        .tab.active {
          background: var(--accent-gradient);
          color: white;
        }
        
        .chart-card {
          padding: 2rem;
        }
        
        .chart-wrapper {
          width: 100%;
        }
        
        .chart-title {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          text-align: center;
          color: var(--text-primary);
        }
        
        .chart-subtitle {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 1rem;
        }
        
        .legend {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .legend-label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .legend-value {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .tabs {
            flex-direction: column;
          }
          
          .legend {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Analytics;
