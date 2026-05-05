import { BookOpen, Play, Search, Pause, ArrowLeft, ArrowRight, X, CheckCircle, Eye, Share2, Download } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toPng } from "html-to-image";

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
  numberOfRevelation?: number;
  ayahs: Ayah[];
}

const EVERYAYAH_AUDIO_BASE = "https://everyayah.com/data/Alafasy_128kbps";

function getVerseAudioUrl(surahNumber: number, verseNumber: number): string {
  const surah = String(surahNumber).padStart(3, "0");
  const verse = String(verseNumber).padStart(3, "0");
  return `${EVERYAYAH_AUDIO_BASE}/${surah}${verse}.mp3`;
}

export default function Coran() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "meccan" | "medinan">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [readSurahs, setReadSurahs] = useState<Set<number>>(new Set());
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [audioError, setAudioError] = useState(false);
  const [shareAyah, setShareAyah] = useState<{ surah: SurahDetail; ayah: Ayah; index: number } | null>(null);
  const [shareDownloading, setShareDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const surahContentRef = useRef<HTMLDivElement | null>(null);
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shareCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("quran_read_surahs");
    if (stored) {
      try {
        setReadSurahs(new Set(JSON.parse(stored)));
      } catch {}
    }
  }, []);

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

  const markSurahAsRead = useCallback((surahNumber: number) => {
    setReadSurahs(prev => {
      const next = new Set(prev);
      next.add(surahNumber);
      localStorage.setItem("quran_read_surahs", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setReadSurahs(new Set());
    localStorage.removeItem("quran_read_surahs");
  }, []);

  const openSurah = async (surah: SurahMeta) => {
    setLoadingSurah(true);
    setIsPlaying(false);
    setProgress(0);
    setCurrentAyahIndex(-1);
    setAudioError(false);
    ayahRefs.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    try {
      const res = await fetch(`/quran/surah_${surah.number}.json`);
      const data = await res.json();
      setSelectedSurah(data);
      markSurahAsRead(surah.number);
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
    setCurrentAyahIndex(-1);
  }, []);

  const playAyahAudio = useCallback((index: number) => {
    if (!selectedSurah || !audioRef.current) return;
    const ayah = selectedSurah.ayahs[index];
    if (!ayah) return;
    
    setCurrentAyahIndex(index);
    setAudioError(false);
    
    audioRef.current.src = getVerseAudioUrl(selectedSurah.number, ayah.numberInSurah);
    audioRef.current.play().catch(() => setAudioError(true));
    setIsPlaying(true);
    
    const ayahElement = ayahRefs.current[index];
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedSurah]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src && selectedSurah) {
        playAyahAudio(0);
        return;
      }
      audioRef.current.play().catch(() => setAudioError(true));
      setIsPlaying(true);
    }
  }, [isPlaying, selectedSurah, playAyahAudio]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = useCallback(() => {
    if (selectedSurah && currentAyahIndex < selectedSurah.ayahs.length - 1) {
      playAyahAudio(currentAyahIndex + 1);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [selectedSurah, currentAyahIndex, playAyahAudio]);

  const playPreviousAyah = useCallback(() => {
    if (currentAyahIndex > 0) {
      playAyahAudio(currentAyahIndex - 1);
    }
  }, [currentAyahIndex, playAyahAudio]);

  const playNextAyah = useCallback(() => {
    if (selectedSurah && currentAyahIndex < selectedSurah.ayahs.length - 1) {
      playAyahAudio(currentAyahIndex + 1);
    }
  }, [selectedSurah, currentAyahIndex, playAyahAudio]);

  const goNextSurah = useCallback(() => {
    if (!selectedSurah) return;
    const nextIdx = surahs.findIndex(s => s.number === selectedSurah.number + 1);
    if (nextIdx !== -1) {
      openSurah(surahs[nextIdx]);
    }
  }, [selectedSurah, surahs]);

  const goPrevSurah = useCallback(() => {
    if (!selectedSurah) return;
    const prevIdx = surahs.findIndex(s => s.number === selectedSurah.number - 1);
    if (prevIdx !== -1) {
      openSurah(surahs[prevIdx]);
    }
  }, [selectedSurah, surahs]);

  const filteredSurahs = surahs.filter(s => {
    const matchesSearch = 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString().includes(searchQuery) ||
      s.name.includes(searchQuery);
    
    const matchesFilter = 
      filterType === "all" ||
      (filterType === "meccan" && s.revelationType === "Meccan") ||
      (filterType === "medinan" && s.revelationType === "Medinan");
    
    const matchesRead = 
      !showUnreadOnly || !readSurahs.has(s.number);
    
    return matchesSearch && matchesFilter && matchesRead;
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const downloadShareImage = async () => {
    if (!shareCardRef.current) return;
    setShareDownloading(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#064e3b",
      });
      const link = document.createElement("a");
      link.download = `verset-${shareAyah!.surah.number}-${shareAyah!.ayah.numberInSurah}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setShareDownloading(false);
    }
  };

  const shareViaClipboard = async () => {
    if (!shareAyah) return;
    const text = `"${shareAyah.ayah.french}"\n— ${shareAyah.surah.englishNameTranslation}, Verset ${shareAyah.ayah.numberInSurah}\n\nradio-iqra.tv`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      console.error("Failed to copy text");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <p className="text-2xl mb-4" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Lire et écouter <span className="text-amber-400 italic">le Coran</span></h1>
            <p className="text-emerald-200 max-w-2xl mx-auto text-sm md:text-base">Texte arabe, traduction française de Muhammad Hamidullah, audio par Mishary Rashid Alafasy — accessible sans compte.</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <input 
              type="text" 
              placeholder="Rechercher une sourate..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-12 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" size={20} />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Surah List */}
          <div className="lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
              {/* Filters */}
              <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen size={18} className="text-emerald-600" />
                    Les 114 sourates
                  </h2>
                  <span className="text-xs text-gray-400">{readSurahs.size} / 114 lues</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(readSurahs.size / 114) * 100}%` }}
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex gap-2">
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as "all" | "meccan" | "medinan")}
                    className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Toutes</option>
                    <option value="meccan">Mecquoises</option>
                    <option value="medinan">Médinoises</option>
                  </select>
                  <button
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`text-xs px-3 py-2 rounded-lg border transition-all flex items-center gap-1 ${
                      showUnreadOnly 
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                  >
                    <Eye size={14} />
                    Non lues
                  </button>
                  {readSurahs.size > 0 && (
                    <button
                      onClick={resetProgress}
                      className="text-xs px-3 py-2 rounded-lg border bg-gray-50 border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300 transition-all"
                      title="Recommencer"
                    >
                      ↺
                    </button>
                  )}
                </div>
              </div>

              {/* Surah List */}
              <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
                {filteredSurahs.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    Aucune sourate ne correspond à votre recherche.
                  </div>
                ) : (
                  filteredSurahs.map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => openSurah(surah)}
                      className={`w-full flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-emerald-50 transition-all text-left ${
                        selectedSurah?.number === surah.number ? "bg-emerald-50 border-l-4 border-l-emerald-500" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                        {readSurahs.has(surah.number) ? (
                          <CheckCircle size={16} className="text-emerald-500" />
                        ) : (
                          surah.number
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">{surah.englishNameTranslation}</h3>
                          <span className="text-sm font-serif text-gray-600 ml-2" dir="rtl">{surah.name}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{surah.numberOfAyahs} versets • {surah.revelationType === "Meccan" ? "Mecquoise" : "Médinoise"}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Surah Detail */}
          <div className="flex-1 min-w-0">
            {loadingSurah ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">Chargement des versets...</p>
                </div>
              </div>
            ) : selectedSurah ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Surah Header */}
                <div className="p-6 md:p-8 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
                          {selectedSurah.number}
                        </span>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedSurah.englishNameTranslation}</h2>
                          <p className="text-lg text-emerald-600 font-serif" dir="rtl">{selectedSurah.name}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedSurah.ayahs.length} versets •{" "}
                        {surahs.find(s => s.number === selectedSurah.number)?.revelationType === "Meccan" ? "Mecquoise" : "Médinoise"}
                      </p>
                    </div>
                    <button 
                      onClick={closeSurah}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-all lg:hidden"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={goPrevSurah}
                      disabled={selectedSurah.number === 1}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ArrowLeft size={16} />
                      {selectedSurah.number > 1 && surahs.find(s => s.number === selectedSurah.number - 1)?.englishNameTranslation}
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={goNextSurah}
                      disabled={selectedSurah.number === 114}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      {selectedSurah.number < 114 && surahs.find(s => s.number === selectedSurah.number + 1)?.englishNameTranslation}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Bismillah */}
                {selectedSurah.number !== 9 && (
                  <div className="text-center py-6 border-b border-gray-50">
                    <p className="text-2xl md:text-3xl text-gray-700" dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                  </div>
                )}

                {/* Verses */}
                <div ref={surahContentRef} className="p-6 md:p-8 space-y-8">
                  {selectedSurah.ayahs.map((ayah, idx) => (
                    <div
                      key={ayah.numberInSurah}
                      ref={(el) => { ayahRefs.current[idx] = el; }}
                      className={`group rounded-2xl p-4 md:p-6 transition-all cursor-pointer relative ${
                        currentAyahIndex === idx && isPlaying
                          ? "bg-amber-50 border border-amber-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => playAyahAudio(idx)}
                    >
                      {/* Share Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareAyah({ surah: selectedSurah, ayah, index: idx });
                        }}
                        className="absolute top-3 right-3 p-2 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-50 hover:text-emerald-600"
                        title="Partager ce verset"
                      >
                        <Share2 size={16} />
                      </button>

                      {/* Arabic Text */}
                      <div className="flex items-start gap-4 mb-4">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                          currentAyahIndex === idx && isPlaying
                            ? "bg-amber-400 text-white"
                            : "bg-emerald-100 text-emerald-700 group-hover:bg-amber-100 group-hover:text-amber-700"
                        }`}>
                          {ayah.numberInSurah}
                        </span>
                        <p 
                          className="text-gray-900 font-serif text-2xl md:text-3xl leading-[2] md:leading-[2.2] flex-1" 
                          dir="rtl"
                        >
                          {ayah.arabic}
                        </p>
                      </div>
                      
                      {/* French Translation */}
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed pl-14 italic">
                        {ayah.french}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer Navigation */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                  <button
                    onClick={goPrevSurah}
                    disabled={selectedSurah.number === 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft size={16} />
                    {selectedSurah.number > 1 && surahs.find(s => s.number === selectedSurah.number - 1)?.englishNameTranslation}
                  </button>
                  <span className="text-xs text-gray-400">
                    Sourate {selectedSurah.number} / 114
                  </span>
                  <button
                    onClick={goNextSurah}
                    disabled={selectedSurah.number === 114}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {selectedSurah.number < 114 && surahs.find(s => s.number === selectedSurah.number + 1)?.englishNameTranslation}
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Audio Player */}
                {selectedSurah.ayahs.length > 0 && (
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={playPreviousAyah}
                        disabled={currentAyahIndex <= 0}
                        className="w-10 h-10 bg-gray-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      
                      <button 
                        onClick={togglePlay}
                        className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" fill="currentColor" />}
                      </button>
                      
                      <button 
                        onClick={playNextAyah}
                        disabled={currentAyahIndex >= selectedSurah.ayahs.length - 1}
                        className="w-10 h-10 bg-gray-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowRight size={18} />
                      </button>

                      {/* Progress Bar */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-mono">
                            {currentAyahIndex >= 0 ? `V. ${currentAyahIndex + 1}` : ""}
                          </span>
                          <div 
                            className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                            onClick={(e) => {
                              if (audioRef.current && audioRef.current.duration) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const pct = (e.clientX - rect.left) / rect.width;
                                audioRef.current.currentTime = pct * audioRef.current.duration;
                              }
                            }}
                          >
                            <div 
                              className="h-full bg-amber-500 rounded-full transition-all" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            {audioRef.current?.duration ? formatTime(audioRef.current.currentTime || 0) : "0:00"}
                          </span>
                        </div>
                      </div>

                      {/* Speed indicator */}
                      <span className="text-xs text-gray-400">1x</span>
                    </div>
                    
                    {audioError && (
                      <p className="text-xs text-red-500 mt-2">Erreur de chargement audio. Veuillez réessayer.</p>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              /* Welcome State */
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={36} className="text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Choisissez une sourate</h2>
                  <p className="text-gray-500 text-sm">Sélectionnez une sourate dans la liste à gauche pour commencer la lecture et l'écoute.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => {
          setIsPlaying(false);
          setAudioError(true);
        }}
      />

      {/* Share Modal */}
      <AnimatePresence>
        {shareAyah && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShareAyah(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-gray-800">Partager ce verset</h3>
                <button
                  onClick={() => setShareAyah(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1">
                <div className="p-5">
                  {/* Responsive Preview Card */}
                  <div className="w-full aspect-square rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 flex flex-col items-center justify-center p-6 sm:p-8 md:p-10">
                      {/* Decorative corners */}
                      <div className="absolute top-3 left-3 w-10 h-10 sm:w-14 sm:h-14 border-2 border-amber-400/30 rounded-full" />
                      <div className="absolute bottom-3 right-3 w-10 h-10 sm:w-14 sm:h-14 border-2 border-amber-400/30 rounded-full" />
                      <div className="absolute top-5 right-5 w-6 h-6 sm:w-8 sm:h-8 border border-amber-400/20 rounded-full" />
                      <div className="absolute bottom-5 left-5 w-6 h-6 sm:w-8 sm:h-8 border border-amber-400/20 rounded-full" />

                      {/* Content */}
                      <div className="flex flex-col items-center justify-center flex-1 w-full gap-3 sm:gap-4 md:gap-5">
                        {/* Surah badge */}
                        <div className="bg-amber-400/15 border border-amber-400/30 rounded-full px-4 sm:px-6 py-1.5 sm:py-2">
                          <span className="text-amber-400 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider">
                            {shareAyah.surah.englishNameTranslation.toUpperCase()} — V. {shareAyah.ayah.numberInSurah}
                          </span>
                        </div>

                        {/* Arabic text */}
                        <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.8] md:leading-[2] text-center px-2 sm:px-4" dir="rtl" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
                          {shareAyah.ayah.arabic}
                        </p>

                        {/* Divider */}
                        <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                        {/* French translation */}
                        <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed text-center px-4 sm:px-6 italic">
                          {shareAyah.ayah.french}
                        </p>
                      </div>

                      {/* Footer branding */}
                      <div className="flex flex-col items-center gap-1 mt-auto pt-2 sm:pt-3">
                        <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                        <span className="text-amber-400 text-sm sm:text-base md:text-lg font-extrabold tracking-[0.2em] sm:tracking-[0.3em]">RADIO IQRA TV</span>
                        <span className="text-white/40 text-[10px] sm:text-xs tracking-wider">radio-iqra.tv</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 space-y-3">
                    <button
                      onClick={downloadShareImage}
                      disabled={shareDownloading}
                      className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {shareDownloading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Download size={18} />
                          Télécharger l'image
                        </>
                      )}
                    </button>
                    <button
                      onClick={shareViaClipboard}
                      className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 size={18} />
                      Copier le texte
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden card for high-res download */}
      <div className="fixed -left-[9999px] -top-[9999px]" aria-hidden="true">
        <div ref={shareCardRef} style={{ width: 1080, height: 1080, background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)", position: "relative", fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
          <div style={{ position: "absolute", top: 40, left: 40, width: 80, height: 80, border: "3px solid rgba(212,175,55,0.3)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: 40, right: 40, width: 80, height: 80, border: "3px solid rgba(212,175,55,0.3)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: 60, right: 60, width: 40, height: 40, border: "2px solid rgba(212,175,55,0.2)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: 60, left: 60, width: 40, height: 40, border: "2px solid rgba(212,175,55,0.2)", borderRadius: "50%" }} />

          <div style={{ position: "absolute", inset: 100, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 50, padding: "12px 32px", marginBottom: 40 }}>
              <span style={{ color: "#d4af37", fontSize: 28, fontWeight: 600, letterSpacing: 2 }}>
                {shareAyah?.surah.englishNameTranslation.toUpperCase()} — Verset {shareAyah?.ayah.numberInSurah}
              </span>
            </div>

            <p style={{ color: "#ffffff", fontSize: 52, lineHeight: 1.6, textAlign: "center", direction: "rtl", padding: "0 60px", marginBottom: 48, maxWidth: 900 }}>
              {shareAyah?.ayah.arabic}
            </p>

            <div style={{ width: 120, height: 2, background: "linear-gradient(90deg, transparent, #d4af37, transparent)", marginBottom: 40 }} />

            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 30, lineHeight: 1.7, textAlign: "center", fontStyle: "italic", padding: "0 80px", maxWidth: 850 }}>
              {shareAyah?.ayah.french}
            </p>
          </div>

          <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: 80, height: 3, background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }} />
            <span style={{ color: "#d4af37", fontSize: 32, fontWeight: 800, letterSpacing: 4 }}>RADIO IQRA TV</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 20, letterSpacing: 1 }}>radio-iqra.tv</span>
          </div>
        </div>
      </div>
    </div>
  );
}
