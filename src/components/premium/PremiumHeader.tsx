import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Menu, X, Search, Sun, Moon, Heart, Play, Headphones, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Accueil', path: '/' },
  { label: 'Live TV', path: '/youtube' },
  { label: 'Radio', path: '/radio' },
  { label: 'Podcasts', path: '/podcasts' },
  { label: 'Conférenciers', path: '/conseils' },
  { label: 'Articles', path: '/conseils' },
  { label: 'Événements', path: '/radio' },
  { label: 'À propos', path: '/a-propos' },
];

export default function PremiumHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();
  const { config } = useSiteConfig();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  return (
    <header className={'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ' + (isScrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent')}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-cairo font-black tracking-tight">IQRA</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-cairo font-bold text-white tracking-tight">IQRA <span className="text-emerald-400">RADIO & TV</span></span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={'px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ' + (isActive ? 'text-emerald-400 bg-emerald-600/10' : 'text-gray-300 hover:text-white hover:bg-white/5')}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden md:flex p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Search size={18} />
            </button>
            <button onClick={() => { setIsDark(!isDark); document.documentElement.classList.toggle('dark'); }} className="hidden md:flex p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/contact"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gold-600 hover:bg-gold-500 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-lg shadow-gold-600/25">
              <Heart size={16} />
              Faire un don
            </Link>
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
              {isMobileOpen ? <Menu size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <div className={'lg:hidden transition-all duration-400 overflow-hidden ' + (isMobileOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0')}>
        <div className="glass border-t border-white/5 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ' + (isActive ? 'bg-emerald-600/10 text-emerald-400' : 'text-gray-300 hover:bg-white/5')}>
                {item.label}
              </Link>
            );
          })}
          <Link to="/contact" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-600/10 text-gold-400 font-bold mt-2">
            <Heart size={18} /> Faire un don
          </Link>
        </div>
      </div>
    </header>
  );
}
