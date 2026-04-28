// Types pour le système d'apprentissage complet

export type LearningMode = 
  | 'progressive-reading'    // Lecture progressive verset par verset
  | 'word-by-word'           // Mot par mot avec Tajweed
  | 'spaced-repetition'      // Répétition espacée (SRS)
  | 'memorization'           // Mémorisation intensive
  | 'review';                // Révision ciblée

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  words: string[];
  juz?: number;
  page?: number;
}

export interface Surah {
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

export interface LearningSettings {
  mode: LearningMode;
  reciter: Reciter;
  autoPlayNext: boolean;
  showTajweed: boolean;
  showTranslation: boolean;
  wordDelay: number;         // ms between words
  verseDelay: number;        // ms between verses
  repetitionsPerVerse: number; // For SRS mode
}

export interface LearningProgress {
  surah_number: number;
  verse_number: number;
  word_position: number;
  mode: LearningMode;
  completion_percentage: number;
  total_verses: number;
  verses_completed: number;
  last_studied: string;
  time_spent: number;       // in minutes
  correct_answers?: number;
  total_questions?: number;
}

export interface Quiz {
  id: string;
  surah_number: number;
  verse_number: number;
  type: 'memorization' | 'comprehension' | 'tajweed';
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  icon_color: string;
  requirement: 'verses' | 'memorization' | 'accuracy' | 'streak' | 'time';
  requirement_value: number;
  earned_date?: string;
}

export interface LearningStats {
  total_verses_learned: number;
  total_time: number;        // minutes
  current_streak: number;    // days
  best_accuracy: number;     // percentage
  badges_earned: UserBadge[];
  favorite_reciter: Reciter | null;
  study_schedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export interface WordAudio {
  surah: number;
  verse: number;
  word: number;
  url: string;
}

export interface VerseAudio {
  surah: number;
  verse: number;
  reciter: Reciter;
  url: string;
}

export interface LearningSession {
  id: string;
  user_id: string;
  surah_number: number;
  mode: LearningMode;
  start_time: string;
  end_time?: string;
  duration: number;          // minutes
  verses_studied: number;
  words_studied: number;
  accuracy: number;          // percentage
  completed: boolean;
}
