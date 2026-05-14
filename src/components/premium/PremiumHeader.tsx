import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Menu, X, ChevronDown, Radio, BookOpen, Youtube, Mic2, MessageSquare, Info, Phone } from 'lucide-react';

const navItems = [
  { label: 'Accueil', path: '/', icon: null },
  { label: 'Coran', path: '/coran', icon: BookOpen },
  { label: 'Émissions', path: '/youtube', icon: Youtube },
  { label: 'Podcasts', path: '/podcasts', icon: Mic2 },
  { label: 'Conseils', path: '/conseils', icon: MessageSquare },
  { label: 'Radio', path: '/radio', icon: Radio },
  { label: 'Contact', path: '/contact', icon: Phone },
  { label: 'À propos', path: '/a-propos', icon: Info },
];

export default function PremiumHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { config } = useSiteConfig();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
              <span className="text-gold-500 text-xl font-cairo font-black">Q</span>
            </div>
            <div>
              <span className="text-base lg:text-lg font-cairo font-bold text-white tracking-tight block leading-tight">
                {config?.site_name || 'Radio Iqra'}
              </span>
              <span className="text-[10px] text-gold-500 font-semibold tracking-[0.15em] uppercase block leading-none">
                La voix de la sagesse
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-gold-500 bg-gold-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/listen-live"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              En Direct
            </Link>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-400 overflow-hidden ${
          isMobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass border-t border-white/5 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-500'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {Icon && <Icon size={18} />}
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/listen-live"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-600/20 text-emerald-400 mt-2"
          >
            <Radio size={18} />
            Écouter en Direct
          </Link>
        </div>
      </div>
    </header>
  );
}
