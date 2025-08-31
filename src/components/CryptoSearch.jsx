import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

const popularCoins = [
  { symbol: 'BTC', name: 'بيتكوين', id: 'bitcoin' },
  { symbol: 'ETH', name: 'إيثريوم', id: 'ethereum' },
  { symbol: 'XRP', name: 'ريبل', id: 'ripple' },
  { symbol: 'SOL', name: 'سولانا', id: 'solana' },
  { symbol: 'DOGE', name: 'دوجكوين', id: 'dogecoin' },
  { symbol: 'ADA', name: 'كاردانو', id: 'cardano' },
  { symbol: 'BNB', name: 'بينانس كوين', id: 'binancecoin' },
  { symbol: 'AVAX', name: 'أفالانش', id: 'avalanche-2' }
];

const CryptoSearch = ({ onSearch, searchResults = [], onSelectCrypto, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showPopular, setShowPopular] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const lastSearchTimeRef = useRef(0);
  const RATE_LIMIT_DELAY = 500; // 500ms delay between searches

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowPopular(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSearch = useCallback((value) => {
    const now = Date.now();
    const timeSinceLastSearch = now - lastSearchTimeRef.current;
    
    if (timeSinceLastSearch < RATE_LIMIT_DELAY) {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Set new timeout
      searchTimeoutRef.current = setTimeout(() => {
        lastSearchTimeRef.current = Date.now();
        onSearch(value);
      }, RATE_LIMIT_DELAY - timeSinceLastSearch);
    } else {
      lastSearchTimeRef.current = now;
      onSearch(value);
    }
  }, [onSearch]);

  const handleSearch = (value) => {
    // Input validation and sanitization
    const sanitizedValue = value.replace(/[<>"'&]/g, '').trim();
    const maxLength = 50;
    const finalValue = sanitizedValue.length > maxLength ? sanitizedValue.substring(0, maxLength) : sanitizedValue;
    
    setSearchTerm(finalValue);
    if (finalValue.length > 0 && finalValue.length >= 2) {
      setIsOpen(true);
      setShowPopular(false);
      debouncedSearch(finalValue);
    } else {
      setIsOpen(false);
      setShowPopular(false);
      // Clear timeout if search term is too short
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  };

  const handleFocus = () => {
    if (searchTerm.trim().length === 0) {
      setShowPopular(true);
      setIsOpen(true);
    }
  };

  const handleSelect = (crypto) => {
    setSearchTerm('');
    setIsOpen(false);
    setShowPopular(false);
    if (onSelectCrypto) {
      onSelectCrypto(crypto);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
    setShowPopular(false);
  };

  const SearchResultItem = ({ item, isPopular = false }) => (
    <div
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
      onClick={() => handleSelect(isPopular ? item : {
        id: item.id,
        name: item.name,
        symbol: item.symbol?.toUpperCase(),
        image: item.large || item.thumb
      })}
    >
      {!isPopular && item.thumb && (
        <img 
          src={item.thumb} 
          alt={item.name}
          className="w-6 h-6 rounded-full"
        />
      )}
      {isPopular && (
        <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
          {item.symbol.charAt(0)}
        </div>
      )}
      <div className="flex-1">
        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {isPopular ? item.name : item.name}
        </div>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {isPopular ? item.symbol : item.symbol?.toUpperCase()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative max-w-md mx-auto" ref={searchRef}>
      <div className="relative">
        <Search 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
          style={{ color: 'var(--text-secondary)' }} 
        />
        <input
          type="text"
          placeholder="ابحث عن عملة رقمية..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleFocus}
          className="w-full pr-10 pl-10 h-12 text-lg rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            '--tw-ring-color': 'var(--primary)'
          }}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-50 max-h-80 overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border)'
          }}
        >
          {showPopular && (
            <div className="p-3">
              <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                العملات الشائعة
              </div>
              <div className="space-y-1">
                {popularCoins.map((coin) => (
                  <SearchResultItem key={coin.id} item={coin} isPopular={true} />
                ))}
              </div>
            </div>
          )}

          {!showPopular && (
            <div>
              {loading && (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--primary)' }} />
                  <span className="mr-2" style={{ color: 'var(--text-secondary)' }}>جاري البحث...</span>
                </div>
              )}

              {!loading && searchResults.length > 0 && (
                <div className="p-3">
                  <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                    نتائج البحث
                  </div>
                  <div className="space-y-1">
                    {searchResults.map((result) => (
                      <SearchResultItem key={result.id} item={result} />
                    ))}
                  </div>
                </div>
              )}

              {!loading && searchTerm.trim().length > 0 && searchResults.length === 0 && (
                <div className="p-6 text-center">
                  <p style={{ color: 'var(--text-secondary)' }}>
                    لم يتم العثور على نتائج لـ "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoSearch;