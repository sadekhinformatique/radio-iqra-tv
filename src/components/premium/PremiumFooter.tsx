import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Facebook, Youtube, Send, Instagram, Twitter, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';

export default function PremiumFooter() {
  const { config } = useSiteConfig();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { url: config.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: config.youtube_url, icon: Youtube, label: 'YouTube' },
    { url: config.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: config.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: config.whatsapp_number ? `https://wa.me/${config.whatsapp_number}` : '', icon: Send, label: 'WhatsApp' },
  ].filter(s => s.url);

  return (
    <footer className="relative bg-night-900 border-t border-white/5 pt-16 pb-8">
      <div className="absolute inset-0 bg-gradient-premium opacity-30 pointer-events-none" />

      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all duration-300 hover:-translate-y-1"
      >
        <ArrowUp size={20} />
      </button>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
                <span className="text-gold-500 text-lg font-cairo font-black">Q</span>
              </div>
              <span className="text-lg font-cairo font-bold text-white">{config.site_name}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              La voix de la sagesse, émettant depuis le cœur du Burkina Faso pour éclairer les cœurs et guider les esprits selon les préceptes de l'Islam.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-600/20 text-gray-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-white font-cairo font-bold text-sm mb-5 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', path: '/' },
                { label: 'Le Coran', path: '/coran' },
                { label: 'Émissions Vidéo', path: '/youtube' },
                { label: 'Podcasts', path: '/podcasts' },
                { label: 'Conseils & Fatwas', path: '/conseils' },
                { label: 'Radio Direct', path: '/radio' },
                { label: 'Apprentissage', path: '/apprentissage' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-gold-500 text-sm transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-gold-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-cairo font-bold text-sm mb-5 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              {config.address && (
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <span>{config.address}</span>
                </li>
              )}
              {config.primary_phone && (
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone size={16} className="text-gold-500 flex-shrink-0" />
                  <span>{config.primary_phone}</span>
                </li>
              )}
              {config.email && (
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail size={16} className="text-gold-500 flex-shrink-0" />
                  <span>{config.email}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-cairo font-bold text-sm mb-5 uppercase tracking-wider">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Recevez nos dernières actualités et programmes.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all duration-300"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} {config.site_name}. Tous droits réservés.
          </p>
          <p className="text-gray-600 text-xs">
            {config.footer_text}
          </p>
        </div>
      </div>
    </footer>
  );
}
