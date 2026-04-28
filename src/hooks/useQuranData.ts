import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  words?: string[];
}

export interface SurahDetail {
  number: number;
  name_ar: string;
  name_fr: string;
  ayahs: Ayah[];
}

export interface Reciter {
  id: number;
  name: string;
  folder_name: string;
  recitation_type: string;
  extension: string;
}

export function useQuranData() {
  const [reciters, setReciters] = useState<Reciter[]>([]);

  useEffect(() => {
    fetchReciters();
  }, []);

  const fetchReciters = async () => {
    const { data } = await supabase
      .from('reciters')
      .select('*')
      .eq('is_active', true);
    if (data) setReciters(data);
  };

  const fetchSurah = async (surahNumber: number): Promise<SurahDetail | null> => {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.uthmani`);
      const data = await response.json();
      if (data.code === 200) {
        return {
          number: data.data.number,
          name_ar: data.data.name,
          name_fr: data.data.englishNameTranslation || data.data.englishName,
          ayahs: data.data.ayahs.map((ayah: any) => ({
            ...ayah,
            words: ayah.text.split(' ').filter((w: string) => w.trim() !== '')
          }))
        };
      }
    } catch (e) { console.error(e); }
    return null;
  };

  const getVerseAudioUrl = (reciter: Reciter, surahNumber: number, verseNumber: number): string => {
    const s = String(surahNumber).padStart(3, '0');
    const v = String(verseNumber).padStart(3, '0');
    return `https://everyayah.com/data/${reciter.folder_name}/${s}${v}${reciter.extension}`;
  };

  const getWordAudioUrl = (surahNumber: number, verseNumber: number, wordPos: number): string => {
    const s = String(surahNumber).padStart(3, '0');
    const v = String(verseNumber).padStart(3, '0');
    const m = String(wordPos).padStart(3, '0');
    return `https://audio.qurancdn.com/wbw/${s}_${v}_${m}.mp3`;
  };

  return { reciters, fetchSurah, getVerseAudioUrl, getWordAudioUrl };
}

export function useLearningProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<any[]>([]);

  const fetchProgress = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from('learning_progress').select('*').eq('user_id', userId);
    if (data) setProgress(data);
  }, [userId]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const getProgress = (surahNumber: number, mode: string) => {
    return progress.find(p => p.surah_number === surahNumber && p.mode === mode) || null;
  };

  const saveProgress = async (surahNumber: number, verseNumber: number, wordPos: number, mode: string, totalVerses: number, versesDone: number) => {
    if (!userId) return;
    const percentage = totalVerses > 0 ? (versesDone / totalVerses) * 100 : 0;
    await supabase.from('learning_progress').upsert({
      user_id: userId,
      surah_number: surahNumber,
      verse_number: verseNumber,
      word_position: wordPos,
      mode,
      total_verses: totalVerses,
      verses_completed: versesDone,
      completion_percentage: percentage,
      completed: percentage >= 100,
      last_accessed: new Date().toISOString()
    }, { onConflict: 'user_id,surah_number,mode' });
    fetchProgress();
  };

  return { progress, getProgress, saveProgress };
}
