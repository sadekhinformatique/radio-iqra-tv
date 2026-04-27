import { BookOpen, Play, Search, Pause, RotateCcw, Volume2, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import EmptyListPage from "../components/EmptyListPage";
import { motion, AnimatePresence } from "motion/react";

interface Surah {
  id: string;
  number: number;
  name_ar: string;
  name_fr: string;
  text_ar: string;
  translation_fr: string;
  audio_url: string;
}

export default function Coran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchSurahs() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('sourates')
          .select('*')
          .order('number', { ascending: true });

        if (error) {
          setErrorMsg(error.message);
          throw error;
        }
        setSurahs(data || []);
      } catch (err) {
        console.error("Error fetching surahs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString().includes(searchQuery)
  );

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  };

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
        <p className="text-gray-500 text-sm">Vérifiez les politiques RLS de votre table "sourates".</p>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-iqra-gold/10 text-iqra-gold rounded-[2rem] mb-8 shadow-inner shadow-iqra-gold/5 animate-pulse">
          <BookOpen size={48} />
        </div>
        <h1 className="text-4xl md:text-7xl font-serif font-bold text-iqra-green mb-6 tracking-tight">Le Noble Coran</h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">Lumière et guidance pour l'humanité, méditez la parole de votre Seigneur.</p>
        
        <div className="mt-12 max-w-lg mx-auto relative px-4">
          <input 
            type="text" 
            placeholder="N° ou nom de la sourate..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl py-5 px-14 shadow-2xl focus:outline-none focus:ring-4 focus:ring-iqra-gold/20 transition-all font-medium text-iqra-green placeholder:text-gray-300"
          />
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-iqra-gold" size={24} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 hover:text-iqra-green transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {surahs.length === 0 ? (
        <EmptyListPage 
          title="Coran en cours de chargement"
          subtitle="Il n'y a pas encore de sourates dans la base de données."
          icon={BookOpen}
          category="Verset"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSurahs.map((surah, idx) => (
            <motion.div 
              key={surah.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => {
                setSelectedSurah(surah);
                setIsPlaying(false);
                setProgress(0);
              }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50 hover:border-iqra-gold/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-iqra-gold/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-iqra-green/5 text-iqra-green rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-iqra-gold group-hover:text-iqra-green transition-colors font-serif shadow-inner">
                  {surah.number}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-iqra-green leading-tight">{surah.name_fr}</h3>
                  <p className="text-gray-400 font-serif text-lg text-right" dir="rtl">{surah.name_ar}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">
                <span className="flex items-center gap-2">
                  <Volume2 size={12} className="text-iqra-gold" />
                  Récitation
                </span>
                <span className="text-iqra-gold group-hover:translate-x-2 transition-transform">Voir le texte →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedSurah && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-iqra-green/95 backdrop-blur-2xl p-4 sm:p-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Header */}
              <div className="bg-iqra-gold/10 p-8 border-b border-iqra-gold/10 relative">
                <button 
                  onClick={() => {
                    setSelectedSurah(null);
                    setIsPlaying(false);
                  }}
                  className="absolute top-6 right-6 w-12 h-12 bg-white text-iqra-green rounded-2xl shadow-lg flex items-center justify-center hover:scale-110 transition-all z-10 p-0"
                >
                  <X size={24} />
                </button>

                <div className="flex items-end gap-6">
                  <div className="w-20 h-20 bg-white text-iqra-gold rounded-3xl flex items-center justify-center text-3xl font-serif font-bold shadow-xl">
                    {selectedSurah.number}
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-iqra-green mb-1">{selectedSurah.name_fr}</h2>
                    <p className="text-xl md:text-3xl text-iqra-gold font-serif" dir="rtl">{selectedSurah.name_ar}</p>
                  </div>
                </div>
              </div>

              {/* Interaction Bar / Player */}
              <div className="px-8 py-4 bg-gray-50 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay}
                    disabled={!selectedSurah.audio_url}
                    className="w-16 h-16 bg-iqra-green text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" fill="currentColor" />}
                  </button>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">Récitation Audio</p>
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-iqra-gold" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsLooping(!isLooping)}
                    className={`p-3 rounded-xl flex items-center gap-2 transition-all border ${
                      isLooping ? "bg-iqra-gold/20 border-iqra-gold text-iqra-green" : "bg-white border-gray-100 text-gray-400"
                    }`}
                  >
                    <RotateCcw size={18} className={isLooping ? "animate-spin" : ""} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Répéter</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-12">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-10">Bismillah Er-Rahman Er-Rahim</p>
                  
                  {/* Arabic Text */}
                  <div className="mb-16">
                    <p className="text-gray-900 font-serif text-3xl md:text-5xl leading-[2.5] md:leading-[2.5] text-center" dir="rtl">
                      {selectedSurah.text_ar}
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="max-w-3xl mx-auto p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative">
                    <BookOpen className="absolute -top-6 left-1/2 -translate-x-1/2 text-iqra-gold w-12 h-12 bg-white rounded-full p-2" />
                    <p className="text-gray-600 font-sans text-lg md:text-xl leading-relaxed italic">
                      "{selectedSurah.translation_fr || selectedSurah.text_fr}"
                    </p>
                  </div>
                </div>

                {/* Info Card */}
                <div className="text-center py-12 border-t border-gray-50 text-gray-400 text-sm font-medium">
                  Sourate {selectedSurah.name_fr} • N° {selectedSurah.number}
                </div>
              </div>

              {/* Hideable Audio Element */}
              {selectedSurah.audio_url && (
                <audio 
                  ref={audioRef} 
                  src={selectedSurah.audio_url} 
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  onError={() => {
                    setErrorMsg("Le fichier audio n'a pas pu être chargé.");
                    setIsPlaying(false);
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredSurahs.length === 0 && surahs.length > 0 && (
        <div className="text-center py-20 px-4 bg-white rounded-[3rem] shadow-inner mt-10">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium text-xl">Aucune sourate ne correspond à "{searchQuery}".</p>
          <button onClick={() => setSearchQuery("")} className="mt-6 text-iqra-gold font-bold uppercase tracking-widest text-sm hover:underline">Voir tout le Coran</button>
        </div>
      )}
    </div>
  );
}
