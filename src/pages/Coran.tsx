import { BookOpen, Play, Search, Pause, RotateCcw, Volume2, X } from "lucide-react";
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
    return <div className="min-h-screen pt-28 flex justify-center"><div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gold-500/10 text-gold-400 mb-6">
          <BookOpen size={40} />
        </div>
        <h1 className="text-4xl lg:text-6xl font-cairo font-bold text-white mb-4">Le Noble Coran</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Lumiere et guidance pour l'humanite, meditez la parole de votre Seigneur.</p>

        <div className="mt-10 max-w-lg mx-auto relative">
          <input
            type="text"
            placeholder="N° ou nom de la sourate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-14 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-400" size={20} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {surahs.length === 0 ? (
        <EmptyListPage title="Coran en chargement" subtitle="Il n'y a pas encore de sourates." icon={BookOpen} category="Verset" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSurahs.map((surah, idx) => (
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ y: -4 }}
              onClick={() => openSurah(surah)}
              className="glass-card rounded-xl p-5 cursor-pointer group hover:border-emerald-500/30 transition-all duration-500"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center font-bold text-lg font-cairo group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-all">
                  {surah.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white leading-tight">{surah.englishNameTranslation}</h3>
                  <p className="text-gray-500 font-serif text-base text-right" dir="rtl">{surah.name}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Volume2 size={10} className="text-gold-400" />
                  {surah.numberOfAyahs} versets • {surah.revelationType === "Meccan" ? "Mecquoise" : "Medinoise"}
                </span>
                <span className="text-gold-400 group-hover:translate-x-1 transition-transform text-xs">Voir →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredSurahs.length === 0 && surahs.length > 0 && (
        <div className="text-center py-16 glass-card rounded-2xl mt-8">
          <Search size={32} className="text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Aucune sourate ne correspond a "{searchQuery}".</p>
          <button onClick={() => setSearchQuery("")} className="mt-4 text-gold-400 font-bold uppercase tracking-wider text-sm hover:underline">Voir tout</button>
        </div>
      )}

      <AnimatePresence>
        {selectedSurah && (
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
              className="bg-night-800 w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-white/5"
            >
              {loadingSurah ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-emerald-900/20 to-night-800 p-6 lg:p-8 border-b border-white/5 relative">
                    <button onClick={() => { setSelectedSurah(null); setIsPlaying(false); }} className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10">
                      <X size={22} />
                    </button>
                    <div className="flex items-end gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center text-2xl font-cairo font-bold">
                        {selectedSurah.number}
                      </div>
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-cairo font-bold text-white">{selectedSurah.englishNameTranslation}</h2>
                        <p className="text-xl text-gold-400 font-serif" dir="rtl">{selectedSurah.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:bg-emerald-500 transition-all">
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" fill="currentColor" />}
                      </button>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Recitation Audio</p>
                        <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gold-500 transition-all" style={{ width: progress + "%" }} />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setIsLooping(!isLooping)} className={"flex items-center gap-2 px-4 py-2 rounded-xl transition-all border text-sm " + (isLooping ? "bg-gold-500/10 border-gold-500/20 text-gold-400" : "bg-white/5 border-white/5 text-gray-400")}>
                      <RotateCcw size={16} className={isLooping ? "animate-spin" : ""} />
                      Repeter
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto p-6 lg:p-10 space-y-8">
                    {selectedSurah.ayahs.map((ayah, idx) => (
                      <button key={ayah.numberInSurah} onClick={() => playAyahAudio(idx)}
                        className={"group/ayah block w-full text-right px-5 py-3 rounded-xl transition-all hover:bg-gold-500/5 " + (currentAyahIndex === idx && isPlaying ? "bg-gold-500/10 border border-gold-500/20" : "")} dir="rtl">
                        <div className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center text-xs font-bold group-hover/ayah:bg-gold-500/20 group-hover/ayah:text-gold-400 transition-all mt-1">
                            {ayah.numberInSurah}
                          </span>
                          <p className="text-white font-serif text-2xl lg:text-3xl leading-[2] flex-grow">{ayah.arabic}</p>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mt-3 text-left italic" dir="ltr">{ayah.french}</p>
                      </button>
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
