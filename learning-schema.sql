-- Schema pour le programme d'apprentissage du Coran
-- Exécuter dans Supabase SQL Editor

-- 1. Table des récitateurs
CREATE TABLE IF NOT EXISTS reciters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  folder_name VARCHAR(100) NOT NULL,
  recitation_type VARCHAR(50), -- 'Mujawwad', 'Murattal'
  extension VARCHAR(10) DEFAULT '.mp3',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Table de progression d'apprentissage
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  word_position INTEGER DEFAULT 0,
  mode VARCHAR(20) NOT NULL, -- 'reading', 'memorization'
  last_accessed TIMESTAMP DEFAULT NOW(),
  completed BOOLEAN DEFAULT false,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  total_verses INTEGER,
  verses_completed INTEGER DEFAULT 0,
  UNIQUE(user_id, surah_number, mode)
);

-- 3. Table des sessions d'apprentissage
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number INTEGER NOT NULL,
  mode VARCHAR(20) NOT NULL,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  verses_covered INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0
);

-- 4. Activer RLS (Row Level Security)
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS: les utilisateurs ne peuvent voir que leur propre progression
CREATE POLICY "Users can view own progress"
  ON learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions"
  ON learning_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON learning_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Index pour performance
CREATE INDEX idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_surah ON learning_progress(surah_number);
CREATE INDEX idx_learning_sessions_user ON learning_sessions(user_id);

-- 6. Insérer les récitateurs par défaut
INSERT INTO reciters (name, name_ar, folder_name, recitation_type, extension) VALUES
('Mishary Rashid Alafasy', 'مشاري راشد العفاسي', 'Alafasy', 'Murattal', '.mp3'),
('Abdul Baset Abdul Samad', 'عبد الباسط عبد الصمد', 'AbdulBaset_Murattal', 'Murattal', '.mp3'),
('Mahmoud Khalil Al-Husary', 'محمود خليل الحصري', 'Husary_Murattal', 'Murattal', '.mp3'),
('Mohamed Siddiq Al-Minshawi', 'محمد صديق المنشاوي', 'Minshawi_Murattal', 'Murattal', '.mp3'),
('Abdul Rahman Al-Sudais', 'عبد الرحمن السديس', 'Sudais', 'Murattal', '.mp3'),
('Saad Al-Ghamdi (Shatri)', 'سعد الغامدي', 'Shatri', 'Murattal', '.mp3'),
('Abdullah Al-Shuraym', 'عبد الله الشريم', 'Shuraym', 'Murattal', '.mp3'),
('Ibrahim Al-Rifai', 'إبراهيم الرفاعي', 'Rifai', 'Murattal', '.mp3')
ON CONFLICT DO NOTHING;
