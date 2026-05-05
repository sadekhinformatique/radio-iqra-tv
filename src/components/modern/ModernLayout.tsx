import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ModernHeader from './ModernHeader';
import ModernFooter from './ModernFooter';
import ModernFloatingPlayer from './ModernFloatingPlayer';
import { useSiteConfig, useTheme } from '../../hooks/useSiteConfig';

export default function ModernLayout() {
  const { config, loading } = useSiteConfig();
  const { theme } = useTheme();

  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'auto' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    );
  }, [theme]);

  if (loading || !config) return null;

  return (
    <div 
      className={`bg-modern-bg-light ${isDark ? 'dark' : ''} bg-modern-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col w-full overflow-x-hidden`}
      style={{
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
