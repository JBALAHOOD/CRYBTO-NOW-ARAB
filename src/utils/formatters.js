// Price formatting utilities
export const formatPrice = (price) => {
  if (!price) return '0.00';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 8 : 2
  }).format(price);
};

// Percentage formatting
export const formatPercentage = (percentage) => {
  if (!percentage) return '0.00%';
  const formatted = Math.abs(percentage).toFixed(2);
  return new Intl.NumberFormat('en-US').format(formatted) + '%';
};

// Market cap formatting
export const formatMarketCap = (marketCap) => {
  if (!marketCap) return '0';
  
  if (marketCap >= 1e12) {
    return new Intl.NumberFormat('en-US').format((marketCap / 1e12).toFixed(2)) + ' ت$';
  } else if (marketCap >= 1e9) {
    return new Intl.NumberFormat('en-US').format((marketCap / 1e9).toFixed(2)) + ' م$';
  } else if (marketCap >= 1e6) {
    return new Intl.NumberFormat('en-US').format((marketCap / 1e6).toFixed(2)) + ' مليون$';
  }
  return new Intl.NumberFormat('en-US').format(marketCap);
};

// Volume formatting
export const formatVolume = (volume) => {
  if (!volume) return '0';
  
  if (volume >= 1e9) {
    return (volume / 1e9).toFixed(2) + 'B';
  } else if (volume >= 1e6) {
    return (volume / 1e6).toFixed(2) + 'M';
  } else if (volume >= 1e3) {
    return (volume / 1e3).toFixed(2) + 'K';
  }
  return volume.toFixed(2);
};

// Currency conversion (USD to SAR)
export const convertToSAR = (usdAmount, rate = 3.75) => {
  return usdAmount * rate;
};

// Format currency with SAR
export const formatSAR = (amount) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Get price change color class
export const getPriceChangeColor = (change) => {
  if (!change) return 'text-gray-500';
  return change > 0 ? 'price-up' : 'price-down';
};

// Get price change icon
export const getPriceChangeIcon = (change) => {
  if (!change) return null;
  return change > 0 ? '↗' : '↘';
};