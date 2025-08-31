import React, { useState } from 'react';
import { useCrypto, useSearch } from '../hooks/useCrypto';
import CryptoSearch from '../components/CryptoSearch';
import CryptoTable from '../components/CryptoTable';
import MarketWidgets from '../components/MarketWidgets';
import CryptoModal from '../components/CryptoModal';
import SEO from '../components/SEO';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const Home = () => {
  const {
    cryptos,
    loading,
    error,
    lastUpdate,
    sortBy,
    sortCryptos,
    getTopGainers,
    getTopLosers,
    refreshData
  } = useCrypto();

  const {
    searchResults,
    searchLoading,
    search,
    clearSearch
  } = useSearch();

  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
    clearSearch();
  };

  if (loading && cryptos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            جاري تحميل بيانات العملات الرقمية...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--danger)' }} />
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            حدث خطأ في تحميل البيانات
          </p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <SEO 
        title="كريبتو الآن - تتبع أسعار العملات المشفرة مباشرة | Crypto Now"
        description="تتبع أسعار العملات المشفرة مباشرة مع كريبتو الآن. احصل على بيانات حية لأسعار البيتكوين والإيثريوم وجميع العملات الرقمية مع الرسوم البيانية والتحليلات."
        keywords="عملات مشفرة, بيتكوين, إيثريوم, أسعار العملات الرقمية, تداول, كريبتو, blockchain, cryptocurrency, bitcoin, ethereum"
        url="/"
      />
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          سوق العملات الرقمية
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          تتبع أسعار العملات الرقمية في الوقت الفعلي
        </p>
        <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          يعرض التطبيق {cryptos.length > 0 ? cryptos.length : '249'} عملة مشفرة مرتبة حسب القيمة السوقية
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <CryptoSearch
          onSearch={search}
          searchResults={searchResults}
          onSelectCrypto={handleCryptoSelect}
          loading={searchLoading}
        />
        
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              آخر تحديث: {lastUpdate.toLocaleTimeString('en-US')}
            </div>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:bg-opacity-10 hover:bg-gray-500"
            style={{ 
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* Market Widgets */}
      {cryptos.length > 0 && (
        <MarketWidgets
          topGainers={getTopGainers()}
          topLosers={getTopLosers()}
        />
      )}

      {/* Crypto Table */}
      <div className="crypto-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            العملات الرقمية
          </h2>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {cryptos.length} عملة
          </div>
        </div>
        
        <CryptoTable
          cryptos={cryptos}
          onCryptoClick={setSelectedCrypto}
          sortBy={sortBy}
          onSort={sortCryptos}
          loading={loading}
        />
      </div>

      {/* Crypto Modal */}
      {selectedCrypto && (
        <CryptoModal
          crypto={selectedCrypto}
          isOpen={!!selectedCrypto}
          onClose={() => setSelectedCrypto(null)}
        />
      )}
    </div>
  );
};

export default Home;