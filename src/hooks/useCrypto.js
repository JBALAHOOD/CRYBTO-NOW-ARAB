import { useState, useEffect, useCallback } from 'react';
import { fetchCryptoMarketData, searchCryptocurrencies } from '../utils/api';

export const useCrypto = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [sortBy, setSortBy] = useState({ field: 'market_cap_rank', direction: 'asc' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCryptoMarketData();
      setCryptos(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  const sortCryptos = useCallback((field) => {
    const direction = sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc';
    setSortBy({ field, direction });
    
    const sorted = [...cryptos].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // Handle null/undefined values
      if (aValue == null) aValue = direction === 'asc' ? Infinity : -Infinity;
      if (bValue == null) bValue = direction === 'asc' ? Infinity : -Infinity;
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setCryptos(sorted);
  }, [cryptos, sortBy]);

  const getTopGainers = useCallback(() => {
    return [...cryptos]
      .filter(crypto => crypto.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);
  }, [cryptos]);

  const getTopLosers = useCallback(() => {
    return [...cryptos]
      .filter(crypto => crypto.price_change_percentage_24h < 0)
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5);
  }, [cryptos]);

  const refreshData = () => {
    fetchData();
  };

  return {
    cryptos,
    loading,
    error,
    lastUpdate,
    sortBy,
    sortCryptos,
    getTopGainers,
    getTopLosers,
    refreshData
  };
};

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError(null);
      const results = await searchCryptocurrencies(query);
      setSearchResults(results);
    } catch (err) {
      setSearchError(err.message);
      console.error('Error searching cryptocurrencies:', err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const clearSearch = () => {
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchResults,
    searchLoading,
    searchError,
    search,
    clearSearch
  };
};