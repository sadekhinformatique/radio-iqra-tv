import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ModernHeader from './ModernHeader';
import ModernFooter from './ModernFooter';
import ModernFloatingPlayer from './ModernFloatingPlayer';
import { useSiteConfig, useTheme, applySiteTheme } from '../../hooks/useSiteConfig';

export default function ModernLayout() {
  const { config, loading } = useSiteConfig();
  const { theme } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem('site_theme');
    if (stored) applySiteTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'auto' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    );
  }, [theme]);

  if (loading || !config) return null;

  return (
    <div 
      className="site-wrapper min-h-screen flex flex-col w-full overflow-x-hidden"
      style={{
        background: 'var(--site-bg, #faf8f2)',
        color: 'var(--site-text, #1a1a2e)',
        '--color-modern-primary-var': config.primary_color,
        '--color-modern-gold-var': config.secondary_color,
      } as React.CSSProperties}
    >
      <ModernHeader />
      <div className="flex-grow">
        <Outlet />
      </div>
      <ModernFooter />
      <ModernFloatingPlayer />
    </div>
  );
}
