import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronRight, Users, Radio, BookOpen, Youtube, Mic2, MessageSquare, Headphones, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { supabase } from '../../lib/supabase';
import MediaSlider from '../../components/premium/MediaSlider';
import PrayerTimes from '../../components/premium/PrayerTimes';
import IslamicQuote from '../../components/premium/IslamicQuote';
import DonationSection from '../../components/premium/DonationSection';

const categories = [
  { title: 'Bibliothèque Coranique', desc: 'Récitations des plus grands imams', icon: BookOpen, path: '/coran', color: 'from-emerald-600/20 to-emerald-800/10' },
  { title: 'Émissions Vidéo', desc: 'Conférences et débats en direct', icon: Youtube, path: '/youtube', color: 'from-red-600/20 to-red-800/10' },
  { title: 'Nos Podcasts', desc: 'Redécouvrez nos émissions', icon: Mic2, path: '/podcasts', color: 'from-purple-600/20 to-purple-800/10' },
  { title: 'Conseils & Fatwas', desc: 'L\'Islam au quotidien', icon: MessageSquare, path: '/conseils', color: 'from-gold-600/20 to-gold-800/10' },
];

export default function PremiumHome() {
  const { config } = useSiteConfig();
  const [latestPodcasts, setLatestPodcasts] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [listeners, setListeners] = useState(1284);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) return;

      try {
        const { data: podcasts } = await supabase
          .from('podcasts')
          .select('*')
          .order('date', { ascending: false })
          .limit(10);
        if (podcasts) setLatestPodcasts(podcasts);
      } catch (err) {
        console.error('Error loading podcasts:', err);
      }

      try {
        const { data: articles } = await supabase
          .from('articles')
          .select('*')
          .order('date', { ascending: false })
          .limit(10);
        if (articles) setLatestArticles(articles);
      } catch (err) {
        console.error('Error loading articles:', err);
      }
    }
    fetchData();

    const interval = setInterval(() => {
      setListeners(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const podcastItems = latestPodcasts.map((p) => ({
    id: p.id,
    title: p.title || p.titre || 'Podcast',
    subtitle: p.category || p.catégorie || '',
    badge: 'Podcast',
    link: '/podcasts',
    type: 'audio' as const,
  }));

  const articleItems = latestArticles.map((a) => ({
    id: a.id,
    title: a.title || a.titre || 'Article',
    subtitle: new Date(a.date || Date.now()).toLocaleDateString('fr-FR'),
    badge: 'Conseil',
    link: '/conseils',
  }));

  return (
    <main>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-night-900 via-emerald-900/20 to-night-900 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(22,163,74,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.08),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 w-full pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              En Direct — {listeners.toLocaleString()} auditeurs
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-cairo font-black text-white leading-[1.1] mb-6">
              La Voix du
              <span className="block text-gradient-gold">Saint Coran</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl mb-10">
              Basée au cœur du Burkina Faso, {config.site_name} diffuse les enseignements authentiques de l'Islam dans un esprit de paix et de fraternité.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/listen-live"
                className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-sm transition-all duration-300 flex items-center gap-3 shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/50"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-2">
                  <Play size={18} fill="currentColor" />
                  Écouter en Direct
                </span>
              </Link>
              <Link
                to="/a-propos"
                className="px-8 py-4 glass-light text-white font-medium rounded-full text-sm transition-all duration-300 flex items-center gap-2 hover:bg-white/10"
              >
                Découvrir
                <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl"
          >
            {[
              { label: 'Auditeurs', value: listeners.toLocaleString(), icon: Headphones },
              { label: 'Podcasts', value: latestPodcasts.length.toString(), icon: Mic2 },
              { label: 'Articles', value: latestArticles.length.toString(), icon: MessageSquare },
              { label: '24/7', value: '24h/24', icon: Radio },
            ].map((stat, i) => (
              <div key={i} className="glass-light rounded-xl p-4 text-center">
                <stat.icon size={18} className="mx-auto mb-2 text-gold-400" />
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night-900 to-transparent z-10" />
      </section>

      <div className="max-w-7xl mx-auto -mt-20 relative z-20 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-8">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={cat.path}
              className="group glass-card rounded-xl p-5 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon size={20} className="text-white" />
              </div>
              <h3 className="text-sm font-cairo font-bold text-white mb-1">{cat.title}</h3>
              <p className="text-xs text-gray-400">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {podcastItems.length > 0 && (
        <div className="mb-12">
          <MediaSlider title="Derniers Podcasts" items={podcastItems} viewAllLink="/podcasts" />
        </div>
      )}

      <PrayerTimes />

      <IslamicQuote />

      {articleItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gold-500 rounded-full" />
              <h2 className="text-xl lg:text-2xl font-cairo font-bold text-white">Derniers Conseils</h2>
            </div>
            <Link to="/conseils" className="text-sm text-gold-500 hover:text-gold-400 font-medium flex items-center gap-1">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestArticles.slice(0, 6).map((article) => (
              <Link
                key={article.id}
                to="/conseils"
                className="glass-card rounded-xl p-5 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="text-gold-500 font-semibold">{article.category || 'Conseil'}</span>
                  <span>•</span>
                  <span>{new Date(article.date || Date.now()).toLocaleDateString('fr-FR')}</span>
                </div>
                <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-gold-400 transition-colors">
                  {article.title || article.titre}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {article.description || article.content}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <DonationSection />

      <section className="px-4 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="glass-card rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-cairo font-bold text-white mb-4">
            À Propos de <span className="text-gold-500">{config.site_name}</span>
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            "{config.site_name} — La Voix du Saint Coran. Basée au cœur du Burkina Faso, notre station islamique est dédiée à la diffusion des enseignements authentiques de l'Islam, dans un esprit de paix, de fraternité et d'éducation spirituelle."
          </p>
          <Link
            to="/a-propos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 border border-gold-500/20 text-gold-400 font-semibold rounded-full text-sm hover:bg-gold-500/20 transition-all duration-300"
          >
            En savoir plus <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
