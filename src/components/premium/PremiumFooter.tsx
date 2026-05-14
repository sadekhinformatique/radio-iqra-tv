import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Facebook, Youtube, Send, Instagram, Twitter, ArrowUp, Mail, Smartphone, Globe } from 'lucide-react';

export default function PremiumFooter() {
  const { config } = useSiteConfig();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socialLinks = [
    { url: config.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: config.youtube_url, icon: Youtube, label: 'YouTube' },
    { url: config.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: config.whatsapp_number ? 'https://wa.me/' + config.whatsapp_number : '', icon: Send, label: 'WhatsApp' },
    { url: config.telegram_url, icon: Twitter, label: 'Telegram' },
  ].filter(s => s.url);

  return (
    <footer className="relative bg-night-900 border-t border-white/5 pt-12 pb-6">
      <button onClick={scrollToTop} className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-500 transition-all hover:-translate-y-1">
        <ArrowUp size={20} />
      </button>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
              <Mail size={24} className="text-emerald-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-white font-bold text-sm">Restez informé</h4>
              <p className="text-xs text-gray-500">Recevez nos dernières actualités</p>
            </div>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
              <input type="email" placeholder="Votre email" className="flex-1 sm:w-48 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
              <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap">S'abonner</button>
            </form>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3">
            {socialLinks.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-600/20 text-gray-400 hover:text-emerald-400 flex items-center justify-center transition-all" aria-label={s.label}>
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white text-xs font-cairo font-black">IQRA</span>
              </div>
              <span className="text-sm font-cairo font-bold text-white">IQRA <span className="text-emerald-400">RADIO & TV</span></span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">La voix de la sagesse, émettant depuis le cœur du Burkina Faso pour éclairer les cœurs et guider les esprits.</p>
          </div>

          <div>
            <h4 className="text-white font-cairo font-bold text-xs uppercase tracking-wider mb-4">Liens rapides</h4>
            <ul className="space-y-2.5">
              {[{ label: 'Accueil', path: '/' }, { label: 'Live TV', path: '/youtube' }, { label: 'Radio', path: '/radio' }, { label: 'Podcasts', path: '/podcasts' }, { label: 'Coran', path: '/coran' }].map((l) => (
                <li key={l.path}><Link to={l.path} className="text-gray-400 hover:text-emerald-400 text-xs transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-cairo font-bold text-xs uppercase tracking-wider mb-4">Informations</h4>
            <ul className="space-y-2.5">
              {[{ label: 'À propos', path: '/a-propos' }, { label: 'Contact', path: '/contact' }, { label: 'Conseils', path: '/conseils' }, { label: 'Apprentissage', path: '/apprentissage' }].map((l) => (
                <li key={l.path}><Link to={l.path} className="text-gray-400 hover:text-emerald-400 text-xs transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-cairo font-bold text-xs uppercase tracking-wider mb-4">Télécharger l'App</h4>
            <div className="space-y-2.5">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left">
                <Smartphone size={18} className="text-gray-400" />
                <div><p className="text-[10px] text-gray-500">Disponible sur</p><p className="text-xs text-white font-semibold">Google Play</p></div>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left">
                <Smartphone size={18} className="text-gray-400" />
                <div><p className="text-[10px] text-gray-500">Télécharger sur</p><p className="text-xs text-white font-semibold">App Store</p></div>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[10px]">© 2024 Radio IQRA TV. Tous droits réservés.</p>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <Globe size={12} />
            <span>Français</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
