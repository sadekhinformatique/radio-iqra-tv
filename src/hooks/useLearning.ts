import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface LearningLevel {
  id: string;
  title: string;
  description: string;
  order: number;
  image_url: string;
}

export interface LearningModule {
  id: string;
  level_id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface LearningLesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  audio_url?: string;
  video_url?: string;
  order: number;
}

export interface UserProgress {
  lesson_id: string;
  completed: boolean;
  score?: number;
}

export function useLearning() {
  const [levels, setLevels] = useState<LearningLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    async function fetchLearningData() {
      try {
        const { data: levelsData, error: levelsError } = await supabase
          .from('learning_levels')
          .select('*')
          .order('order', { ascending: true });

        if (levelsError) throw levelsError;
        setLevels(levelsData || []);

        // Fetch user progress if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: progressData } = await supabase
            .from('user_learning_progress')
            .select('lesson_id, completed, score')
            .eq('user_id', session.user.id);
          
          setUserProgress(progressData || []);
        }
      } catch (err) {
        console.error("Error fetching learning data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLearningData();
  }, []);

  const markLessonComplete = async (lessonId: string, score?: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      await supabase.from('user_learning_progress').upsert({
        user_id: session.user.id,
        lesson_id: lessonId,
        completed: true,
        score,
        completed_at: new Date().toISOString()
      });
      
      setUserProgress(prev => [...prev, { lesson_id: lessonId, completed: true, score }]);
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  return { levels, loading, userProgress, markLessonComplete };
}
