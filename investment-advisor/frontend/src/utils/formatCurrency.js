/**
 * Format a number as Indian currency (₹)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  
  // Convert to number if string
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format with Indian number system (lakhs, crores)
  if (num >= 10000000) {
    // Crores
    return (num / 10000000).toFixed(2) + ' Cr';
  } else if (num >= 100000) {
    // Lakhs
    return (num / 100000).toFixed(2) + ' L';
  } else if (num >= 1000) {
    // Thousands with comma
    return num.toLocaleString('en-IN');
  }
  
  return num.toLocaleString('en-IN');
};

/**
 * Format a number with commas (Indian format)
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString('en-IN');
};

/**
 * Calculate percentage change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};
