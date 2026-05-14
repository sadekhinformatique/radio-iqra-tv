import { useEffect, type CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import PremiumHeader from '../premium/PremiumHeader';
import PremiumFooter from '../premium/PremiumFooter';
import PremiumFloatingPlayer from '../premium/PremiumFloatingPlayer';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function ModernLayout() {
  const { config, loading } = useSiteConfig();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {};
  }, []);

  if (loading || !config) return null;

  return (
    <div
      className="bg-night-900 text-gray-100 min-h-screen flex flex-col w-full overflow-x-hidden font-inter"
      style={{
        '--iqra-green': config.primary_color,
        '--iqra-gold': config.secondary_color,
      } as CSSProperties}
    >
      <PremiumHeader />
      <div className="flex-grow">
        <Outlet />
      </div>
      <PremiumFooter />
      <PremiumFloatingPlayer />
    </div>
  );
}
