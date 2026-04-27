import { motion } from "motion/react";
import { Play, Book, Youtube, Mic2, MessageSquare, ChevronRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [latestPodcast, setLatestPodcast] = useState<any>(null);
  const [latestArticle, setLatestArticle] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) return;
      
      try {
        // Fetch latest podcast (try 'date' first, then 'created_at')
        const { data: podcasts } = await supabase
          .from('podcasts')
          .select('*')
          .limit(1);
        
        if (podcasts && podcasts.length > 0) {
          setLatestPodcast(podcasts[0]);
        }

        // Fetch latest article (avoiding created_at if it might not exist)
        const { data: articles } = await supabase
          .from('articles')
          .select('*')
          .limit(1);
        
        if (articles && articles.length > 0) {
          setLatestArticle(articles[0]);
        }
      } catch (err) {
        console.error("Error loading home data:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-iqra-green">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 uppercase tracking-tight leading-none">
              La Voix du <span className="text-iqra-gold">Saint Coran</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Basée au cœur du Burkina Faso, RADIO IQRA TV est une station islamique 
              dédiée à la diffusion des enseignements authentiques de l'Islam.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                to="/radio"
                className="px-8 py-4 bg-iqra-gold text-iqra-green font-bold rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-xl uppercase tracking-wider text-sm"
              >
                <Play size={20} fill="currentColor" /> Écouter en Direct
              </Link>
              <Link 
                to="/a-propos"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-full flex items-center gap-2 hover:bg-white/20 transition-all uppercase tracking-wider text-sm"
              >
                En savoir plus
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pages Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-20 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PageCard 
            title="Bibliothèque Coranique" 
            desc="Accédez à une vaste collection de récitations par les plus grands imams du pays." 
            icon={Book} 
            to="/coran"
            color="bg-green-50"
            iconColor="text-iqra-green"
          />
          <PageCard 
            title="Émissions Vidéo" 
            desc="Retrouvez nos conférences et débats en direct sur notre chaîne YouTube intégrée." 
            icon={Youtube} 
            to="/youtube"
            color="bg-yellow-50"
            iconColor="text-iqra-gold"
          />
          <PageCard 
            title="Nos Podcasts" 
            desc="Redécouvrez nos émissions religieuses à tout moment." 
            icon={Mic2} 
            to="/podcasts"
            color="bg-white"
            iconColor="text-iqra-green"
          />
          <PageCard 
            title="Conseils & Fatwas" 
            desc="L'Islam au quotidien pour éclairer votre chemin." 
            icon={MessageSquare} 
            to="/conseils"
            color="bg-white"
            iconColor="text-iqra-green"
          />
          <PageCard 
            title="Fraternité" 
            desc="Éducation spirituelle et paix sociale." 
            icon={ChevronRight} 
            to="/a-propos"
            color="bg-white"
            iconColor="text-iqra-green"
          />
          <PageCard 
            title="Contactez-nous" 
            desc="Restez en contact avec notre équipe dévouée." 
            icon={MessageSquare} 
            to="/contact"
            color="bg-white"
            iconColor="text-iqra-green"
          />
        </div>
      </section>

      {/* Latest Content Sections */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Latest Podcast */}
        {latestPodcast && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-xs font-bold text-iqra-gold uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-4 bg-iqra-gold rounded-full"></span>
              Dernier Podcast
            </h2>
            <div className="flex gap-6 items-start">
              <div className="w-24 h-24 bg-iqra-green/5 rounded-2xl flex items-center justify-center text-iqra-green flex-shrink-0">
                <Mic2 size={40} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gray-400 uppercase">
                  <span>{latestPodcast.category || latestPodcast.catégorie}</span>
                  <span>•</span>
                  <span>{new Date(latestPodcast.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-iqra-green mb-4 line-clamp-2">{latestPodcast.title || latestPodcast.titre}</h3>
                <button 
                  onClick={() => window.open(latestPodcast.audio_url, '_blank')}
                  className="px-6 py-2 bg-iqra-green text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-iqra-green/90 transition-all flex items-center gap-2"
                >
                  <Play size={12} fill="currentColor" /> Écouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Latest Article */}
        {latestArticle && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-xs font-bold text-iqra-gold uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-4 bg-iqra-gold rounded-full"></span>
              Dernier Conseil
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                <span className="text-iqra-gold">{latestArticle.category || latestArticle.catégorie || 'Conseil'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(latestArticle.date || latestArticle.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-iqra-green line-clamp-2">{latestArticle.title || latestArticle.titre}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{latestArticle.description || latestArticle.content}</p>
              <Link 
                to="/conseils"
                className="inline-flex items-center gap-2 text-xs font-bold text-iqra-gold uppercase tracking-widest hover:underline"
              >
                Lire l'article <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* About Section (Partial) */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="dashed-card p-10 md:p-16 relative overflow-hidden">
            <h2 className="text-lg font-bold text-iqra-green mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-iqra-gold rounded-full"></span>
              À Propos de Nous
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-serif mb-8">
              "RADIO IQRA TV – La Voix de saint Coran Basée au cœur du Burkina Faso, 
              RADIO IQRA TV est une station islamique dédiée à la diffusion des enseignements authentiques de l'Islam, 
              dans un esprit de paix, de fraternité et d'éducation spirituelle..."
            </p>
            <Link 
              to="/a-propos" 
              className="text-sm font-bold text-iqra-gold hover:underline flex items-center gap-2 group"
            >
              Lire la suite complète <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PageCard({ title, desc, icon: Icon, to, color, iconColor }: any) {
  return (
    <Link to={to} className="group">
      <div className={`${color} p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-xl hover:border-iqra-gold transition-all h-full`}>
        <div className={`w-14 h-14 ${iconColor === 'text-iqra-gold' ? 'bg-yellow-100' : 'bg-green-100'} rounded-xl flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}>
          <Icon size={28} />
        </div>
        <div>
          <h3 className="font-bold text-xl text-iqra-green mb-2">{title}</h3>
          <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
