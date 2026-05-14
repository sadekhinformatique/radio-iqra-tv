import { MessageSquare, Calendar, ChevronRight, User, X, Clock, Share2, Sparkles, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import EmptyListPage from "../components/EmptyListPage";
import { motion, AnimatePresence } from "motion/react";

interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  image_url?: string;
  category?: string;
  author?: string;
}

export default function Conseils() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      if (!supabase) { setLoading(false); return; }
      try {
        const { data, error } = await supabase.from("articles").select("*");
        if (error) { setErrorMsg(error.message); throw error; }
        const sorted = (data || []).sort((a: any, b: any) => {
          const dA = a.created_at || a.date || a.id;
          const dB = b.created_at || b.date || b.id;
          return dB > dA ? 1 : -1;
        });
        setArticles(sorted);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedArticle]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-night">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gold font-black uppercase tracking-widest text-xs">Chargement des articles...</p>
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

  if (articles.length === 0) {
    return <EmptyListPage title="Conseils & Fatwas" subtitle="Une encyclopédie de conseils religieux pour éclairer votre quotidien." icon={MessageSquare} category="Conseil" />;
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
            <BookOpen size={48} />
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-cairo font-black text-white mb-6 tracking-tighter uppercase">
            Articles & <span className="text-gold italic">Conseils</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            Une encyclopédie de conseils religieux et fatwas pour éclairer votre chemin au quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-[48px] overflow-hidden group cursor-pointer border-white/5 hover:border-gold/30 transition-all duration-700 shadow-2xl"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="h-72 lg:h-96 overflow-hidden relative">
                {article.image_url ? (
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-night" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
                <div className="absolute top-6 right-6 glass-light px-4 py-2 rounded-full text-[10px] font-black text-gold uppercase tracking-[0.2em]">
                  {article.category || "Conseil"}
                </div>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-gold" />
                    {new Date(article.date || (article as any).created_at || Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-400" />
                    {Math.ceil((article.content?.length || 0) / 1000) || 1} MIN
                  </span>
                </div>
                <h3 className="text-3xl font-black text-white leading-tight group-hover:text-gold transition-colors mb-4 uppercase tracking-tighter line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-lg line-clamp-2 font-medium">{(article as any).description || article.content}</p>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-emerald-400 flex items-center justify-center border border-white/5 group-hover:bg-primary/20 transition-all">
                      <User size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{article.author || "Rédaction"}</span>
                  </div>
                  <span className="text-gold text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                    Lire l'article <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-night/95 backdrop-blur-3xl p-4 lg:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-night-light w-full max-w-5xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative border border-white/10"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 rounded-2xl bg-night/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto flex-grow no-scrollbar">
                <div className="relative h-[50vh] md:h-[60vh] w-full">
                  {selectedArticle.image_url ? (
                    <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-night" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-night-light via-night/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10 lg:p-16 w-full">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="bg-primary/20 text-gold text-[10px] font-black px-4 py-2 rounded-full uppercase border border-gold/20 tracking-widest gold-glow">
                        {selectedArticle.category || "Conseil"}
                      </span>
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 bg-night/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <Calendar size={14} className="text-gold" />
                        {new Date(selectedArticle.date || Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-cairo font-black text-white leading-tight tracking-tighter uppercase max-w-4xl">
                      {selectedArticle.title}
                    </h2>
                  </div>
                </div>

                <div className="px-10 lg:px-20 pb-20">
                  <div className="flex items-center justify-between py-10 border-b border-white/5 mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 text-emerald-400 flex items-center justify-center border border-white/10">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Auteur de l'article</p>
                        <p className="text-lg font-black text-white uppercase tracking-tight">{selectedArticle.author || "Rédaction Radio Iqra"}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-3 text-gold hover:text-white transition-all px-6 py-3 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-[10px]">
                      <Share2 size={18} />
                      Partager
                    </button>
                  </div>

                  <div className="text-gray-300 leading-[2] text-xl font-medium whitespace-pre-wrap">
                    {selectedArticle.content}
                  </div>

                  <div className="mt-20 pt-12 border-t border-white/5 text-center relative overflow-hidden rounded-[32px] p-10 bg-white/5">
                    <Sparkles className="text-gold/20 absolute -top-8 -left-8 w-24 h-24" />
                    <p className="text-cream text-xl italic font-medium max-w-2xl mx-auto mb-10">
                      "Certes, dans le rappel il y a une guérison pour les poitrines."
                    </p>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="px-12 py-5 bg-gold text-night font-black uppercase tracking-widest text-xs rounded-full gold-glow hover:scale-105 transition-all"
                    >
                      Retour aux articles
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

