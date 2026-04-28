import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Play, Pause, ArrowLeft, ArrowRight, Save, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuranData, useLearningProgress, SurahDetail, Reciter } from '../hooks/useQuranData';

type LearningMode = 'reading' | 'memorization';

export default function LearningProgram() {
  const [user, setUser] = useState<any>(null);
  const [surahs, setSurahs] = useState<Array<{number: number, name_ar: string, name_fr: string}>>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [mode, setMode] = useState<LearningMode>('reading');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showSurahSelect, setShowSurahSelect] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordElementsRef = useRef<{[key: string]: HTMLElement}>({});

  const { reciters, fetchSurah, getVerseAudioUrl, getWordAudioUrl } = useQuranData();
  const { progress, getProgress, saveProgress } = useLearningProgress(user?.id);

  useEffect(() => {
    checkUser();
    fetchSurahList();
  }, []);

  useEffect(() => {
    if (reciters.length > 0 && !selectedReciter) {
      setSelectedReciter(reciters[0]);
    }
  }, [reciters]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchSurahList = async () => {
    const { data } = await supabase.from('sourates').select('number, name_ar, name_fr').order('number');
    if (data) setSurahs(data);
  };

  const handleSelectSurah = async (surahNumber: number) => {
    setLoading(true);
    const surah = await fetchSurah(surahNumber);
    if (surah) {
      setSelectedSurah(surah);
      setShowSurahSelect(false);
      setShowModeSelect(true);
      if (user) {
        const prog = getProgress(surahNumber, mode);
        setResumeData(prog);
      }
    }
    setLoading(false);
  };

  const startLearning = () => {
    if (!selectedSurah) return;
    setShowModeSelect(false);
    if (resumeData && resumeData.verses_completed > 0) {
      setCurrentVerse(resumeData.verse_number);
      setCurrentWord(resumeData.word_position);
    } else {
      setCurrentVerse(0);
      setCurrentWord(0);
    }
  };

  const playWordAudio = useCallback(async (surahNum: number, verseNum: number, wordPos: number) => {
    if (!selectedReciter) return;
    const url = getWordAudioUrl(surahNum, verseNum, wordPos);
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
      if (mode === 'reading' && selectedSurah) {
        const ayah = selectedSurah.ayahs[currentVerse];
        if (wordPos < (ayah?.words?.length || 0) - 1) {
          setCurrentWord(wordPos + 1);
          playWordAudio(surahNum, verseNum, wordPos + 1);
        }
      }
    };
  }, [selectedReciter, selectedSurah, mode, currentVerse, getWordAudioUrl]);

  const playVerseAudio = useCallback(async (surahNum: number, verseNum: number) => {
    if (!selectedReciter) return;
    const url = getVerseAudioUrl(selectedReciter, surahNum, verseNum);
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
  }, [selectedReciter, getVerseAudioUrl]);

  const saveCurrentProgress = async () => {
    if (!selectedSurah || !user) return;
    setSaving(true);
    await saveProgress(
      selectedSurah.number,
      currentVerse,
      currentWord,
      mode,
      selectedSurah.ayahs.length,
      currentVerse
    );
    setSaving(false);
  };

  const goBackToSurahSelect = () => {
    setShowModeSelect(false);
    setShowSurahSelect(true);
  };

  const goBackToModeSelect = () => {
    setShowModeSelect(true);
  };

  if (showSurahSelect) {
    const surahItems = surahs.map((surah, idx) => {
      const progReading = user ? getProgress(surah.number, 'reading') : null;
      const progMem = user ? getProgress(surah.number, 'memorization') : null;
      const prog = progReading || progMem;
      const isCompleted = prog && prog.completion_percentage > 0;
      
      return (
        <motion.div
          key={surah.number}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03 }}
          onClick={() => handleSelectSurah(surah.number)}
          className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50 hover:border-iqra-gold/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          {isCompleted && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
              <CheckCircle size={12} />
              {Math.round(prog.completion_percentage)}%
            </div>
          )}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-iqra-green/5 text-iqra-green rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-iqra-gold group-hover:text-iqra-green transition-colors font-serif">
              {surah.number}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-iqra-green">{surah.name_fr}</h3>
              <p className="text-gray-400 font-serif text-lg text-right" dir="rtl">{surah.name_ar}</p>
            </div>
          </div>
        </motion.div>
      );
    });

    return (
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-iqra-gold/10 text-iqra-gold rounded-[2rem] mb-8">
            <BookOpen size={48} />
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-iqra-green mb-6">Programme d'Apprentissage</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">Choisissez une sourate</p>
        </div>
        {loading ? (
          <div className="text-center py-20">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {surahItems}
          </div>
        )}
      </div>
    );
  }

  if (showModeSelect && selectedSurah) {
    const modeClassReading = mode === 'reading' ? 'border-iqra-gold bg-iqra-gold/5' : 'border-gray-100';
    const modeClassMem = mode === 'memorization' ? 'border-iqra-gold bg-iqra-gold/5' : 'border-gray-100';
    const hasResume = resumeData && resumeData.completion_percentage > 0;

    return (
      <div className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <button onClick={goBackToSurahSelect} className="mb-8 flex items-center gap-2 text-iqra-green hover:text-iqra-gold transition-colors">
          <ArrowLeft size={20} /> Retour
        </button>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-iqra-green mb-4">{selectedSurah.name_fr}</h1>
          <p className="text-2xl font-serif text-iqra-gold" dir="rtl">{selectedSurah.name_ar}</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-iqra-green mb-6">Mode d'apprentissage</h2>
          <div className="space-y-4">
            <div onClick={() => setMode('reading')} className={"p-6 rounded-2xl border-2 cursor-pointer transition-all " + modeClassReading}>
              <h3 className="text-xl font-bold text-iqra-green mb-2">Lecture</h3>
              <p className="text-gray-600">Lecture mot par mot avec audio</p>
            </div>
            <div onClick={() => setMode('memorization')} className={"p-6 rounded-2xl border-2 cursor-pointer transition-all " + modeClassMem}>
              <h3 className="text-xl font-bold text-iqra-green mb-2">Mémorisation</h3>
              <p className="text-gray-600">Répétition et mémorisation</p>
            </div>
          </div>
          {hasResume && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
              <Clock className="text-blue-500" size={20} />
              <div>
                <p className="font-bold text-blue-700">Progression sauvegardée</p>
                <p className="text-sm text-blue-600">Verset {resumeData.verse_number + 1} ({Math.round(resumeData.completion_percentage)}%)</p>
              </div>
            </div>
          )}
          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-600 mb-2">Récitateur</label>
            <select value={selectedReciter?.id || ''} onChange={(e) => {
              const rec = reciters.find(r => r.id === Number(e.target.value));
              if (rec) setSelectedReciter(rec);
            }} className="w-full p-3 border border-gray-200 rounded-xl">
              {reciters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <button onClick={startLearning} className="mt-8 w-full bg-iqra-green text-white py-4 rounded-xl font-bold text-lg hover:bg-iqra-green/90">
            {hasResume ? 'Reprendre' : 'Commencer'}
          </button>
        </div>
      </div>
    );
  }

  if (!selectedSurah) return null;

  const currentAyah = selectedSurah.ayahs[currentVerse];
  const progressPercentage = ((currentVerse / selectedSurah.ayahs.length) * 100).toFixed(1);
  const isPrevDisabled = currentVerse === 0 && currentWord === 0;

  return (
    <div className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={goBackToModeSelect} className="flex items-center gap-2 text-iqra-green hover:text-iqra-gold transition-colors">
          <ArrowLeft size={20} /> Retour
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-iqra-green">{selectedSurah.name_fr}</h2>
          <p className="text-sm text-gray-500">Verset {currentVerse + 1}/{selectedSurah.ayahs.length}</p>
        </div>
        <button onClick={saveCurrentProgress} disabled={saving} className="flex items-center gap-2 bg-iqra-gold/10 text-iqra-gold px-4 py-2 rounded-xl disabled:opacity-50">
          <Save size={18} /> {saving ? '...' : 'Sauvegarder'}
        </button>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-iqra-gold transition-all duration-300" style={{ width: progressPercentage + '%' }} />
      </div>
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-8">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 mb-4">Verset {currentVerse + 1}</p>
          <div className="text-3xl md:text-5xl leading-loose text-right font-serif text-iqra-green" dir="rtl">
            {currentAyah?.words?.map((word: string, idx: number) => {
              const isActive = idx === currentWord;
              return (
                <span
                  key={idx}
                  ref={(el: HTMLElement | null) => { if (el) wordElementsRef.current[`${currentVerse}-${idx}`] = el; }}
                  onClick={() => playWordAudio(selectedSurah.number, currentAyah.numberInSurah, idx + 1)}
                  className={"inline cursor-pointer hover:text-iqra-gold transition-colors px-1 py-1 rounded " + (isActive ? "bg-iqra-gold/20 text-iqra-gold" : "")}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => {
            if (currentWord > 0) setCurrentWord(currentWord - 1);
            else if (currentVerse > 0) {
              setCurrentVerse(currentVerse - 1);
              setCurrentWord(selectedSurah.ayahs[currentVerse - 1]?.words?.length || 0);
            }
          }} disabled={isPrevDisabled} className="w-14 h-14 bg-gray-100 text-iqra-green rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-50">
            <ArrowLeft size={24} />
          </button>
          <button onClick={() => playVerseAudio(selectedSurah.number, currentAyah.numberInSurah)} className="w-20 h-20 bg-iqra-green text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105">
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          <button onClick={() => {
            if (currentWord < (currentAyah?.words?.length || 0) - 1) setCurrentWord(currentWord + 1);
            else if (currentVerse < selectedSurah.ayahs.length - 1) {
              setCurrentVerse(currentVerse + 1);
              setCurrentWord(0);
            }
          }} className="w-14 h-14 bg-gray-100 text-iqra-green rounded-full flex items-center justify-center hover:bg-gray-200">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {selectedSurah.ayahs.map((_, idx) => {
          const isCurrent = idx === currentVerse;
          const isCompleted = idx < currentVerse;
          let btnClass = "w-10 h-10 rounded-lg font-bold text-sm transition-colors ";
          if (isCurrent) btnClass += "bg-iqra-gold text-white";
          else if (isCompleted) btnClass += "bg-green-100 text-green-700";
          else btnClass += "bg-gray-100 text-gray-400";
          return (
            <button key={idx} onClick={() => { setCurrentVerse(idx); setCurrentWord(0); }} className={btnClass}>
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
