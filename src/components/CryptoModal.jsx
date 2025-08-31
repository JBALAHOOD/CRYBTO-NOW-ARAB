import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Globe, ExternalLink, Loader2 } from 'lucide-react';
import { formatPrice, formatPercentage, formatMarketCap, formatVolume, getPriceChangeColor } from '../utils/formatters';
import { fetchCryptoDetails } from '../utils/api';
import SEO from './SEO';

const CryptoModal = ({ crypto, isOpen, onClose }) => {
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && crypto) {
      fetchDetails();
    }
  }, [isOpen, crypto]);

  const fetchDetails = async () => {
    if (!crypto?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const details = await fetchCryptoDetails(crypto.id);
      setCryptoDetails(details);
    } catch (err) {
      setError('فشل في تحميل تفاصيل العملة');
      console.error('Error fetching crypto details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !crypto) return null;

  const priceChangeColor = getPriceChangeColor(crypto.price_change_percentage_24h);
  const details = cryptoDetails || crypto;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <SEO 
        title={`${crypto.name} (${crypto.symbol?.toUpperCase()}) - السعر والإحصائيات | كريبتو الآن`}
        description={`تتبع سعر ${crypto.name} (${crypto.symbol?.toUpperCase()}) مباشرة. السعر الحالي: ${formatPrice(crypto.current_price)}، التغيير اليومي: ${formatPercentage(crypto.price_change_percentage_24h)}.`}
        keywords={`${crypto.name}, ${crypto.symbol}, سعر ${crypto.name}, ${crypto.symbol} مباشر, عملة ${crypto.name}`}
        image={crypto.image}
        crypto={crypto}
        type="article"
      />
      <div 
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div className="sticky top-0 p-6 border-b" style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border)' 
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={crypto.image} 
                alt={crypto.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {crypto.name}
                </h2>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  {crypto.symbol?.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
            >
              <X className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
              <span className="mr-3" style={{ color: 'var(--text-secondary)' }}>جاري تحميل التفاصيل...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchDetails}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white'
                }}
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Price Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      السعر الحالي
                    </h3>
                    <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      ${formatPrice(crypto.current_price)}
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 ${priceChangeColor}`}>
                    {crypto.price_change_percentage_24h > 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : crypto.price_change_percentage_24h < 0 ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : null}
                    <span className="text-xl font-semibold">
                      {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                      {formatPercentage(crypto.price_change_percentage_24h)}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>(24 ساعة)</span>
                  </div>
                </div>

                {/* Market Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>الترتيب السوقي:</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      #{crypto.market_cap_rank || 'غير متاح'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>القيمة السوقية:</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formatMarketCap(crypto.market_cap)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>حجم التداول (24 ساعة):</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formatVolume(crypto.total_volume)}
                    </span>
                  </div>
                  
                  {details.circulating_supply && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>المعروض المتداول:</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {formatVolume(details.circulating_supply)} {crypto.symbol?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Changes */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  تغيرات الأسعار
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '1 ساعة', value: details.price_change_percentage_1h_in_currency },
                    { label: '24 ساعة', value: crypto.price_change_percentage_24h },
                    { label: '7 أيام', value: crypto.price_change_percentage_7d },
                    { label: '30 يوم', value: details.price_change_percentage_30d_in_currency }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
                      <div className={`font-semibold ${getPriceChangeColor(item.value)}`}>
                        {item.value ? (
                          <>
                            {item.value > 0 ? '+' : ''}
                            {formatPercentage(item.value)}
                          </>
                        ) : (
                          'غير متاح'
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {details.description?.ar || details.description?.en && (
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    نبذة عن العملة
                  </h3>
                  <div 
                    className="prose max-w-none" 
                    style={{ color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ 
                      __html: (details.description?.ar || details.description?.en || '').slice(0, 500) + '...' 
                    }}
                  />
                </div>
              )}

              {/* Links */}
              {details.links && (
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    روابط مفيدة
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {details.links.homepage?.[0] && (
                      <a
                        href={details.links.homepage[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-opacity-10 hover:bg-gray-500"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      >
                        <Globe className="w-4 h-4" />
                        الموقع الرسمي
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoModal;