import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { formatPrice, formatPercentage, formatMarketCap, formatVolume, getPriceChangeColor } from '../utils/formatters';

const CryptoTable = ({ cryptos = [], onCryptoClick, sortBy, onSort, loading }) => {
  const handleSort = (field) => {
    onSort(field);
  };

  const SortableHeader = ({ field, children, className = "" }) => (
    <th className={`px-4 py-3 text-right cursor-pointer hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${className}`}>
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-2 w-full justify-end font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowUpDown className="w-4 h-4" />
        <span>{children}</span>
      </button>
    </th>
  );

  const CryptoRow = ({ crypto, index }) => {
    const priceChangeColor = getPriceChangeColor(crypto.price_change_percentage_24h);
    
    return (
      <tr 
        className="border-b hover:bg-opacity-5 hover:bg-gray-500 cursor-pointer transition-colors"
        style={{ borderColor: 'var(--border)' }}
        onClick={() => onCryptoClick(crypto)}
      >
        {/* Rank */}
        <td className="px-4 py-4 text-center">
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            {crypto.market_cap_rank || index + 1}
          </span>
        </td>

        {/* Name & Symbol */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={crypto.image} 
              alt={crypto.name}
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {crypto.name}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {crypto.symbol}
              </div>
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="px-4 py-4 text-right">
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
            ${formatPrice(crypto.current_price)}
          </div>
        </td>

        {/* 24h Change */}
        <td className="px-4 py-4 text-right">
          <div className={`flex items-center justify-end gap-1 ${priceChangeColor}`}>
            {crypto.price_change_percentage_24h > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : crypto.price_change_percentage_24h < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span className="font-medium">
              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
              {formatPercentage(crypto.price_change_percentage_24h)}
            </span>
          </div>
        </td>

        {/* 7d Change - Hidden on mobile */}
        <td className="px-4 py-4 text-right mobile-hidden">
          <div className={getPriceChangeColor(crypto.price_change_percentage_7d)}>
            <span className="font-medium">
              {crypto.price_change_percentage_7d > 0 ? '+' : ''}
              {formatPercentage(crypto.price_change_percentage_7d)}
            </span>
          </div>
        </td>

        {/* Market Cap - Hidden on mobile */}
        <td className="px-4 py-4 text-right mobile-hidden">
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {formatMarketCap(crypto.market_cap)}
          </span>
        </td>

        {/* Volume - Hidden on mobile */}
        <td className="px-4 py-4 text-right mobile-hidden">
          <span style={{ color: 'var(--text-secondary)' }}>
            {formatVolume(crypto.total_volume)}
          </span>
        </td>
      </tr>
    );
  };

  if (loading && cryptos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-4" 
             style={{ borderColor: 'var(--primary)' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          لا توجد عملات رقمية للعرض
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            <th className="px-4 py-3 text-center font-medium" style={{ color: 'var(--text-secondary)' }}>
              #
            </th>
            <SortableHeader field="name">
              العملة
            </SortableHeader>
            <SortableHeader field="current_price">
              السعر
            </SortableHeader>
            <SortableHeader field="price_change_percentage_24h">
              24 ساعة
            </SortableHeader>
            <SortableHeader field="price_change_percentage_7d" className="mobile-hidden">
              7 أيام
            </SortableHeader>
            <SortableHeader field="market_cap" className="mobile-hidden">
              القيمة السوقية
            </SortableHeader>
            <SortableHeader field="total_volume" className="mobile-hidden">
              الحجم
            </SortableHeader>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto, index) => (
            <CryptoRow 
              key={crypto.id} 
              crypto={crypto} 
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;