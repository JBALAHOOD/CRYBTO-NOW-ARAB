import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { TrendingUp, Menu, X, Home, BarChart3 } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { 
      title: 'الرئيسية', 
      path: '/', 
      icon: Home,
      isActive: location.pathname === '/'
    },
    { 
      title: 'السوق', 
      path: '/market', 
      icon: BarChart3,
      isActive: location.pathname === '/market'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen transition-all duration-300" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 crypto-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span style={{ color: 'var(--text-primary)' }}>كريبتو الآن</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      item.isActive
                        ? 'gradient-bg text-white'
                        : 'hover:bg-opacity-10 hover:bg-gray-500'
                    }`}
                    style={{
                      color: item.isActive ? 'white' : 'var(--text-primary)'
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg transition-all duration-200 hover:bg-opacity-10 hover:bg-gray-500"
                style={{ color: 'var(--text-primary)' }}
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        item.isActive
                          ? 'gradient-bg text-white'
                          : 'hover:bg-opacity-10 hover:bg-gray-500'
                      }`}
                      style={{
                        color: item.isActive ? 'white' : 'var(--text-primary)'
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                كريبتو الآن - منصة تتبع العملات الرقمية
              </span>
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              © 2024 جميع الحقوق محفوظة
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;