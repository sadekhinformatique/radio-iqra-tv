import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function ModernFooter() {
  const { config } = useSiteConfig();

  return (
    <footer className="bg-modern-neutral-dark pt-20 pb-10 border-t border-modern-primary/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-8 flex items-center justify-center bg-modern-primary rounded text-modern-gold">
                        <span className="material-symbols-outlined text-xl">mosque</span>
                    </div>
                    <h1 className="text-lg font-extrabold text-white">{config?.site_name || "Iqra FM"}</h1>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    La voix de la sagesse, émettant depuis le cœur du Burkina Faso pour éclairer les cœurs et guider les esprits selon les préceptes de l'Islam.
                </p>
                <div className="flex gap-4">
                    {/* Placeholder for real social links if they exist in config */}
                </div>
            </div>
            <div>
                <h4 className="text-white font-bold mb-6">Liens Rapides</h4>
                <ul className="space-y-4">
                    <li><Link to="/a-propos" className="text-slate-400 hover:text-modern-gold text-sm transition-colors">À Propos</Link></li>
                    <li><Link to="/youtube" className="text-slate-400 hover:text-modern-gold text-sm transition-colors">Programmes Vidéo</Link></li>
                    <li><Link to="/podcasts" className="text-slate-400 hover:text-modern-gold text-sm transition-colors">Podcasts</Link></li>
                    <li><Link to="/contact" className="text-slate-400 hover:text-modern-gold text-sm transition-colors">Nous Contacter</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-6">Notre Adresse</h4>
                <p className="text-slate-400 text-sm mb-4">
                    Burkina Faso<br/>
                    Pour toute information ou suggestion.
                </p>
                <Link to="/contact" className="text-modern-gold text-sm hover:underline font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">mail</span> Contactez-nous
                </Link>
            </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium">
            <p>© {new Date().getFullYear()} {config?.site_name || "Radio Iqra"}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
