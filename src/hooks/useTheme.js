import { useEffect } from 'react';

export const useTheme = () => {
  useEffect(() => {
    // Force dark mode only
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  }, []);

  return {
    isDarkMode: true,
    theme: 'dark'
  };
};