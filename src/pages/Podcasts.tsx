import { Mic2, Play, Calendar, Tag, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import EmptyListPage from "../components/EmptyListPage";
import { motion } from "motion/react";

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
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('podcasts')
          .select('*');

        if (error) {
          setErrorMsg(error.message);
          throw error;
        }
        
        // Tri manuel côté client
        const sortedData = (data || []).sort((a: any, b: any) => {
          const dateA = a.date || a.created_at || a.id;
          const dateB = b.date || b.created_at || b.id;
          return dateB > dateA ? 1 : -1;
        });

        setPodcasts(sortedData);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPodcasts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-iqra-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="py-20 px-4 text-center">
        <p className="text-red-500 font-bold mb-2">Erreur : {errorMsg}</p>
        <p className="text-gray-500 text-sm">Vérifiez les politiques RLS de votre table "podcasts".</p>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <EmptyListPage 
        title="Nos Podcasts"
        subtitle="Écoutez vos émissions préférées à tout moment, où que vous soyez au Burkina Faso et ailleurs."
        icon={Mic2}
        category="Podcast"
      />
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-iqra-gold/10 text-iqra-gold rounded-2xl mb-4">
          <Mic2 size={28} />
        </div>
        <h1 className="text-2xl md:text-4xl font-serif font-bold text-iqra-green mb-3">Nos Podcasts</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-medium">Redécouvrez nos émissions religieuses à tout moment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {podcasts.map((podcast) => (
          <motion.div 
            key={podcast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col gap-4 group"
          >
            <div className="w-full aspect-square bg-iqra-green/5 rounded-2xl flex items-center justify-center text-iqra-green relative overflow-hidden group-hover:bg-iqra-gold/10 transition-colors">
              <Mic2 size={64} className="opacity-20 translate-x-4 translate-y-4" />
              <button 
                onClick={() => window.open(podcast.audio_url, '_blank')}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-iqra-gold text-iqra-green rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </div>
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Tag size={10} /> {podcast.category}
                </span>
                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                  <Calendar size={10} /> {new Date(podcast.date).toLocaleDateString()}
                </span>
                {podcast.duration && (
                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    <Clock size={10} /> {podcast.duration}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-iqra-green group-hover:text-iqra-gold transition-colors line-clamp-2">{podcast.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
