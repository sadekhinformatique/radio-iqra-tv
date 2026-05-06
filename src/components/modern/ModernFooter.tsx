import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function ModernFooter() {
  const { config } = useSiteConfig();

  return (
    <footer
      className="pt-20 pb-10"
      style={{
        background: 'var(--site-footer-bg, #1a2e1a)',
        borderTop: '1px solid var(--site-footer-border, rgba(201,162,39,0.1))',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="size-8 flex items-center justify-center rounded"
                        style={{ background: 'var(--site-primary, #2e7d32)' }}
                    >
                        <span className="material-symbols-outlined text-xl" style={{ color: 'var(--site-gold, #c9a227)' }}>mosque</span>
                    </div>
                    <h1 className="text-lg font-extrabold" style={{ color: 'var(--site-text, #f1f5f9)' }}>
                      {config?.site_name || "Iqra FM"}
                    </h1>
                </div>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--site-text-secondary, #94a3b8)' }}>
                    La voix de la sagesse, émettant depuis le cœur du Burkina Faso pour éclairer les cœurs et guider les esprits selon les préceptes de l'Islam.
                </p>
            </div>
            <div>
                <h4 className="font-bold mb-6" style={{ color: 'var(--site-text, #f1f5f9)' }}>Liens Rapides</h4>
                <ul className="space-y-4">
                  {[
                    { to: '/a-propos', label: 'À Propos' },
                    { to: '/youtube', label: 'Programmes Vidéo' },
                    { to: '/podcasts', label: 'Podcasts' },
                    { to: '/contact', label: 'Nous Contacter' },
                  ].map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm transition-colors"
                        style={{ color: 'var(--site-text-secondary, #94a3b8)' }}
                        onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = 'var(--site-gold, #c9a227)'; }}
                        onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = 'var(--site-text-secondary, #94a3b8)'; }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6" style={{ color: 'var(--site-text, #f1f5f9)' }}>Notre Adresse</h4>
                <p className="text-sm mb-4" style={{ color: 'var(--site-text-secondary, #94a3b8)' }}>
                    Burkina Faso<br/>
                    Pour toute information ou suggestion.
                </p>
                <Link
                  to="/contact"
                  className="text-sm hover:underline font-bold flex items-center gap-2"
                  style={{ color: 'var(--site-gold, #c9a227)' }}
                >
                    <span className="material-symbols-outlined text-sm">mail</span> Contactez-nous
                </Link>
            </div>
        </div>
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            color: 'var(--site-text-muted, #64748b)',
          }}
        >
            <p>© {new Date().getFullYear()} {config?.site_name || "Radio Iqra"}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
