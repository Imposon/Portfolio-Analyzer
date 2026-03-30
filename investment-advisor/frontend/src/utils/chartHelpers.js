

export const processGrowthData = (growthData) => {
  if (!Array.isArray(growthData) || growthData.length === 0) {
    return [];
  }

  return growthData.map(point => ({
    year: point.year,
    value: Math.round(point.value),
    displayValue: formatChartValue(point.value)
  }));
};

const formatChartValue = (value) => {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(1) + 'Cr';
  } else if (value >= 100000) {
    return (value / 100000).toFixed(1) + 'L';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

export const processRiskReturnData = (assets) => {
  if (!Array.isArray(assets) || assets.length === 0) {
    return [];
  }

  const riskScores = { low: 1, medium: 2, high: 3 };

  return assets.map(asset => ({
    name: asset.name,
    risk: asset.risk,
    riskScore: riskScores[asset.risk] || 2,
    return: asset.expected_return,
    size: Math.max(50, asset.expected_return * 10)
  }));
};

export const generateAllocationData = (allocation) => {
  if (!allocation) return [];

  return [
    { name: 'Equity', value: Math.round(allocation.equity * 100), color: '#4f8ef7' },
    { name: 'Debt', value: Math.round(allocation.debt * 100), color: '#22c55e' },
    { name: 'Funds', value: Math.round(allocation.funds * 100), color: '#9b59f5' }
  ].filter(item => item.value > 0);
};

export const calculateCAGR = (startValue, endValue, years) => {
  if (!startValue || !endValue || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
};
