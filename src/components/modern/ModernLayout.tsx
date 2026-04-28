import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ModernHeader from './ModernHeader';
import ModernFooter from './ModernFooter';
import ModernFloatingPlayer from './ModernFloatingPlayer';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function ModernLayout() {
  const { config, loading } = useSiteConfig();

  useEffect(() => {
    // Force dark mode for the modern layout since the templates use it
    document.documentElement.classList.add('dark');
    return () => {
      // document.documentElement.classList.remove('dark');
    };
  }, []);

  if (loading || !config) return null;

  return (
    <div 
      className="bg-modern-bg-light dark:bg-modern-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col w-full overflow-x-hidden"
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
      {/* We add the floating player bottom container */}
      <ModernFloatingPlayer />
    </div>
  );
}
