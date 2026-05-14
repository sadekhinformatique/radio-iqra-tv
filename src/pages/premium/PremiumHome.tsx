import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Headphones, Users, Tv, Radio, Mic2, MessageSquare, Clock, BookOpen, Pause, Volume2, Heart, ChevronRight, Star, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { supabase } from '../../lib/supabase';

const categories = [
  { label: 'Direct TV', icon: Tv, path: '/youtube', color: 'bg-red-500' },
  { label: 'Radio Live', icon: Radio, path: '/radio', color: 'bg-emerald-500' },
  { label: 'Podcasts', icon: Mic2, path: '/podcasts', color: 'bg-gold' },
  { label: 'Conférences', icon: MessageSquare, path: '/conseils', color: 'bg-blue-500' },
  { label: 'Coran', icon: BookOpen, path: '/coran', color: 'bg-purple-500' },
];

export default function PremiumHome() {
  const { config } = useSiteConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [listeners, setListeners] = useState(12458);
  const [grille, setGrille] = useState<any[]>([]);

  useEffect(() => {
    const fetchGrille = async () => {
      const { data } = await supabase.from('grille').select('*').limit(10);
      if (data) setGrille(data);
    };
    fetchGrille();

    const interval = setInterval(() => setListeners(p => p + Math.floor(Math.random() * 5) - 2), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-night min-h-screen">
      {/* Hero Section Immersive */}
      <section className="relative h-[90vh] lg:h-screen flex items-center overflow-hidden">
        {/* Background avec overlay progressif */}
        <div className="absolute inset-0">
          <img
            src={config.hero_image_url || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop"}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative rounded-full h-3 w-3 bg-emerald-400" />
                </span>
                {listeners.toLocaleString()} PERSONNES EN DIRECT
              </div>

              <h1 className="text-5xl lg:text-8xl font-cairo font-black text-white leading-[1.1] mb-6 tracking-tighter uppercase">
                {config.hero_title_1 || "La Foi"} <span className="text-gold italic">{config.hero_title_2 || "Connectée"}</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl font-medium">
                {config.hero_subtitle || `Découvrez une expérience spirituelle unique avec ${config.site_name}. Streaming HD, podcasts exclusifs et enseignements authentiques.`}
              </p>

              <div className="flex flex-wrap gap-5">
                <Link to="/youtube" className="group px-10 py-5 bg-gold hover:bg-gold/90 text-night font-black rounded-2xl transition-all duration-300 flex items-center gap-3 premium-shadow hover:-translate-y-1">
                  <Play size={24} fill="currentColor" className="transition-transform group-hover:scale-110" />
                  REGARDER LE DIRECT
                </Link>
                <Link to="/radio" className="px-10 py-5 glass border-white/10 hover:border-gold/30 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-3 hover:bg-white/5">
                  <Radio size={24} className="text-gold" />
                  ÉCOUTER LA RADIO
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Player Widget */}
        <div className="absolute bottom-20 right-4 lg:right-8 hidden xl:block">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 w-80 rounded-3xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center gold-glow">
                <Radio size={28} className="text-gold" />
              </div>
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-wider">{config.site_name}</h4>
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" /> EN DIRECT
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 h-8 mb-6 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="flex-1 bg-gold/40 rounded-full audio-flow" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>

            {config.radio_stream_url && isPlaying && (
              <audio autoPlay src={config.radio_stream_url} />
            )}

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center gap-3 transition-all"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              {isPlaying ? 'PAUSE' : 'ÉCOUTER MAINTENANT'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Catégories Rapides */}
      <div className="max-w-7xl mx-auto -mt-16 relative z-30 px-4 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              to={cat.path} 
              className="glass-card group p-6 flex flex-col items-center gap-4 rounded-3xl hover:bg-primary/20"
            >
              <div className={`p-4 rounded-2xl ${cat.color} bg-opacity-20 text-white transition-transform group-hover:scale-110`}>
                <cat.icon size={28} />
              </div>
              <span className="text-sm font-black text-white uppercase tracking-widest">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Section Direct & Programmes (Style Netflix) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-gold font-bold text-xs tracking-[0.3em] uppercase mb-2">
              <Sparkles size={14} /> Programmation
            </div>
            <h2 className="text-4xl font-cairo font-black text-white tracking-tight">À ne pas <span className="text-gold">manquer</span></h2>
          </div>
          <Link to="/youtube" className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2 group transition-all">
            VOIR TOUT <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {grille.length > 0 ? grille.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-80 lg:w-[400px] glass-card rounded-3xl overflow-hidden group cursor-pointer">
              <div className="aspect-video relative">
                <img 
                  src={`https://images.unsplash.com/photo-1584281723351-9d92ff3f8142?q=80&w=800&auto=format&fit=crop&sig=${i}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 glass rounded-full text-[10px] font-black text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" /> {item.day.toUpperCase()}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-widest mb-2">
                  <Clock size={12} /> {item.start_time} - {item.end_time}
                </div>
                <h3 className="text-xl font-black text-white mb-2 leading-snug">{item.title}</h3>
                <p className="text-sm text-gray-400 font-medium line-clamp-1">{item.description}</p>
              </div>
            </div>
          )) : (
            [1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 lg:w-[400px] glass-card rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-white/5" />
                <div className="p-6 space-y-4">
                  <div className="w-24 h-4 bg-white/5 rounded" />
                  <div className="w-full h-8 bg-white/5 rounded" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Widgets Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Horaires de prières */}
          <div className="md:col-span-4 glass-card rounded-[40px] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-cairo font-black text-white">Salat</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-widest">
                <MapPin size={14} /> {config.prayer_location || "OUAGADOUGOU"}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Fajr', time: '05:12', active: false },
                { name: 'Dhuhr', time: '13:02', active: true },
                { name: 'Asr', time: '16:45', active: false },
                { name: 'Maghrib', time: '19:18', active: false },
                { name: 'Isha', time: '20:30', active: false },
              ].map((p, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${p.active ? 'bg-primary/40 border border-emerald-500/30 gold-glow' : 'hover:bg-white/5'}`}>
                  <span className={`text-lg font-bold ${p.active ? 'text-white' : 'text-gray-400'}`}>{p.name}</span>
                  <span className={`text-lg font-black font-mono ${p.active ? 'text-gold' : 'text-white'}`}>{p.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Podcasts & Speakers */}
          <div className="md:col-span-8 space-y-8">
            <div className="glass-card rounded-[40px] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-cairo font-black text-white">Podcasts Populaires</h3>
                <Link to="/podcasts" className="text-xs font-black text-gold uppercase tracking-widest">Écouter tout</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                    <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-gold transition-transform group-hover:scale-105">
                      <Mic2 size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">La Vie des Compagnons</h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Épisode {i + 5}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} fill="white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[40px] p-8 bg-gradient-premium border-none relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/60 font-bold text-[10px] tracking-[0.3em] uppercase mb-4">
                  <Star size={12} /> Citation Quotidienne
                </div>
                <blockquote className="text-2xl lg:text-3xl font-cairo font-bold text-white leading-tight mb-6">
                  "{config.daily_quote || "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne."}"
                </blockquote>
                <cite className="text-gold font-black not-italic uppercase tracking-widest text-xs">— {config.daily_quote_author || "Rapporté par Al-Boukhari"}</cite>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <BookOpen size={200} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-24">
        <div className="glass-card rounded-[50px] p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 border-emerald-500/10">
          <div className="flex-1">
            <h2 className="text-4xl lg:text-6xl font-cairo font-black text-white mb-6 uppercase tracking-tighter">
               {config.donation_title || "Unissez-vous pour le Savoir."}
            </h2>
            <p className="text-xl text-gray-400 font-medium mb-10 leading-relaxed">
              {config.donation_description || `Votre soutien permet à ${config.site_name} de continuer sa mission d'éducation et de partage spirituel à travers le monde. Chaque don compte.`}
            </p>
            <div className="space-y-6 mb-10 max-w-md">
              <div className="flex justify-between text-sm font-black text-white mb-2 uppercase tracking-widest">
                <span>Objectif 2026</span>
                <span className="text-gold">{Math.round((config.donation_current / (config.donation_goal || 1)) * 100)}% Atteint</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-gold rounded-full" style={{ width: `${(config.donation_current / (config.donation_goal || 1)) * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                <span>{config.donation_current?.toLocaleString()} FCFA récoltés</span>
                <span>{config.donation_goal?.toLocaleString()} FCFA</span>
              </div>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-3 px-12 py-5 bg-gold text-night font-black rounded-3xl premium-shadow hover:-translate-y-1 transition-all uppercase tracking-[0.2em] text-xs">
              <Heart size={20} fill="currentColor" /> FAIRE UN DON MAINTENANT
            </Link>
          </div>
          <div className="flex-1 relative hidden lg:block">
            <div className="relative z-10 rounded-[40px] overflow-hidden glass-card p-4 gold-glow border-white/5">
               <img src="https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop" className="rounded-[30px] w-full" alt="Donation" />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/20 blur-[80px] rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}

