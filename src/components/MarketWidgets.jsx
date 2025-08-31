import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatPercentage, getPriceChangeColor } from '../utils/formatters';

const MarketWidgets = ({ cryptos = [], onCryptoClick }) => {
  const getTopGainers = () => {
    if (!Array.isArray(cryptos) || cryptos.length === 0) return [];
    return [...cryptos]
      .filter(crypto => crypto.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);
  };

  const getTopLosers = () => {
    if (!Array.isArray(cryptos) || cryptos.length === 0) return [];
    return [...cryptos]
      .filter(crypto => crypto.price_change_percentage_24h < 0)
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5);
  };

  const CryptoCard = ({ crypto, type }) => {
    const isGainer = type === 'gainer';
    const priceChangeColor = getPriceChangeColor(crypto.price_change_percentage_24h);
    
    return (
      <div 
        className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all duration-300 crypto-card"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border)'
        }}
        onClick={() => onCryptoClick && onCryptoClick(crypto)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img 
              src={crypto.image} 
              alt={crypto.name}
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
              <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {crypto.symbol.toUpperCase()}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {crypto.name}
              </div>
            </div>
          </div>
          <div className={`p-2 rounded-full ${isGainer ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            {isGainer ? (
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>السعر:</span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              ${formatPrice(crypto.current_price)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>24 ساعة:</span>
            <div className={`flex items-center gap-1 ${priceChangeColor}`}>
              <span className="font-medium text-sm">
                {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                {formatPercentage(crypto.price_change_percentage_24h)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WidgetSection = ({ title, cryptos, type, icon }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg ${type === 'gainer' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
      </div>
      
      {cryptos.length > 0 ? (
        <div className="grid gap-3">
          {cryptos.map((crypto) => (
            <CryptoCard 
              key={crypto.id} 
              crypto={crypto} 
              type={type}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p style={{ color: 'var(--text-secondary)' }}>
            لا توجد بيانات متاحة
          </p>
        </div>
      )}
    </div>
  );

  const topGainers = getTopGainers();
  const topLosers = getTopLosers();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <WidgetSection 
        title="أكبر المكاسب"
        cryptos={topGainers}
        type="gainer"
        icon={<TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />}
      />
      
      <WidgetSection 
        title="أكبر الخسائر"
        cryptos={topLosers}
        type="loser"
        icon={<TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />}
      />
    </div>
  );
};

export default MarketWidgets;