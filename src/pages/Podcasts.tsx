import { Mic2, Play, Calendar, Tag, Clock } from 'lucide-react';
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
    return <div className="min-h-screen pt-28 flex justify-center"><div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <p className="text-red-400 font-bold mb-2">Erreur : {errorMsg}</p>
        <p className="text-gray-500 text-sm">Vérifiez les politiques RLS de votre table podcasts.</p>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return <EmptyListPage title="Nos Podcasts" subtitle="Écoutez vos émissions préférées à tout moment." icon={Mic2} category="Podcast" />;
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gold-500/10 text-gold-400 mb-6">
            <Mic2 size={40} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-cairo font-bold text-white mb-4">Nos Podcasts</h1>
          <p className="text-gray-400">Redécouvrez nos émissions religieuses à tout moment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <motion.div
              key={podcast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all duration-500"
            >
              <div className="aspect-square relative bg-gradient-to-br from-emerald-900/20 to-night-800 flex items-center justify-center">
                <Mic2 size={80} className="text-white/5 absolute" />
                <button
                  onClick={() => window.open(podcast.audio_url, '_blank')}
                  className="relative w-16 h-16 rounded-full bg-gold-500 text-night-900 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                >
                  <Play size={28} fill="currentColor" className="ml-1" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-emerald-600/10 text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Tag size={10} /> {podcast.category}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Calendar size={10} /> {new Date(podcast.date).toLocaleDateString()}
                  </span>
                  {podcast.duration && (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock size={10} /> {podcast.duration}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-gold-400 transition-colors">
                  {podcast.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
