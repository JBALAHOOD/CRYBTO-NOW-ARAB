// CoinGecko API utilities
const BASE_URL = 'https://api.coingecko.com/api/v3';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

// Create fetch with timeout
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Retry mechanism
const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
  try {
    return await fetchWithTimeout(url, options);
  } catch (error) {
    if (retries > 0 && (error.name === 'AbortError' || error.name === 'TypeError')) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

// Fetch cryptocurrency market data
export const fetchCryptoMarketData = async (page = 1, perPage = 249) => {
  try {
    const response = await fetchWithRetry(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h,7d`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      image: crypto.image,
      current_price: crypto.current_price,
      market_cap: crypto.market_cap,
      total_volume: crypto.total_volume,
      price_change_percentage_24h: crypto.price_change_percentage_24h,
      price_change_percentage_7d: crypto.price_change_percentage_7d_in_currency || 0,
      market_cap_rank: crypto.market_cap_rank,
      circulating_supply: crypto.circulating_supply,
      total_supply: crypto.total_supply,
      max_supply: crypto.max_supply,
      ath: crypto.ath,
      atl: crypto.atl,
      last_updated: crypto.last_updated
    }));
  } catch (error) {
    console.error('Error fetching crypto market data:', error);
    throw error;
  }
};

// Search cryptocurrencies
export const searchCryptocurrencies = async (query) => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins.slice(0, 10); // Limit to 10 results
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    throw error;
  }
};

// Fetch detailed cryptocurrency data
export const fetchCryptoDetails = async (coinId) => {
  try {
    const response = await fetchWithRetry(
      `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw error;
  }
};

// Fetch global market data
export const fetchGlobalMarketData = async () => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/global`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
};

// Fetch trending cryptocurrencies
export const fetchTrendingCryptos = async () => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/search/trending`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.coins;
  } catch (error) {
    console.error('Error fetching trending cryptos:', error);
    throw error;
  }
};