-- ============================================================
-- TABLES DE BASE SUPABASE - SYSTÈME D'APPRENTISSAGE DU CORAN
-- ============================================================

-- 1. TABLE: reciters (Récitateurs du Coran)
CREATE TABLE IF NOT EXISTS reciters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  folder_name VARCHAR(255) NOT NULL,
  recitation_type VARCHAR(50),
  extension VARCHAR(10) DEFAULT '.mp3',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default reciters
INSERT INTO reciters (name, folder_name, recitation_type, extension) 
VALUES 
  ('Alafasy', 'Alafasy', 'Murattal', '.mp3'),
  ('AbdulBaset Mujawwad', 'AbdulBaset_Mujawwad', 'Mujawwad', '.mp3'),
  ('Husary Murattal', 'Husary_Murattal', 'Murattal', '.mp3'),
  ('Abdulrahman As-Sudais', 'Abdulrahman_As-Sudais', 'Murattal', '.mp3');

-- 2. TABLE: learning_progress (Progression d'apprentissage)
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number INTEGER NOT NULL CHECK (surah_number >= 1 AND surah_number <= 114),
  verse_number INTEGER NOT NULL DEFAULT 0,
  word_position INTEGER NOT NULL DEFAULT 0,
  mode VARCHAR(50) DEFAULT 'progressive-reading',
  completion_percentage FLOAT DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  total_verses INTEGER DEFAULT 0,
  verses_completed INTEGER DEFAULT 0,
  last_studied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_spent INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, surah_number, mode)
);

-- 3. TABLE: learning_sessions (Sessions d'apprentissage)
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number INTEGER NOT NULL,
  mode VARCHAR(50) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration INTEGER DEFAULT 0,
  verses_studied INTEGER DEFAULT 0,
  words_studied INTEGER DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLE: quizzes (Questions de quiz)
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(surah_number, verse_number, type)
);

-- 5. TABLE: badges (Définition des badges)
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10),
  icon_color VARCHAR(50),
  requirement VARCHAR(50) NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default badges
INSERT INTO badges (name, description, icon, icon_color, requirement, requirement_value) 
VALUES 
  ('Débutant', 'Apprenez votre premier verset', '✨', 'amber', 'verses', 1),
  ('Lecteur Assidu', 'Apprenez 10 versets', '📖', 'blue', 'verses', 10),
  ('Érudit', 'Apprenez 50 versets', '🎓', 'purple', 'verses', 50),
  ('Maître du Coran', 'Apprenez 100 versets', '👑', 'gold', 'verses', 100),
  ('Streaker', 'Étudiez 7 jours consécutifs', '🔥', 'orange', 'streak', 7),
  ('Perfectionniste', 'Atteindre 95% de précision', '🎯', 'emerald', 'accuracy', 95),
  ('Chercheur de Connaissance', 'Étudier pendant 10 heures', '⏰', 'indigo', 'time', 600);

-- 6. TABLE: user_badges (Badges débloqués par l'utilisateur)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);

-- 7. TABLE: user_points (Points de l'utilisateur)
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABLE: points_history (Historique des points)
CREATE TABLE IF NOT EXISTS points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABLE: learning_stats (Statistiques globales)
CREATE TABLE IF NOT EXISTS learning_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_verses_learned INTEGER DEFAULT 0,
  total_time INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_accuracy FLOAT DEFAULT 0,
  favorite_reciter_id INTEGER REFERENCES reciters(id),
  study_schedule JSON DEFAULT '{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":true,"sunday":true}',
  last_studied_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. TABLE: leaderboard (Tableau des classements)
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  rank INTEGER,
  total_points INTEGER DEFAULT 0,
  verses_learned INTEGER DEFAULT 0,
  badges_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_stats ENABLE ROW LEVEL SECURITY;

-- Policies for learning_progress
CREATE POLICY "Users can view their own progress"
  ON learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for learning_sessions
CREATE POLICY "Users can view their own sessions"
  ON learning_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON learning_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_badges
CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all public badges"
  ON badges FOR SELECT
  USING (true);

-- Policies for user_points
CREATE POLICY "Users can view their own points"
  ON user_points FOR SELECT
  USING (auth.uid() = user_id);

-- Policies for learning_stats
CREATE POLICY "Users can view their own stats"
  ON learning_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON learning_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_surah ON learning_progress(surah_number);
CREATE INDEX idx_learning_progress_mode ON learning_progress(mode);
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_learning_sessions_surah ON learning_sessions(surah_number);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_points_history_user_id ON points_history(user_id);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);

-- ============================================================
-- SAMPLE QUIZZES DATA
-- ============================================================

INSERT INTO quizzes (surah_number, verse_number, type, question, options, correct_answer, explanation)
VALUES 
(1, 1, 'comprehension', 
  'Quel est le premier verset de la Sourate Al-Fatiha?',
  '["Bismi Allahi", "Alhamdulillahi", "Ar-Rahman", "Ar-Rahim"]',
  0,
  'Le premier verset est Bismi Allahi (Au nom d''Allah)'
),
(1, 2, 'memorization',
  'Complétez: Al-Hamdu lillahi Rabi...',
  '["al-alameen", "as-samawi", "al-akhar", "an-nur"]',
  0,
  'La louange appartient à Allah, Seigneur de l''univers.'
),
(2, 1, 'tajweed',
  'Dans le premier verset de Al-Baqarah, identifiez le Tajweed',
  '["Qalqala", "Ghunna", "Madd", "Hamza"]',
  2,
  'Le Madd (allongement) est présent dans ce verset.'
);
