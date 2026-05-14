import { MessageSquare, Calendar, ChevronRight, User, X, Clock, Share2 } from "lucide-react";
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
    return <div className="min-h-screen pt-28 flex justify-center"><div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <p className="text-red-400 font-bold mb-2">Erreur : {errorMsg}</p>
        <p className="text-gray-500 text-sm">Vérifiez les politiques RLS de votre table articles.</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return <EmptyListPage title="Conseils & Fatwas" subtitle="Une encyclopedie de conseils religieux pour eclairer votre quotidien." icon={MessageSquare} category="Conseil" />;
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gold-500/10 text-gold-400 mb-6">
            <MessageSquare size={40} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-cairo font-bold text-white mb-4">Conseils & Fatwas</h1>
          <p className="text-gray-400">L'Islam au quotidien pour eclairer votre chemin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-emerald-500/30 transition-all duration-500"
              onClick={() => setSelectedArticle(article)}
            >
              {article.image_url && (
                <div className="h-56 overflow-hidden relative">
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 glass-light px-3 py-1 rounded-full text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                    {article.category || "Conseil"}
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(article.date || (article as any).created_at || Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {Math.ceil((article.content?.length || 0) / 1000) || 1} min
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-gold-400 transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">{(article as any).description || article.content}</p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
                      <User size={12} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{article.author || "Rédaction"}</span>
                  </div>
                  <span className="text-gold-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lire <ChevronRight size={12} />
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-night-900/95 backdrop-blur-2xl p-4 lg:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-night-800 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-white/5"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto flex-grow">
                <div className="relative h-[40vh] md:h-[50vh] w-full">
                  {selectedArticle.image_url ? (
                    <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900/30 to-night-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-night-800 via-night-800/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="bg-gold-500/10 text-gold-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase border border-gold-500/20">
                        {selectedArticle.category || "Conseil"}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 bg-night-900/60 px-3 py-1.5 rounded-full">
                        <Calendar size={12} />
                        {new Date(selectedArticle.date || Date.now()).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-cairo font-bold text-white leading-tight max-w-3xl">
                      {selectedArticle.title}
                    </h2>
                  </div>
                </div>

                <div className="px-8 lg:px-16 pb-16">
                  <div className="flex items-center justify-between py-6 border-b border-white/5 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Auteur</p>
                        <p className="text-sm font-bold text-white">{selectedArticle.author || "Rédaction"}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors px-3 py-2 rounded-xl bg-gold-500/5 border border-gold-500/10">
                      <Share2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Partager</span>
                    </button>
                  </div>

                  <div className="text-gray-300 leading-[1.8] text-base whitespace-pre-wrap">
                    {selectedArticle.content}
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-sm italic">
                      "Certes, dans le rappel il y a une guerison pour les poitrines."
                    </p>
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="mt-6 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all"
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
