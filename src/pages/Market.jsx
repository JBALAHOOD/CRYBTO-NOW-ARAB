import React, { useState, useEffect } from 'react';
import { useCrypto } from '../hooks/useCrypto';
import { fetchGlobalMarketData, fetchTrendingCryptos } from '../utils/api';
import { formatMarketCap, formatPercentage } from '../utils/formatters';
import { TrendingUp, TrendingDown, Globe, Activity, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

const Market = () => {
  const { cryptos, loading } = useCrypto();
  const [globalData, setGlobalData] = useState(null);
  const [trendingCryptos, setTrendingCryptos] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setMarketLoading(true);
        const [global, trending] = await Promise.all([
          fetchGlobalMarketData(),
          fetchTrendingCryptos()
        ]);
        setGlobalData(global);
        setTrendingCryptos(trending);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setMarketLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, isPositive }) => (
    <div className="crypto-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </h3>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'price-up' : 'price-down'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );

  const TrendingCard = ({ crypto, index }) => (
    <div className="crypto-card rounded-lg p-4 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
          {index + 1}
        </div>
        <img 
          src={crypto.item.large} 
          alt={crypto.item.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {crypto.item.name}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {crypto.item.symbol.toUpperCase()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            #{crypto.item.market_cap_rank}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading || marketLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            جاري تحميل بيانات السوق...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <SEO 
        title="السوق - نظرة شاملة على أسواق العملات المشفرة | كريبتو الآن"
        description="استكشف السوق العالمي للعملات المشفرة مع إحصائيات شاملة، أفضل الرابحين والخاسرين، وتحليلات السوق المفصلة."
        keywords="سوق العملات المشفرة, تحليل السوق, الرابحون والخاسرون, إحصائيات العملات الرقمية, تداول كريبتو"
        url="/market"
      />
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          نظرة عامة على السوق
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          إحصائيات شاملة عن سوق العملات الرقمية
        </p>
      </div>

      {/* Global Market Stats */}
      {globalData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="إجمالي القيمة السوقية"
            value={formatMarketCap(globalData.total_market_cap?.usd)}
            change={formatPercentage(globalData.market_cap_change_percentage_24h_usd)}
            icon={Globe}
            isPositive={globalData.market_cap_change_percentage_24h_usd > 0}
          />
          
          <StatCard
            title="حجم التداول 24 ساعة"
            value={formatMarketCap(globalData.total_volume?.usd)}
            icon={Activity}
          />
          
          <StatCard
            title="هيمنة البيتكوين"
            value={`${globalData.market_cap_percentage?.btc?.toFixed(1)}%`}
            icon={TrendingUp}
          />
          
          <StatCard
            title="عدد العملات النشطة"
            value={globalData.active_cryptocurrencies?.toLocaleString()}
            icon={Globe}
          />
        </div>
      )}

      {/* Trending Cryptocurrencies */}
      <div className="crypto-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6" style={{ color: 'var(--primary)' }} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            العملات الرائجة
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingCryptos.slice(0, 6).map((crypto, index) => (
            <TrendingCard key={crypto.item.id} crypto={crypto} index={index} />
          ))}
        </div>
      </div>

      {/* Market Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="crypto-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 price-up" />
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              أكبر المكاسب
            </h2>
          </div>
          
          <div className="space-y-3">
            {cryptos
              .filter(crypto => crypto.price_change_percentage_24h > 0)
              .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
              .slice(0, 5)
              .map((crypto) => (
                <div key={crypto.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <div className="flex items-center gap-3">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {crypto.name}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      ${crypto.current_price?.toFixed(2)}
                    </div>
                    <div className="text-sm price-up">
                      +{formatPercentage(crypto.price_change_percentage_24h)}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Top Losers */}
        <div className="crypto-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-6 h-6 price-down" />
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              أكبر الخسائر
            </h2>
          </div>
          
          <div className="space-y-3">
            {cryptos
              .filter(crypto => crypto.price_change_percentage_24h < 0)
              .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
              .slice(0, 5)
              .map((crypto) => (
                <div key={crypto.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <div className="flex items-center gap-3">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {crypto.name}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      ${crypto.current_price?.toFixed(2)}
                    </div>
                    <div className="text-sm price-down">
                      {formatPercentage(crypto.price_change_percentage_24h)}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;