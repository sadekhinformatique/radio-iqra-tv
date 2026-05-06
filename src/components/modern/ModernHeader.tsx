import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function ModernHeader() {
  const location = useLocation();
  const path = location.pathname;
  const { config } = useSiteConfig();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/coran', label: 'Coran' },
    { path: '/tafsir', label: 'Tafsir' },
    { path: '/youtube', label: 'Émissions' },
    { path: '/podcasts', label: 'Podcasts' },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md px-4 sm:px-6 lg:px-12 py-3 transition-colors duration-300"
      style={{
        background: 'var(--site-header-bg, rgba(255,255,255,0.92))',
        borderBottom: '1px solid var(--site-header-border, rgba(201,162,39,0.12))',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="size-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--site-primary, #2e7d32)' }}
          >
            <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--site-gold, #c9a227)' }}>mosque</span>
          </div>
          <div>
            <h1
              className="text-xl font-extrabold tracking-tight uppercase"
              style={{ color: 'var(--site-primary, #2e7d32)' }}
            >
              {config?.site_name || "Radio Iqra FM"}
            </h1>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase leading-none" style={{ color: 'var(--site-gold, #c9a227)' }}>
              La voix de la sagesse
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-semibold transition-colors"
              style={{
                color: path === item.path ? 'var(--site-gold, #c9a227)' : 'var(--site-text, #1a1a2e)',
                borderBottom: path === item.path ? '2px solid var(--site-gold, #c9a227)' : '2px solid transparent',
                paddingBottom: path === item.path ? '4px' : '0',
              }}
              onMouseEnter={(e) => {
                if (path !== item.path) (e.target as HTMLAnchorElement).style.color = 'var(--site-gold, #c9a227)';
              }}
              onMouseLeave={(e) => {
                if (path !== item.path) (e.target as HTMLAnchorElement).style.color = 'var(--site-text, #1a1a2e)';
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden size-10 rounded-full flex items-center justify-center border transition-colors"
            style={{
              borderColor: 'var(--site-border, rgba(0,0,0,0.06))',
              color: 'var(--site-text, #1a1a2e)',
            }}
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>

          <Link
            to="/listen-live"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--site-primary, #2e7d32)',
              color: 'var(--site-btn-text, #ffffff)',
              boxShadow: '0 4px 16px var(--primary-glow, rgba(46,125,50,0.25))',
            }}
          >
            <span className="material-symbols-outlined text-base">podcasts</span>
            En Direct
          </Link>
          <Link
            to="/secret-radio-iqra-xyz"
            className="flex items-center justify-center size-10 rounded-full border transition-colors"
            style={{
              borderColor: 'var(--site-border, rgba(0,0,0,0.06))',
              color: 'var(--site-text, #1a1a2e)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--primary-soft, rgba(46,125,50,0.08))'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mt-3 pt-3 border-t"
          style={{ borderColor: 'var(--site-border, rgba(0,0,0,0.06))' }}
        >
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  color: path === item.path ? 'var(--site-gold, #c9a227)' : 'var(--site-text, #1a1a2e)',
                  background: path === item.path ? 'var(--gold-soft, rgba(201,162,39,0.08))' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
