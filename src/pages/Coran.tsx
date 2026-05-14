import { BookOpen, Play, Search, Pause, RotateCcw, Volume2, X, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import EmptyListPage from "../components/EmptyListPage";
import { motion, AnimatePresence } from "motion/react";

interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  numberInSurah: number;
  arabic: string;
  french: string;
}

interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  ayahs: Ayah[];
}

export default function Coran() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function loadSurahs() {
      try {
        const res = await fetch("/quran/surahs.json");
        setSurahs(await res.json());
      } catch (err) {
        console.error("Error loading surahs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSurahs();
  }, []);

  const openSurah = async (surah: SurahMeta) => {
    setLoadingSurah(true);
    setIsPlaying(false);
    setProgress(0);
    setCurrentAyahIndex(0);
    try {
      const res = await fetch("/quran/surah_" + surah.number + ".json");
      setSelectedSurah(await res.json());
    } catch (err) {
      console.error("Error loading surah detail:", err);
    } finally {
      setLoadingSurah(false);
    }
  };

  const filteredSurahs = surahs.filter(s =>
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString().includes(searchQuery) ||
    s.name.includes(searchQuery)
  );

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
    }
  };

  const playAyahAudio = (index: number) => {
    if (!selectedSurah) return;
    setCurrentAyahIndex(index);
    const s = String(selectedSurah.number).padStart(3, "0");
    const a = String(index + 1).padStart(3, "0");
    if (audioRef.current) {
      audioRef.current.src = "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/" + s + a + ".mp3";
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-night">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gold font-black uppercase tracking-widest text-xs">Chargement du Coran...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 max-w-7xl mx-auto bg-night">
      {/* Header Coran */}
      <div className="text-center mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-primary/20 text-gold mb-8 gold-glow"
        >
          <BookOpen size={48} />
        </motion.div>
        <h1 className="text-5xl lg:text-7xl font-cairo font-black text-white mb-6 tracking-tighter">
          Le Noble <span className="text-gold italic">Coran</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
          Lumière et guidance pour l'humanité, méditez la parole de votre Seigneur à travers ces 114 sourates.
        </p>

        <div className="mt-12 max-w-2xl mx-auto relative group">
          <input
            type="text"
            placeholder="Rechercher une sourate (N° ou nom)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass rounded-[24px] py-6 px-16 text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-all text-lg shadow-2xl"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={24} />
          <AnimatePresence>
            {searchQuery && (
              <motion.button 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={() => setSearchQuery("")} 
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {surahs.length === 0 ? (
        <EmptyListPage title="Coran en chargement" subtitle="Il n'y a pas encore de sourates." icon={BookOpen} category="Verset" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSurahs.map((surah, idx) => (
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              whileHover={{ y: -8 }}
              onClick={() => openSurah(surah)}
              className="glass-card rounded-[32px] p-6 cursor-pointer group border-white/5 hover:border-gold/30"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-black text-xl font-cairo text-gold gold-glow transition-all group-hover:scale-110">
                  {surah.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight line-clamp-1">{surah.englishNameTranslation}</h3>
                  <p className="text-gray-500 font-serif text-xl mt-1 text-right" dir="rtl">{surah.name}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                  <Sparkles size={12} />
                  {surah.numberOfAyahs} VERSETS
                </div>
                <span className="text-gold font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Lire →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredSurahs.length === 0 && surahs.length > 0 && (
        <div className="text-center py-24 glass-card rounded-[40px] mt-8">
          <Search size={48} className="text-gray-600 mx-auto mb-6" />
          <p className="text-xl text-gray-400 font-medium mb-6">Aucune sourate ne correspond à "{searchQuery}".</p>
          <button onClick={() => setSearchQuery("")} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-gold font-black uppercase tracking-widest text-xs rounded-2xl transition-all">Voir tout</button>
        </div>
      )}

      {/* Modal de Lecture Premium */}
      <AnimatePresence>
        {selectedSurah && (
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
              className="bg-night-light w-full max-w-6xl h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative border border-white/10"
            >
              {loadingSurah ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-gold font-black text-xs tracking-widest uppercase">Ouverture de la sourate...</p>
                </div>
              ) : (
                <>
                  {/* Header Modal */}
                  <div className="bg-gradient-to-r from-primary/20 to-transparent p-8 lg:p-12 border-b border-white/5 relative">
                    <button 
                      onClick={() => { setSelectedSurah(null); setIsPlaying(false); }} 
                      className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all z-10"
                    >
                      <X size={24} />
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      <div className="w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center text-3xl font-cairo font-black text-gold gold-glow">
                        {selectedSurah.number}
                      </div>
                      <div>
                        <h2 className="text-4xl lg:text-5xl font-cairo font-black text-white tracking-tighter uppercase mb-2">
                          {selectedSurah.englishNameTranslation}
                        </h2>
                        <div className="flex items-center gap-4">
                           <p className="text-2xl text-gold font-serif" dir="rtl">{selectedSurah.name}</p>
                           <span className="w-1 h-1 rounded-full bg-white/20" />
                           <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">{selectedSurah.ayahs.length} VERSETS</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Player Bar */}
                  <div className="px-8 lg:px-12 py-6 glass border-b border-white/5 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={togglePlay} 
                        className="w-16 h-16 rounded-full bg-gold text-night flex items-center justify-center shadow-2xl hover:scale-105 transition-all"
                      >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
                      </button>
                      <div className="min-w-[200px]">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">RECITAION : CHEIKH AS-SUDAIS</p>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <motion.div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: progress + "%" }} 
                            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsLooping(!isLooping)} 
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all border text-xs font-black uppercase tracking-widest ${
                        isLooping ? "bg-gold/10 border-gold/30 text-gold" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <RotateCcw size={16} className={isLooping ? "animate-spin" : ""} />
                      {isLooping ? 'EN BOUCLE' : 'REPETER'}
                    </button>
                  </div>

                  {/* Ayahs List */}
                  <div className="flex-grow overflow-y-auto p-8 lg:p-12 space-y-12 no-scrollbar">
                    {selectedSurah.ayahs.map((ayah, idx) => (
                      <motion.button 
                        key={ayah.numberInSurah} 
                        onClick={() => playAyahAudio(idx)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`group/ayah block w-full text-right p-8 rounded-[32px] transition-all hover:bg-white/5 border border-transparent ${
                          currentAyahIndex === idx && isPlaying ? "bg-primary/20 border-gold/20" : ""
                        }`} 
                        dir="rtl"
                      >
                        <div className="flex items-start gap-8">
                          <span className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                            currentAyahIndex === idx && isPlaying ? "bg-gold text-night" : "bg-white/5 text-gray-500 group-hover/ayah:bg-gold/20 group-hover/ayah:text-gold"
                          }`}>
                            {ayah.numberInSurah}
                          </span>
                          <p className="text-white font-serif text-3xl lg:text-5xl leading-[1.8] flex-grow">{ayah.arabic}</p>
                        </div>
                        <div className="mt-8 flex items-start gap-4">
                           <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                           <p className="text-gray-400 text-lg leading-relaxed text-left italic font-medium" dir="ltr">{ayah.french}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
              <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => { if (!isLooping) { setIsPlaying(false); setProgress(0); } else if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); } }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

