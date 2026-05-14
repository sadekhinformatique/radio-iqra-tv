import { Mic2, Play, Calendar, Tag, Clock, Headphones, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import EmptyListPage from '../components/EmptyListPage';
import { motion } from 'motion/react';

interface Podcast {
  id: string;
  title: string;
  category: string;
  date: string;
  audio_url: string;
  duration?: string;
}

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPodcasts() {
      if (!supabase) { setLoading(false); return; }
      try {
        const { data, error } = await supabase.from('podcasts').select('*');
        if (error) { setErrorMsg(error.message); throw error; }
        const sorted = (data || []).sort((a: any, b: any) => {
          const dA = a.date || a.created_at || a.id;
          const dB = b.date || b.created_at || b.id;
          return dB > dA ? 1 : -1;
        });
        setPodcasts(sorted);
      } catch (err) {
        console.error('Error fetching podcasts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPodcasts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-night">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gold font-black uppercase tracking-widest text-xs">Chargement des podcasts...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center bg-night">
        <p className="text-red-500 font-black mb-4 uppercase tracking-tighter text-2xl">Erreur de connexion</p>
        <p className="text-gray-500 text-lg">{errorMsg}</p>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return <EmptyListPage title="Nos Podcasts" subtitle="Écoutez vos émissions préférées à tout moment." icon={Mic2} category="Podcast" />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-night">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-primary/20 text-gold mb-8 gold-glow"
          >
            <Headphones size={48} />
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-cairo font-black text-white mb-6 tracking-tighter uppercase">
            Nos <span className="text-gold italic">Podcasts</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            Redécouvrez nos émissions religieuses et conférences à tout moment, en haute qualité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {podcasts.map((podcast, idx) => (
            <motion.div
              key={podcast.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="glass-card rounded-[40px] overflow-hidden group border-white/5 hover:border-gold/30 transition-all duration-500 shadow-xl"
            >
              <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-night flex items-center justify-center overflow-hidden">
                <Mic2 size={120} className="text-white/5 absolute -right-8 -bottom-8 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-night/20 group-hover:bg-night/40 transition-colors" />
                
                <button
                  onClick={() => window.open(podcast.audio_url, '_blank')}
                  className="relative w-20 h-20 rounded-full bg-gold text-night flex items-center justify-center shadow-2xl scale-90 group-hover:scale-105 transition-all gold-glow"
                >
                  <Play size={32} fill="currentColor" className="ml-1" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20">
                    <Tag size={12} /> {podcast.category}
                  </span>
                  <div className="flex items-center gap-4 ml-auto">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} className="text-gold" /> {new Date(podcast.date).toLocaleDateString()}
                    </span>
                    {podcast.duration && (
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} className="text-gold" /> {podcast.duration}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-gold transition-colors line-clamp-2">
                  {podcast.title}
                </h3>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-gold animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Premium Audio</span>
                   </div>
                   <button className="text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Écouter maintenant</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

