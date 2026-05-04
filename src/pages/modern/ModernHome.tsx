import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { supabase } from '../../lib/supabase';

export default function ModernHome() {
  const { config } = useSiteConfig();
  const [latestPodcast, setLatestPodcast] = useState<any>(null);
  const [latestArticle, setLatestArticle] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) return;
      
      try {
        const { data: podcasts } = await supabase
          .from('podcasts')
          .select('*')
          .order('date', { ascending: false })
          .limit(1);
        
        if (podcasts && podcasts.length > 0) {
          setLatestPodcast(podcasts[0]);
        }

        const { data: articles } = await supabase
          .from('articles')
          .select('*')
          .order('date', { ascending: false })
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
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-modern-bg-dark/60 via-modern-bg-dark/80 to-modern-bg-dark z-10"></div>
            <img alt="Mosque" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4dPH0Jd8gyaz8MladXQ3_UfvlUkV7-OQXeVuKVw-OGs5UgpMcZt-7L4-CrCI3CirwDa3oP46ETxCnJkvKhunD2hvAgQo1HkCbLu6VI62tgcbwxooBi8p6Riff_IyNdqIgzLfrupkv0OI-3mHuD4LNeNsAXX2Ms8hwFxc2S12x_J18ykqSTmrYib4dtZGfuD26-tgz0kFlg_wo2t5-SDGqgOmQd6fP9-xv49205GMXGNGkd4YvkYGyFzQVZYXkqh69DiWa76mLSu0"/>
            </div>
            <div className="relative z-20 text-center max-w-4xl mx-auto mt-8">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-modern-primary/20 border border-modern-primary/30 text-modern-gold text-xs font-bold tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-modern-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-modern-gold"></span>
                </span>
                La Voix de la Sagesse
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{config?.site_name || "Radio Iqra FM"}</h2>
            <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Basée au cœur du Burkina Faso, une station islamique dédiée à la diffusion des enseignements authentiques de l'Islam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/listen-live" className="bg-modern-gold hover:bg-modern-gold/90 text-modern-bg-dark px-8 py-3 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                  <span className="material-symbols-outlined text-xl fill-1">play_arrow</span>
                  Écouter en Direct
                </Link>
                <Link to="/a-propos" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold text-base border border-white/20 transition-all hover:scale-105 active:scale-95">
                  À Propos
                </Link>
            </div>
        </div>
      </section>

      {/* Pages Navigation */}
      <section className="py-12 px-4 bg-modern-bg-light/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
              <h2 className="text-3xl font-black text-white">Nos <span className="text-modern-gold">Rubriques</span></h2>
              <div className="h-1.5 w-24 bg-modern-primary mt-2 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { path: "/coran", title: "Bibliothèque Coranique", icon: "menu_book", desc: "Récitations par les plus grands imams" },
                { path: "/youtube", title: "Émissions Vidéo", icon: "smart_display", desc: "Conférences et débats en direct" },
                { path: "/podcasts", title: "Nos Podcasts", icon: "podcasts", desc: "Redécouvrez nos émissions" },
                { path: "/conseils", title: "Conseils & Fatwas", icon: "forum", desc: "L'Islam au quotidien pour éclairer votre chemin" }
              ].map((item, i) => (
                <Link key={i} to={item.path} className="group bg-modern-neutral-dark rounded-2xl overflow-hidden gold-gradient-border shadow-xl transform transition-all hover:-translate-y-2 p-5 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-modern-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl text-modern-gold">{item.icon}</span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-modern-gold transition-colors">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Latest Content Sections */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Latest Podcast */}
          {latestPodcast && (
            <div className="bg-modern-primary/5 rounded-3xl p-6 border border-modern-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-7xl">podcasts</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-modern-gold font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">mic</span> Dernier Podcast
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-modern-primary uppercase tracking-wider mb-2">
                    <span>{latestPodcast.category || latestPodcast.catégorie}</span>
                    <span>•</span>
                    <span>{new Date(latestPodcast.date).toLocaleDateString()}</span>
                </div>
                <h4 className="text-xl font-black text-white mb-4 line-clamp-2">{latestPodcast.title || latestPodcast.titre}</h4>
                <button 
                  onClick={() => window.open(latestPodcast.audio_url, '_blank')}
                  className="bg-modern-gold hover:bg-modern-gold/90 text-modern-bg-dark px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 w-max transition-all hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined">play_arrow</span> Écouter
                </button>
              </div>
            </div>
          )}

          {/* Latest Article */}
          {latestArticle && (
            <div className="bg-modern-primary/5 rounded-3xl p-6 border border-modern-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-7xl">article</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-modern-gold font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">edit_document</span> Dernier Conseil
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-modern-primary uppercase tracking-wider mb-2">
                    <span>{latestArticle.category || latestArticle.catégorie || 'Conseil'}</span>
                    <span>•</span>
                    <span>{new Date(latestArticle.date || latestArticle.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <h4 className="text-xl font-black text-white mb-3 line-clamp-2">{latestArticle.title || latestArticle.titre}</h4>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{latestArticle.description || latestArticle.content}</p>
                <Link 
                  to="/conseils"
                  className="text-modern-gold font-bold hover:underline flex items-center gap-2"
                >
                  Lire l'article <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* About Description */}
      <section className="py-12 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-black text-white mb-6">À Propos de <span className="text-modern-gold">{config?.site_name || "Iqra FM"}</span></h2>
            <p className="text-base text-slate-300 leading-relaxed font-serif italic mb-6">
              "{config?.site_name || "Iqra FM"} – La Voix du Saint Coran. Basée au cœur du Burkina Faso, 
              notre station islamique est dédiée à la diffusion des enseignements authentiques de l'Islam, 
              dans un esprit de paix, de fraternité et d'éducation spirituelle."
            </p>
            <Link 
              to="/a-propos" 
              className="inline-flex items-center gap-2 text-modern-gold font-bold uppercase tracking-widest hover:underline"
            >
              En savoir plus <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
        </div>
      </section>

    </main>
  );
}
