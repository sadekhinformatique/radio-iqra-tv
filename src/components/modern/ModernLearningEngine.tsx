import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Settings,
  Award,
  BarChart3,
  ChevronDown,
  Volume2,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLearningEngine, useBadgeSystem } from '../../hooks/useLearningEngine';
import type { LearningMode, Reciter, Surah } from '../../types/learning';
import QuranDisplay from '../learning/QuranDisplay';
import LearningControls from '../learning/LearningControls';
import AudioController from '../learning/AudioController';
import ModeSelector from '../learning/ModeSelector';
import QuizPanel from '../learning/QuizPanel';
import ProgressDashboard from '../learning/ProgressDashboard';

interface ModernLearningEngineProps {
  surahNumber?: number;
}

export default function ModernLearningEngine({ surahNumber }: ModernLearningEngineProps) {
  const [user, setUser] = useState<any>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [showModeSelector, setShowModeSelector] = useState(!surahNumber);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMode, setSelectedMode] = useState<LearningMode>('progressive-reading');

  const engine = useLearningEngine(user?.id);
  const badges = useBadgeSystem(user?.id);

  // Charger l'utilisateur
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Charger les récitateurs
  useEffect(() => {
    const fetchReciters = async () => {
      const { data } = await supabase
        .from('reciters')
        .select('*')
        .eq('is_active', true);
      if (data) {
        setReciters(data as Reciter[]);
        if (data.length > 0) {
          engine.setSettings({
            ...engine.settings,
            reciter: data[0]
          });
        }
      }
    };
    fetchReciters();
  }, []);

  // Charger la sourate si spécifiée
  useEffect(() => {
    const loadSurah = async () => {
      if (!surahNumber) return;
      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.uthmani`
        );
        const data = await response.json();
        if (data.code === 200) {
          const surah: Surah = {
            number: data.data.number,
            name_ar: data.data.name,
            name_fr: data.data.englishNameTranslation || data.data.englishName,
            ayahs: data.data.ayahs.map((ayah: any) => ({
              number: ayah.number,
              numberInSurah: ayah.numberInSurah,
              text: ayah.text,
              words: ayah.text.split(' ').filter((w: string) => w.trim() !== '')
            }))
          };
          engine.setCurrentSurah(surah);
          engine.startSession(surahNumber, selectedMode);
          setShowModeSelector(false);
        }
      } catch (error) {
        console.error('Error loading surah:', error);
      }
    };
    loadSurah();
  }, [surahNumber, selectedMode]);

  const handleModeSelected = async (mode: LearningMode) => {
    setSelectedMode(mode);
    engine.setSettings({
      ...engine.settings,
      mode
    });
    setShowModeSelector(false);

    if (engine.currentSurah) {
      engine.startSession(engine.currentSurah.number, mode);

      // Obtenir la progression précédente pour cette sourate
      const prog = engine.getProgressForSurah(
        engine.currentSurah.number,
        mode
      );
      if (prog) {
        engine.setCurrentVerse(prog.verse_number);
        engine.setCurrentWord(prog.word_position);
      }
    }
  };

  const handleMarkComplete = async () => {
    if (!engine.currentSurah) return;

    await engine.saveProgress(
      engine.currentSurah.number,
      engine.currentVerse,
      engine.currentWord,
      selectedMode,
      engine.currentSurah.ayahs.length,
      engine.currentSurah.ayahs.length
    );

    // Débloquer badge si applicable
    if (engine.currentSurah.ayahs.length > 10) {
      await badges.addPoints(100, `Completed ${engine.currentSurah.name_fr}`);
    }

    setShowDashboard(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-iqra-navy via-blue-50 to-iqra-gold/5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-iqra-gold/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-iqra-gold/10 rounded-2xl flex items-center justify-center">
              <BookOpen size={28} className="text-iqra-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-iqra-green">
                Programme d'Apprentissage
              </h1>
              {engine.currentSurah && (
                <p className="text-sm text-gray-500">
                  {engine.currentSurah.name_fr} •{' '}
                  {engine.currentVerse + 1}/{engine.currentSurah.ayahs.length}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="p-3 rounded-xl bg-iqra-gold/10 text-iqra-gold hover:bg-iqra-gold/20 transition-all"
              title="Dashboard"
            >
              <BarChart3 size={22} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-xl bg-iqra-green/10 text-iqra-green hover:bg-iqra-green/20 transition-all"
              title="Settings"
            >
              <Settings size={22} />
            </button>
            <button
              onClick={() => setShowQuiz(false)}
              className="p-3 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all"
              title={`Badges: ${badges.badges.length}`}
            >
              <Award size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selector */}
        <AnimatePresence>
          {showModeSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <ModeSelector
                onModeSelected={handleModeSelected}
                currentMode={selectedMode}
                reciters={reciters}
                onReciterChange={(reciter: Reciter) =>
                  engine.setSettings({
                    ...engine.settings,
                    reciter
                  })
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Learning Interface */}
        <AnimatePresence>
          {!showModeSelector && engine.currentSurah && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Quran Display */}
              <div className="lg:col-span-2">
                <QuranDisplay
                  surah={engine.currentSurah}
                  currentVerse={engine.currentVerse}
                  currentWord={engine.currentWord}
                  showTajweed={engine.settings.showTajweed}
                  showTranslation={engine.settings.showTranslation}
                  onVerseClick={(verseIdx: number) =>
                    engine.setCurrentVerse(verseIdx)
                  }
                  onWordClick={(wordIdx: number) =>
                    engine.playWordAudio(
                      engine.currentSurah!.number,
                      engine.currentVerse,
                      wordIdx
                    )
                  }
                />

                {/* Audio and Controls */}
                <div className="mt-6 space-y-4">
                  <AudioController
                    isPlaying={engine.isPlaying}
                    mode={engine.settings.mode}
                    onPlayWord={() =>
                      engine.playWordAudio(
                        engine.currentSurah!.number,
                        engine.currentVerse,
                        engine.currentWord
                      )
                    }
                    onPlayVerse={() =>
                      engine.playVerseAudio(
                        engine.currentSurah!.number,
                        engine.currentVerse
                      )
                    }
                    onStop={engine.stopAudio}
                    reciter={engine.settings.reciter}
                  />

                  <LearningControls
                    currentVerse={engine.currentVerse}
                    totalVerses={engine.currentSurah.ayahs.length}
                    onPrevious={engine.previousVerse}
                    onNext={engine.nextVerse}
                    onMarkComplete={handleMarkComplete}
                    onQuiz={() => setShowQuiz(true)}
                  />
                </div>
              </div>

              {/* Sidebar - Progress & Stats */}
              <div className="space-y-4">
                {/* Progress Card */}
                <motion.div
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-lg font-bold text-iqra-green mb-4">
                    Progression
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Verset</span>
                        <span className="text-sm font-bold text-iqra-gold">
                          {engine.currentVerse + 1}/{engine.currentSurah.ayahs.length}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-iqra-gold to-iqra-green"
                          animate={{
                            width: `${((engine.currentVerse + 1) / engine.currentSurah.ayahs.length) * 100}%`
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Mot</span>
                        <span className="text-sm font-bold text-iqra-gold">
                          {engine.currentWord + 1}/
                          {engine.currentSurah.ayahs[engine.currentVerse]?.words.length || 0}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-400 to-iqra-gold"
                          animate={{
                            width: engine.currentSurah.ayahs[engine.currentVerse]
                              ? `${((engine.currentWord + 1) / engine.currentSurah.ayahs[engine.currentVerse].words.length) * 100}%`
                              : '0%'
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mode Info */}
                <motion.div
                  className="bg-gradient-to-br from-iqra-green/5 to-iqra-gold/5 rounded-3xl p-6 border border-iqra-green/10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-bold text-iqra-green mb-3">
                    Mode Actuel
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold text-iqra-green">Mode: </span>
                      {engine.settings.mode === 'progressive-reading'
                        ? '📖 Lecture Progressive'
                        : engine.settings.mode === 'word-by-word'
                        ? '🔤 Mot par Mot'
                        : engine.settings.mode === 'spaced-repetition'
                        ? '🔄 Répétition Espacée'
                        : engine.settings.mode === 'memorization'
                        ? '💪 Mémorisation'
                        : '📚 Révision'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold text-iqra-green">
                        Récitateur:{' '}
                      </span>
                      {engine.settings.reciter?.name || 'Non sélectionné'}
                    </p>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50 space-y-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Points</span>
                    <span className="text-lg font-bold text-iqra-gold">
                      {badges.points}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Badges</span>
                    <span className="text-lg font-bold text-iqra-green">
                      {badges.badges.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="w-full mt-3 p-3 bg-iqra-gold/10 text-iqra-gold font-semibold rounded-xl hover:bg-iqra-gold/20 transition-all flex items-center justify-center gap-2"
                  >
                    <BarChart3 size={18} />
                    Voir le Dashboard
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz Panel */}
        <AnimatePresence>
          {showQuiz && (
            <QuizPanel
              surahNumber={engine.currentSurah?.number || 0}
              verseNumber={engine.currentVerse}
              onClose={() => setShowQuiz(false)}
              onComplete={(score) => {
                badges.addPoints(score * 10, 'Quiz completed');
                setShowQuiz(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Dashboard */}
        <AnimatePresence>
          {showDashboard && (
            <ProgressDashboard
              userId={user?.id}
              onClose={() => setShowDashboard(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
