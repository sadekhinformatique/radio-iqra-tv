import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Headphones, Users, Tv, Radio, Mic2, MessageSquare, Clock, BookOpen, Pause, Volume2, Heart, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { supabase } from '../../lib/supabase';

const services = [
  { label: 'Live TV', icon: Tv, path: '/youtube' },
  { label: 'Radio', icon: Radio, path: '/radio' },
  { label: 'Podcasts', icon: Mic2, path: '/podcasts' },
  { label: 'Conférences', icon: MessageSquare, path: '/conseils' },
  { label: 'Prières', icon: Clock, path: '/radio' },
  { label: 'Coran', icon: BookOpen, path: '/coran' },
];

const speakers = [
  { name: 'Cheikh Oumar Diagne', specialty: 'Tafsir', initials: 'OD' },
  { name: 'Sœur Aïcha', specialty: 'Éducation islamique', initials: 'SA' },
  { name: 'Imam Abdoulaye', specialty: 'Hadith', initials: 'IA' },
  { name: 'Cheikh Hassan', specialty: 'Fiqh', initials: 'CH' },
];

export default function PremiumHome() {
  const { config } = useSiteConfig();
  const [latestPodcasts, setLatestPodcasts] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [listeners, setListeners] = useState(12458);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) return;
      try {
        const { data: podcasts } = await supabase.from('podcasts').select('*').order('date', { ascending: false }).limit(10);
        if (podcasts) setLatestPodcasts(podcasts);
      } catch (err) { console.error(err); }
      try {
        const { data: articles } = await supabase.from('articles').select('*').order('date', { ascending: false }).limit(10);
        if (articles) setLatestArticles(articles);
      } catch (err) { console.error(err); }
    }
    fetchData();
    const interval = setInterval(() => setListeners(p => Math.max(10000, p + Math.floor(Math.random() * 20) - 8)), 6000);
    return () => clearInterval(interval);
  }, []);

  const liveShows = [
    { title: 'La voie des pieux', viewers: 892, tag: 'LIVE' },
    { title: 'Récitation du Coran', viewers: 654, tag: 'LIVE' },
    { title: "Les enseignements du Prophète", viewers: 423, tag: 'LIVE' },
    { title: 'Foi et Spiritualité', viewers: 311, tag: 'LIVE' },
  ];

  return (
    <main>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564769625384-45e1e5d7e5c5?q=80&w=2070&auto=format&fit=crop"
            alt="Mosquée de nuit"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night-900 via-night-900/80 to-night-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-night-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_60%)]" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 w-full pt-32 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative rounded-full h-2 w-2 bg-emerald-400" /></span>
                  {listeners.toLocaleString()} Auditeurs en direct
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cairo font-black text-white leading-[1.15] mb-6">
                  Le média islamique <span className="text-gradient-gold">moderne</span><br />qui connecte foi, savoir et communauté.
                </h1>

                <p className="text-lg text-gray-300 leading-relaxed max-w-xl mb-8">
                  Basée au cœur du Burkina Faso, {config.site_name} diffuse les enseignements authentiques de l'Islam dans un esprit de paix, de fraternité et d'éducation spirituelle.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link to="/listen-live" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/50">
                    <Play size={20} fill="currentColor" />
                    Regarder en direct
                  </Link>
                  <Link to="/radio" className="px-8 py-4 border border-white/20 hover:border-emerald-500/50 text-white font-medium rounded-full transition-all duration-300 flex items-center gap-3 hover:bg-white/5">
                    <Headphones size={20} />
                    Écouter la radio
                  </Link>
                </div>

                <div className="flex items-center gap-2 mt-6 text-sm text-gray-400">
                  <Users size={16} className="text-emerald-400" />
                  <span className="font-semibold text-white">{listeners.toLocaleString()}</span> Auditeurs en direct
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                <div className="glass rounded-2xl p-6 shadow-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
                        <Radio size={20} className="text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Radio IQRA</h4>
                        <p className="text-xs text-gray-500">En direct</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">LIVE</span>
                  </div>

                  <div className="flex items-center justify-center gap-1 h-12 mb-5">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="w-1 bg-emerald-500/60 rounded-full audio-bar" style={{ height: Math.random() * 20 + 3 + 'px', animationDelay: i * 0.06 + 's' }} />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-gold-600 text-white flex items-center justify-center hover:bg-gold-500 transition-all shadow-lg">
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                      </button>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors"><Volume2 size={16} /></button>
                        <div className="w-16 h-1 bg-white/10 rounded-full"><div className="w-3/4 h-full bg-emerald-500 rounded-full" /></div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">AAC 128k</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night-900 to-transparent z-10" />
      </section>

      <div className="max-w-7xl mx-auto -mt-8 relative z-20 mb-14">
        <div className="px-4 lg:px-8">
          <div className="glass rounded-2xl p-3 flex items-center justify-around flex-wrap gap-2">
            {services.map((s, i) => (
              <Link key={i} to={s.path} className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl hover:bg-emerald-600/10 transition-all group min-w-[70px]">
                <s.icon size={20} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                <span className="text-[10px] text-gray-400 group-hover:text-white font-medium uppercase tracking-wider">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h2 className="text-2xl font-cairo font-bold text-white">Émissions en direct</h2>
          </div>
          <Link to="/youtube" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">Voir tout <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveShows.map((show, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-emerald-900/30 to-night-800 relative flex items-center justify-center">
                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> {show.tag}
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-night-900/60 text-white text-[10px] font-medium backdrop-blur-sm">
                  {show.viewers} vues
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={22} fill="white" className="text-white ml-0.5" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-white line-clamp-1">{show.title}</h3>
                <p className="text-xs text-gray-500 mt-1">En direct maintenant</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gold-500 rounded-full" />
            <h2 className="text-2xl font-cairo font-bold text-white">Podcasts populaires</h2>
          </div>
          <Link to="/podcasts" className="text-sm text-gold-400 hover:text-gold-300 flex items-center gap-1">Voir tout <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(latestPodcasts.length > 0 ? latestPodcasts.slice(0, 6) : [
            { id: 1, title: "L'Islam, une voie de paix" },
            { id: 2, title: "Étude du Coran" },
            { id: 3, title: "Les enseignements du Prophète" },
            { id: 4, title: "La femme en Islam" },
            { id: 5, title: "Les piliers de la foi" },
            { id: 6, title: "La spiritualité au quotidien" },
          ]).map((podcast: any, i) => (
            <div key={podcast.id || i} className="glass-card rounded-xl overflow-hidden group hover:border-gold-500/30 transition-all duration-500 cursor-pointer flex items-center gap-4 p-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-900/30 to-night-700 flex items-center justify-center flex-shrink-0">
                <Mic2 size={22} className="text-gold-400/60" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white line-clamp-1">{podcast.title || podcast.titre}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{podcast.category || 'Podcast'}</p>
              </div>
              <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-600 text-white flex items-center justify-center transition-all flex-shrink-0 opacity-0 group-hover:opacity-100">
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-6 lg:col-span-1">
            <h3 className="text-sm font-cairo font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={16} className="text-emerald-400" /> Horaires de prières
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Dakar, Sénégal</p>
            <div className="space-y-2.5">
              {[
                { name: 'Fajr', time: '05:12' },
                { name: 'Dhuhr', time: '12:30' },
                { name: 'Asr', time: '15:45' },
                { name: 'Maghrib', time: '18:18' },
                { name: 'Isha', time: '19:42' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0">
                  <span className="text-gray-400">{p.name}</span>
                  <span className="text-white font-mono font-bold">{p.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 lg:col-span-1 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <svg viewBox="0 0 200 200" className="w-full h-full"><path d="M100 20 L190 180 L10 180 Z" fill="currentColor" className="text-emerald-400" /></svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-cairo font-bold text-white mb-3">Citation du jour</h3>
              <p className="text-sm text-gray-300 italic leading-relaxed">
                "Et rappelle, car le rappel profite aux croyants."
              </p>
              <p className="text-xs text-emerald-400 mt-3 font-medium">Sourate Adh-Dhariyat, 51:55</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 lg:col-span-1">
            <h3 className="text-sm font-cairo font-bold text-white mb-4">Conférenciers</h3>
            <div className="space-y-3">
              {speakers.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-xs font-bold">
                    {s.initials}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{s.name}</p>
                    <p className="text-[10px] text-gray-500">{s.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 lg:col-span-1">
            <h3 className="text-sm font-cairo font-bold text-white mb-4 flex items-center gap-2">
              <Heart size={16} className="text-red-400" /> Soutenez-nous
            </h3>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>2,450,000 FCFA</span>
                <span>5,000,000 FCFA</span>
              </div>
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full" style={{ width: '49%' }} />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">49% de l'objectif</p>
            </div>
            <Link to="/contact" className="w-full py-2.5 bg-gold-600 hover:bg-gold-500 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              <Heart size={14} /> Faire un don
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
        <div className="glass-card rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-cairo font-bold text-white mb-4">
            À Propos de <span className="text-emerald-400">{config.site_name}</span>
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            "{config.site_name} — La Voix du Saint Coran. Basée au cœur du Burkina Faso, notre station islamique est dédiée à la diffusion des enseignements authentiques de l'Islam, dans un esprit de paix, de fraternité et d'éducation spirituelle."
          </p>
          <Link to="/a-propos" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-full text-sm hover:bg-emerald-600/20 transition-all">
            En savoir plus <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
