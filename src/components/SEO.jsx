import React from 'react';
import { Helmet } from 'react-helmet-async';
import { formatPrice } from '../utils/formatters';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  crypto = null,
  type = 'website' 
}) => {
  const defaultTitle = 'كريبتو الآن - تتبع أسعار العملات المشفرة مباشرة | Crypto Now';
  const defaultDescription = 'تتبع أسعار العملات المشفرة مباشرة مع كريبتو الآن. احصل على بيانات حية لأسعار البيتكوين والإيثريوم وجميع العملات الرقمية مع الرسوم البيانية والتحليلات.';
  const defaultKeywords = 'عملات مشفرة, بيتكوين, إيثريوم, أسعار العملات الرقمية, تداول, كريبتو, blockchain, cryptocurrency, bitcoin, ethereum';
  const defaultImage = 'https://cryptonow.app/og-image.jpg';
  const baseUrl = 'https://cryptonow.app';

  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${baseUrl}${url}` : baseUrl;

  // Generate structured data for cryptocurrency
  const generateCryptoStructuredData = () => {
    if (!crypto) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: crypto.name,
      alternateName: crypto.symbol?.toUpperCase(),
      description: `معلومات مفصلة عن عملة ${crypto.name} (${crypto.symbol?.toUpperCase()}) - السعر الحالي، التغيير اليومي، والإحصائيات`,
      category: 'Cryptocurrency',
      url: seoUrl,
      image: crypto.image,
      offers: {
        '@type': 'Offer',
        price: crypto.current_price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Market Cap Rank',
          value: crypto.market_cap_rank
        },
        {
          '@type': 'PropertyValue',
          name: 'Market Cap',
          value: crypto.market_cap
        },
        {
          '@type': 'PropertyValue',
          name: '24h Volume',
          value: crypto.total_volume
        },
        {
          '@type': 'PropertyValue',
          name: '24h Price Change',
          value: `${crypto.price_change_percentage_24h}%`
        }
      ]
    };
  };

  const structuredData = crypto ? generateCryptoStructuredData() : {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'كريبتو الآن',
    alternateName: 'Crypto Now',
    url: baseUrl,
    description: defaultDescription,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Organization',
      name: 'Crypto Now'
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:site_name" content="Crypto Now" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>

      {/* Additional crypto-specific meta tags */}
      {crypto && (
        <>
          <meta name="crypto:name" content={crypto.name} />
          <meta name="crypto:symbol" content={crypto.symbol?.toUpperCase()} />
          <meta name="crypto:price" content={formatPrice(crypto.current_price)} />
          <meta name="crypto:change_24h" content={`${crypto.price_change_percentage_24h?.toFixed(2)}%`} />
          <meta name="crypto:market_cap_rank" content={crypto.market_cap_rank} />
        </>
      )}
    </Helmet>
  );
};

export default SEO;