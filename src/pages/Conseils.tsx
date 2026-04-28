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
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*');

        if (error) {
          setErrorMsg(error.message);
          throw error;
        }
        
        const sortedData = (data || []).sort((a: any, b: any) => {
          const dateA = a.created_at || a.date || a.id;
          const dateB = b.created_at || b.date || b.id;
          return dateB > dateA ? 1 : -1;
        });

        setArticles(sortedData);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Prevent scroll when article is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedArticle]);

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
        <p className="text-gray-500 text-sm">Vérifiez les politiques RLS de votre table "articles".</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <EmptyListPage 
        title="Conseils & Fatwas"
        subtitle="Une encyclopédie de conseils religieux pour éclairer votre quotidien dans la lumière de l'Islam."
        icon={MessageSquare}
        category="Conseil"
      />
    );
  }

  return (
    <div className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-iqra-gold/10 text-iqra-gold rounded-3xl mb-6">
          <MessageSquare size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-iqra-green mb-4">Conseils & Fatwas</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-medium">L'Islam au quotidien pour éclairer votre chemin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <motion.div 
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col group hover:border-iqra-gold/50 transition-all duration-500 cursor-pointer"
            onClick={() => setSelectedArticle(article)}
          >
            {article.image_url && (
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-iqra-green/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-iqra-green uppercase tracking-widest shadow-sm">
                  {article.category || 'Conseil'}
                </div>
              </div>
            )}
            <div className="p-8 flex flex-col gap-4 flex-grow">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> 
                  {new Date(article.date || (article as any).created_at || Date.now()).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {Math.ceil((article.content?.length || 0) / 1000) || 1} min lecture
                </span>
              </div>
              <h3 className="text-2xl font-bold text-iqra-green group-hover:text-iqra-gold transition-colors line-clamp-2 leading-tight">{article.title}</h3>
              <p className="text-gray-500 leading-relaxed line-clamp-3 text-sm">{(article as any).description || article.content}</p>
              
              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-iqra-green/5 text-iqra-green rounded-full flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{article.author || 'Rédaction'}</span>
                </div>
                <button className="text-iqra-gold font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                  Lire la suite <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modern Article Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-iqra-green/95 backdrop-blur-xl p-4 md:p-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-2xl flex items-center justify-center transition-all group active:scale-95"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="overflow-y-auto overflow-x-hidden flex-grow scrollbar-hide">
                {/* Header Image */}
                <div className="relative h-[40vh] md:h-[50vh] w-full">
                  {selectedArticle.image_url ? (
                    <img 
                      src={selectedArticle.image_url} 
                      alt={selectedArticle.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-iqra-green/10 to-iqra-gold/10 flex items-center justify-center">
                      <span className="text-6xl opacity-20">📖</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="bg-iqra-gold text-iqra-green text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">
                        {selectedArticle.category || 'Conseil'}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                        <Calendar size={12} className="text-iqra-gold" />
                        {new Date(selectedArticle.date || (selectedArticle as any).created_at || Date.now()).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-iqra-green leading-tight max-w-3xl">
                      {selectedArticle.title}
                    </h2>
                  </div>
                </div>

                {/* Content Container */}
                <div className="px-8 md:px-24 pb-20 -mt-2 relative">
                  <div className="flex items-center justify-between py-8 border-b border-gray-100 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-iqra-green/5 text-iqra-green rounded-2xl flex items-center justify-center shadow-inner">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Auteur</p>
                        <p className="text-sm font-bold text-iqra-green">{selectedArticle.author || 'Rédaction Voix de Saint Coran'}</p>
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-2 text-iqra-gold hover:text-iqra-green transition-colors px-4 py-2 rounded-xl bg-iqra-gold/5 border border-iqra-gold/10">
                      <Share2 size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Partager</span>
                    </button>
                  </div>

                  {/* Article Body */}
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-[1.8] text-lg whitespace-pre-wrap font-medium font-sans">
                      {selectedArticle.content}
                    </p>
                  </div>

                  {/* Closing Footer */}
                  <div className="mt-16 pt-10 border-t border-gray-100 text-center">
                    <p className="text-gray-400 text-sm italic font-serif opacity-70">
                      "Certes, dans le rappel (le Coran) il y a une guérison pour les poitrines."
                    </p>
                    <div className="mt-8 flex justify-center">
                      <button 
                        onClick={() => setSelectedArticle(null)}
                        className="bg-iqra-green text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-iqra-gold hover:text-iqra-green transition-all shadow-xl active:scale-95"
                      >
                        Retour aux articles
                      </button>
                    </div>
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
