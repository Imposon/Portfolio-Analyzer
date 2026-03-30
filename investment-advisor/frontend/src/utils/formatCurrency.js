
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (num >= 10000000) {

    return (num / 10000000).toFixed(2) + ' Cr';
  } else if (num >= 100000) {

    return (num / 100000).toFixed(2) + ' L';
  } else if (num >= 1000) {

    return num.toLocaleString('en-IN');
  }

  return num.toLocaleString('en-IN');
};

export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString('en-IN');
};

export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};
