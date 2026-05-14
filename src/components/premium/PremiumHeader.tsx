import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Menu, X, Search, Sun, Moon, Heart, Play, Headphones, Radio as RadioIcon, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { label: 'Accueil', path: '/', icon: <Play size={16} /> },
  { label: 'Live TV', path: '/youtube', icon: <Tv size={16} /> },
  { label: 'Radio', path: '/radio', icon: <RadioIcon size={16} /> },
  { label: 'Podcasts', path: '/podcasts', icon: <Headphones size={16} /> },
  { label: 'Conférenciers', path: '/conseils', icon: <X size={16} /> },
  { label: 'À propos', path: '/a-propos', icon: <X size={16} /> },
];

export default function PremiumHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { config } = useSiteConfig();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'glass py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl bg-primary gold-glow transition-transform duration-300 group-hover:scale-110">
              <span className="text-gold font-cairo font-black text-xs leading-none tracking-tighter">IQRA</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-cairo font-black text-white leading-tight tracking-tight">
                RADIO <span className="text-gold italic">IQRA</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-400 tracking-[0.2em] uppercase leading-none">
                Media Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                    isActive 
                      ? 'text-white bg-primary/40 border border-emerald-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link 
              to="/contact"
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gold hover:bg-gold/90 text-night text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl shadow-gold/20 hover:-translate-y-0.5"
            >
              <Heart size={14} className="fill-current" />
              Soutenir
            </Link>
            
            <button 
              onClick={() => setIsMobileOpen(!isMobileOpen)} 
              className="lg:hidden p-2 text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-white/5 lg:hidden overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-semibold transition-all ${
                    location.pathname === item.path 
                      ? 'bg-primary/20 text-emerald-400 border border-emerald-500/20' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="p-2 rounded-lg bg-white/5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <Link 
                to="/contact" 
                className="flex items-center justify-center gap-3 px-4 py-5 rounded-2xl bg-gold text-night font-black uppercase tracking-widest text-sm mt-4 shadow-lg shadow-gold/20"
              >
                <Heart size={18} className="fill-current" /> 
                Faire un don
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

