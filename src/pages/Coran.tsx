import { BookOpen, Play, Search, Pause, RotateCcw, Volume2, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
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

const AUDIO_BASE_URL = "https://sadekhinformatique.site/coran-audio";

function getSurahAudioPath(surahNumber: number): string {
  const n = String(surahNumber).padStart(3, "0");
  return `${AUDIO_BASE_URL}/Coran-Arabe-Sourate-${n}.mp3`;
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
  const [audioMode, setAudioMode] = useState<"surah" | "ayah">("surah");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const surahContentRef = useRef<HTMLDivElement | null>(null);
  const ayahRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    async function loadSurahs() {
      try {
        const res = await fetch("/quran/surahs.json");
        const data = await res.json();
        setSurahs(data);
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
    ayahRefs.current = [];
    try {
      const res = await fetch(`/quran/surah_${surah.number}.json`);
      const data = await res.json();
      setSelectedSurah(data);
    } catch (err) {
      console.error("Error loading surah detail:", err);
    } finally {
      setLoadingSurah(false);
    }
  };

  const closeSurah = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setSelectedSurah(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentAyahIndex(0);
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString().includes(searchQuery) ||
    s.name.includes(searchQuery)
  );

  const playSurahAudio = useCallback(() => {
    if (!selectedSurah || !audioRef.current) return;
    audioRef.current.src = getSurahAudioPath(selectedSurah.number);
    audioRef.current.play();
    setIsPlaying(true);
    setAudioMode("surah");
  }, [selectedSurah]);

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
    if (audioRef.current && selectedSurah) {
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

  const playAyahAudio = (index: number) => {
    if (!selectedSurah) return;
    setCurrentAyahIndex(index);
    setAudioMode("ayah");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = getSurahAudioPath(selectedSurah.number);
      audioRef.current.play();
      setIsPlaying(true);
    }

    const ayahElement = ayahRefs.current[index];
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-iqra-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-iqra-gold/10 text-iqra-gold rounded-[1.5rem] mb-6 shadow-inner shadow-iqra-gold/5 animate-pulse">
          <BookOpen size={32} />
        </div>
        <h1 className="text-2xl md:text-5xl font-serif font-bold text-iqra-green mb-4 tracking-tight">Le Noble Coran</h1>
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
              key={surah.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => openSurah(surah)}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50 hover:border-iqra-gold/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-iqra-gold/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-iqra-green/5 text-iqra-green rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-iqra-gold group-hover:text-iqra-green transition-colors font-serif shadow-inner">
                  {surah.number}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-iqra-green leading-tight">{surah.englishNameTranslation}</h3>
                  <p className="text-gray-400 font-serif text-lg text-right" dir="rtl">{surah.name}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">
                <span className="flex items-center gap-2">
                  <Volume2 size={12} className="text-iqra-gold" />
                  {surah.numberOfAyahs} versets • {surah.revelationType === "Meccan" ? "Mecquoise" : "Médinoise"}
                </span>
                <span className="text-iqra-gold group-hover:translate-x-2 transition-transform">Voir le texte →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              className="bg-white w-full max-w-4xl h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative"
            >
              {loadingSurah ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-iqra-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="bg-iqra-gold/10 p-8 border-b border-iqra-gold/10 relative">
                    <button 
                      onClick={closeSurah}
                      className="absolute top-6 right-6 w-12 h-12 bg-white text-iqra-green rounded-2xl shadow-lg flex items-center justify-center hover:scale-110 transition-all z-10 p-0"
                    >
                      <X size={24} />
                    </button>

                    <div className="flex items-end gap-6">
                      <div className="w-20 h-20 bg-white text-iqra-gold rounded-3xl flex items-center justify-center text-3xl font-serif font-bold shadow-xl">
                        {selectedSurah.number}
                      </div>
                      <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-iqra-green mb-1">{selectedSurah.englishNameTranslation}</h2>
                        <p className="text-xl md:text-3xl text-iqra-gold font-serif" dir="rtl">{selectedSurah.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 py-4 bg-gray-50 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={togglePlay}
                        className="w-16 h-16 bg-iqra-green text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                      >
                        {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" fill="currentColor" />}
                      </button>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">
                          {audioMode === "surah" ? "Récitation complète" : `Verset ${currentAyahIndex + 1}`}
                        </p>
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-iqra-gold" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setAudioMode("surah");
                          playSurahAudio();
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                          audioMode === "surah" ? "bg-iqra-green text-white border-iqra-green" : "bg-white border-gray-100 text-gray-400 hover:border-iqra-gold"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Volume2 size={14} />
                          Sourate
                        </span>
                      </button>
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

                  <div ref={surahContentRef} className="flex-grow overflow-y-auto p-8 md:p-12 space-y-12">
                    <div className="text-center">
                      {selectedSurah.number !== 9 && (
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-10">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                      )}
                      
                      <div className="mb-16 space-y-8">
                        {selectedSurah.ayahs.map((ayah, idx) => (
                          <button
                            key={ayah.numberInSurah}
                            ref={(el) => { ayahRefs.current[idx] = el; }}
                            onClick={() => playAyahAudio(idx)}
                            className={`group/ayah block w-full text-right px-6 py-4 rounded-2xl transition-all hover:bg-iqra-gold/5 ${
                              currentAyahIndex === idx && isPlaying && audioMode === "ayah" ? "bg-iqra-gold/10 border border-iqra-gold/30" : "border border-transparent"
                            }`}
                            dir="rtl"
                          >
                            <div className="flex items-start gap-4">
                              <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors mt-2 ${
                                currentAyahIndex === idx && isPlaying && audioMode === "ayah"
                                  ? "bg-iqra-gold text-iqra-green"
                                  : "bg-iqra-green/10 text-iqra-green group-hover/ayah:bg-iqra-gold group-hover/ayah:text-iqra-green"
                              }`}>
                                {ayah.numberInSurah}
                              </span>
                              <p className="text-gray-900 font-serif text-3xl md:text-4xl leading-[2.2] md:leading-[2.2] flex-grow">
                                {ayah.arabic}
                              </p>
                            </div>
                            <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-4 text-left italic" dir="ltr">
                              {ayah.french}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-center py-12 border-t border-gray-50 text-gray-400 text-sm font-medium">
                      Sourate {selectedSurah.englishNameTranslation} • N° {selectedSurah.number} • {selectedSurah.ayahs.length} versets
                    </div>
                  </div>
                </>
              )}

              <audio 
                ref={audioRef} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onError={() => {
                  setIsPlaying(false);
                }}
              />
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
