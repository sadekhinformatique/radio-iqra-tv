import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function ModernHeader() {
  const location = useLocation();
  const path = location.pathname;
  const { config } = useSiteConfig();

  return (
    <header className="sticky top-0 z-50 w-full bg-modern-bg-light/80 dark:bg-modern-bg-dark/80 backdrop-blur-md border-b border-modern-primary/20 px-6 lg:px-20 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-10 bg-modern-primary rounded-lg flex items-center justify-center text-modern-gold">
            <span className="material-symbols-outlined text-3xl">mosque</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-modern-primary dark:text-slate-100 uppercase">{config?.site_name || "Radio Iqra FM"}</h1>
            <p className="text-[10px] text-modern-gold font-semibold tracking-[0.2em] uppercase leading-none">La voix de la sagesse</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm font-semibold transition-colors ${path === '/' ? 'text-modern-gold border-b-2 border-modern-gold pb-1' : 'hover:text-modern-gold'}`}>Accueil</Link>
          <Link to="/coran" className={`text-sm font-semibold transition-colors ${path === '/coran' ? 'text-modern-gold border-b-2 border-modern-gold pb-1' : 'hover:text-modern-gold'}`}>Coran</Link>
          <Link to="/youtube" className={`text-sm font-semibold transition-colors ${path === '/youtube' ? 'text-modern-gold border-b-2 border-modern-gold pb-1' : 'hover:text-modern-gold'}`}>Émissions</Link>
          <Link to="/podcasts" className={`text-sm font-semibold transition-colors ${path === '/podcasts' ? 'text-modern-gold border-b-2 border-modern-gold pb-1' : 'hover:text-modern-gold'}`}>Podcasts</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/listen-live" className="hidden sm:flex items-center gap-2 bg-modern-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-modern-primary/30 hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-base">podcasts</span>
            En Direct
          </Link>
          <Link to="/secret-radio-iqra-xyz" className="flex items-center justify-center size-10 rounded-full border border-modern-primary/20 hover:bg-modern-primary/10 transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
