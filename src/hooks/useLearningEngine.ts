import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type {
  LearningMode,
  LearningSettings,
  LearningProgress,
  Ayah,
  Surah,
  Reciter,
  Quiz,
  LearningSession,
  LearningStats
} from '../types/learning';

/**
 * Hook principal pour gérer le moteur d'apprentissage du Coran
 * Gère la progression, l'audio, les quiz, et la sauvegarde
 */
export function useLearningEngine(userId: string | undefined) {
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [sessionStats, setSessionStats] = useState<LearningSession | null>(null);
  const [settings, setSettings] = useState<LearningSettings>({
    mode: 'progressive-reading',
    reciter: {} as Reciter,
    autoPlayNext: true,
    showTajweed: true,
    showTranslation: true,
    wordDelay: 300,
    verseDelay: 1000,
    repetitionsPerVerse: 3
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionStartTime = useRef<Date | null>(null);
  const versesStudiedRef = useRef(0);

  // Charger la progression depuis Supabase
  const loadProgress = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId);
      if (data) setProgress(data as LearningProgress[]);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }, [userId]);

  // Charger les stats d'apprentissage
  const loadStats = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await supabase
        .from('learning_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      return data as LearningStats;
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [userId]);

  // Obtenir la progression d'une sourate spécifique
  const getProgressForSurah = useCallback(
    (surahNumber: number, mode: LearningMode) => {
      return progress.find(
        (p: LearningProgress) => p.surah_number === surahNumber && p.mode === mode
      ) || null;
    },
    [progress]
  );

  // Sauvegarder la progression
  const saveProgress = useCallback(
    async (
      surahNumber: number,
      verseNumber: number,
      wordPos: number,
      mode: LearningMode,
      totalVerses: number,
      versesDone: number,
      correctAnswers?: number,
      totalQuestions?: number
    ) => {
      if (!userId) return;
      try {
        const completion = totalVerses > 0 ? (versesDone / totalVerses) * 100 : 0;
        const now = new Date().toISOString();

        await supabase.from('learning_progress').upsert({
          user_id: userId,
          surah_number: surahNumber,
          verse_number: verseNumber,
          word_position: wordPos,
          mode,
          completion_percentage: completion,
          total_verses: totalVerses,
          verses_completed: versesDone,
          last_studied: now,
          correct_answers: correctAnswers,
          total_questions: totalQuestions
        });

        await loadProgress();
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    },
    [userId, loadProgress]
  );

  // Démarrer une session d'apprentissage
  const startSession = useCallback(
    (surahNumber: number, mode: LearningMode) => {
      sessionStartTime.current = new Date();
      versesStudiedRef.current = 0;
      setSessionStats({
        id: `session_${Date.now()}`,
        user_id: userId || '',
        surah_number: surahNumber,
        mode,
        start_time: new Date().toISOString(),
        duration: 0,
        verses_studied: 0,
        words_studied: 0,
        accuracy: 0,
        completed: false
      });
    },
    [userId]
  );

  // Sauvegarder la session
  const endSession = useCallback(
    async (accuracy: number = 0) => {
      if (!sessionStartTime.current || !sessionStats) return;

      const durationMs = Date.now() - sessionStartTime.current.getTime();
      const durationMinutes = Math.round(durationMs / 60000);

      try {
        await supabase.from('learning_sessions').insert({
          user_id: userId,
          surah_number: sessionStats.surah_number,
          mode: sessionStats.mode,
          start_time: sessionStats.start_time,
          end_time: new Date().toISOString(),
          duration: durationMinutes,
          verses_studied: versesStudiedRef.current,
          accuracy
        });
      } catch (error) {
        console.error('Error saving session:', error);
      }

      setSessionStats(null);
      sessionStartTime.current = null;
    },
    [userId, sessionStats]
  );

  // Passer au verset suivant
  const nextVerse = useCallback(() => {
    if (!currentSurah) return;
    if (currentVerse < currentSurah.ayahs.length - 1) {
      setCurrentVerse(currentVerse + 1);
      setCurrentWord(0);
      versesStudiedRef.current++;
    }
  }, [currentSurah, currentVerse]);

  // Retour au verset précédent
  const previousVerse = useCallback(() => {
    if (currentVerse > 0) {
      setCurrentVerse(currentVerse - 1);
      setCurrentWord(0);
    }
  }, [currentVerse]);

  // Passer au mot suivant
  const nextWord = useCallback(() => {
    if (!currentSurah || currentVerse >= currentSurah.ayahs.length) return;
    const currentAyah = currentSurah.ayahs[currentVerse];
    if (currentWord < currentAyah.words.length - 1) {
      setCurrentWord(currentWord + 1);
    } else if (settings.autoPlayNext) {
      nextVerse();
    }
  }, [currentSurah, currentVerse, currentWord, settings.autoPlayNext, nextVerse]);

  // Lettre à la répétition espacée
  const getSRSInterval = (repetitions: number): number => {
    // Algorithme SM-2 simplifié
    const intervals = [1, 3, 7, 14, 30, 60, 180, 365];
    return intervals[Math.min(repetitions, intervals.length - 1)];
  };

  // Charger les versets pour révision (SRS)
  const getVersesForReview = useCallback(async () => {
    if (!userId || !currentSurah) return [];

    const today = new Date().toISOString().split('T')[0];
    const reviewVerses: Ayah[] = [];

    for (const ayah of currentSurah.ayahs) {
      const prog = getProgressForSurah(currentSurah.number, 'spaced-repetition');
      if (prog && prog.verse_number === ayah.numberInSurah) {
        const lastStudied = new Date(prog.last_studied);
        const daysSinceStudy = Math.floor(
          (Date.now() - lastStudied.getTime()) / (1000 * 60 * 60 * 24)
        );
        const interval = getSRSInterval(prog.verses_completed);

        if (daysSinceStudy >= interval) {
          reviewVerses.push(ayah);
        }
      }
    }

    return reviewVerses;
  }, [userId, currentSurah, getProgressForSurah]);

  // Générer un quiz pour un verset
  const generateQuiz = useCallback(
    async (surahNumber: number, verseNumber: number): Promise<Quiz | null> => {
      try {
        const { data } = await supabase
          .from('quizzes')
          .select('*')
          .eq('surah_number', surahNumber)
          .eq('verse_number', verseNumber)
          .limit(1)
          .single();

        return data as Quiz;
      } catch (error) {
        console.error('Error loading quiz:', error);
        return null;
      }
    },
    []
  );

  // Vérifier les réponses correctes
  const checkAnswer = useCallback(
    async (quiz: Quiz, selectedOption: number): Promise<boolean> => {
      const isCorrect = selectedOption === quiz.correct_answer;

      if (userId && sessionStats) {
        const currentAccuracy = sessionStats.accuracy;
        const newAccuracy =
          (currentAccuracy * (sessionStats.total_questions || 0) +
            (isCorrect ? 1 : 0)) /
          ((sessionStats.total_questions || 0) + 1);

        setSessionStats({
          ...sessionStats,
          total_questions: (sessionStats.total_questions || 0) + 1,
          accuracy: newAccuracy
        });
      }

      return isCorrect;
    },
    [userId, sessionStats]
  );

  // Débloquer un badge
  const unlockBadge = useCallback(
    async (badgeId: string) => {
      if (!userId) return;
      try {
        await supabase.from('user_badges').insert({
          user_id: userId,
          badge_id: badgeId,
          earned_date: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error unlocking badge:', error);
      }
    },
    [userId]
  );

  // Jouer l'audio pour un mot
  const playWordAudio = useCallback((surahNumber: number, verseNumber: number, wordPos: number) => {
    const s = String(surahNumber).padStart(3, '0');
    const v = String(verseNumber).padStart(3, '0');
    const m = String(wordPos).padStart(3, '0');
    const url = `https://audio.qurancdn.com/wbw/${s}_${v}_${m}.mp3`;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(e => console.error('Error playing audio:', e));
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      if (settings.autoPlayNext) {
        setTimeout(() => nextWord(), settings.wordDelay);
      }
    };
  }, [settings.autoPlayNext, settings.wordDelay, nextWord]);

  // Jouer l'audio du verset complet
  const playVerseAudio = useCallback(
    (surahNumber: number, verseNumber: number) => {
      if (!settings.reciter) return;

      const s = String(surahNumber).padStart(3, '0');
      const v = String(verseNumber).padStart(3, '0');
      const url = `https://everyayah.com/data/${settings.reciter.folder_name}/${s}${v}${settings.reciter.extension}`;

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(e => console.error('Error playing audio:', e));
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        if (settings.autoPlayNext) {
          setTimeout(() => nextVerse(), settings.verseDelay);
        }
      };
    },
    [settings, nextVerse]
  );

  // Arrêter l'audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    loadProgress();
    loadStats();
  }, [loadProgress, loadStats, userId]);

  return {
    // State
    currentSurah,
    setCurrentSurah,
    currentVerse,
    setCurrentVerse,
    currentWord,
    setCurrentWord,
    isPlaying,
    progress,
    settings,
    setSettings,
    sessionStats,

    // Methods
    loadProgress,
    loadStats,
    getProgressForSurah,
    saveProgress,
    startSession,
    endSession,
    nextVerse,
    previousVerse,
    nextWord,
    getVersesForReview,
    generateQuiz,
    checkAnswer,
    unlockBadge,
    playWordAudio,
    playVerseAudio,
    stopAudio
  };
}

/**
 * Hook pour gérer les récompenses et badges
 */
export function useBadgeSystem(userId: string | undefined) {
  const [badges, setBadges] = useState<any[]>([]);
  const [points, setPoints] = useState(0);

  const loadBadges = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', userId);
      if (data) setBadges(data);
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  }, [userId]);

  const addPoints = useCallback(
    async (amount: number, reason: string) => {
      if (!userId) return;
      try {
        const newPoints = points + amount;
        await supabase.from('user_points').upsert({
          user_id: userId,
          points: newPoints
        });
        setPoints(newPoints);

        await supabase.from('points_history').insert({
          user_id: userId,
          points: amount,
          reason,
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error adding points:', error);
      }
    },
    [userId, points]
  );

  useEffect(() => {
    loadBadges();
  }, [loadBadges, userId]);

  return { badges, points, loadBadges, addPoints };
}
