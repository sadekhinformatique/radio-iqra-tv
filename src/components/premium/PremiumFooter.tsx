import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Facebook, Youtube, Send, Instagram, Twitter, ArrowUp, Mail, Smartphone, Globe, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function PremiumFooter() {
  const { config } = useSiteConfig();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socialLinks = [
    { url: config.facebook_url, icon: Facebook, label: 'Facebook', color: 'hover:text-blue-500' },
    { url: config.youtube_url, icon: Youtube, label: 'YouTube', color: 'hover:text-red-500' },
    { url: config.instagram_url, icon: Instagram, label: 'Instagram', color: 'hover:text-pink-500' },
    { url: config.whatsapp_number ? 'https://wa.me/' + config.whatsapp_number : '', icon: MessageCircle, label: 'WhatsApp', color: 'hover:text-emerald-500' },
  ].filter(s => s.url);

  return (
    <footer className="relative bg-night border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />

      <button 
        onClick={scrollToTop} 
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary text-gold flex items-center justify-center shadow-2xl gold-glow hover:scale-110 transition-all z-20"
      >
        <ArrowUp size={24} />
      </button>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center gold-glow">
                <span className="text-gold text-sm font-cairo font-black tracking-tighter">IQRA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-cairo font-black text-white leading-tight uppercase tracking-tighter">
                  Radio <span className="text-gold italic">Iqra</span>
                </span>
                <span className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">Media Platform</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Le premier média islamique moderne dédié à l'éveil spirituel et à l'éducation, diffusant la sagesse du Coran à travers le monde.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((s, i) => (
                <a 
                  key={i} 
                  href={s.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-white/10 ${s.color}`}
                  aria-label={s.label}
                >
                  <s.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Plateforme</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Direct TV', path: '/youtube' },
                  { label: 'Radio Live', path: '/radio' },
                  { label: 'Podcasts', path: '/podcasts' },
                  { label: 'Coran', path: '/coran' }
                ].map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-gray-400 hover:text-gold text-sm font-medium transition-colors flex items-center gap-2 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Communauté</h4>
              <ul className="space-y-4">
                {[
                  { label: 'À propos', path: '/a-propos' },
                  { label: 'Faire un don', path: '/contact' },
                  { label: 'Conseils', path: '/conseils' },
                  { label: 'Contact', path: '/contact' }
                ].map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/0 group-hover:bg-gold transition-all" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter / Apps */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Newsletter</h4>
            <p className="text-gray-500 text-xs mb-6">Restez connecté aux enseignements.</p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/5">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="flex-1 px-4 py-2 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none" 
              />
              <button className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all">
                <Send size={18} />
              </button>
            </form>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-4 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                <Smartphone size={20} className="text-emerald-400" />
                <div className="text-left">
                  <p className="text-[8px] text-gray-500 uppercase font-black">Disponible sur</p>
                  <p className="text-xs text-white font-black">App Store & Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-gray-600 text-[10px] font-bold tracking-widest uppercase">© 2026 Radio IQRA TV</p>
            <Link to="/contact" className="text-gray-600 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors">Politique de confidentialité</Link>
          </div>
          <div className="flex items-center gap-4 px-4 py-2 glass rounded-full">
            <Globe size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Sénégal — Français</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

