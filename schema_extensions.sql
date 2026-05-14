-- Extensions SQL pour Radio Iqra TV
-- Nouvelles tables pour les fonctionnalités premium

-- Settings / Configuration (remplace site_config si besoin)
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage sections (contrôle de l'affichage)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id SERIAL PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255),
  subtitle TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  background_type VARCHAR(50) DEFAULT 'image',
  background_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default sections
INSERT INTO homepage_sections (section_key, title, display_order) VALUES
  ('hero', 'Hero Section', 1),
  ('categories', 'Catégories', 2),
  ('podcasts', 'Derniers Podcasts', 3),
  ('prayer_times', 'Horaires de Prière', 4),
  ('quotes', 'Citations Islamiques', 5),
  ('articles', 'Derniers Conseils', 6),
  ('donations', 'Dons', 7),
  ('about', 'À Propos', 8)
ON CONFLICT (section_key) DO NOTHING;

-- Live streams (TV/Radio)
CREATE TABLE IF NOT EXISTS live_streams (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('tv', 'radio')),
  stream_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_live BOOLEAN DEFAULT false,
  viewer_count INT DEFAULT 0,
  schedule JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conferences / Speakers
CREATE TABLE IF NOT EXISTS conferences (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  speaker_name VARCHAR(255),
  speaker_image TEXT,
  speaker_bio TEXT,
  description TEXT,
  video_url TEXT,
  date DATE,
  duration VARCHAR(20),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Islamic quotes
CREATE TABLE IF NOT EXISTS islamic_quotes (
  id SERIAL PRIMARY KEY,
  quote_text TEXT NOT NULL,
  reference VARCHAR(255),
  author VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample quotes
INSERT INTO islamic_quotes (quote_text, reference) VALUES
  ('Certes, avec la difficulté vient la facilité.', 'Sourate Ash-Sharh, 94:5'),
  ('Le meilleur d''entre vous est celui qui apprend le Coran et l''enseigne.', 'Sahih al-Bukhari'),
  ('Un croyant est le miroir de son frère croyant.', 'Hadith'),
  ('Celui qui guide vers un bien est comme celui qui l''accomplit.', 'Sahih Muslim')
ON CONFLICT DO NOTHING;

-- Prayer times
CREATE TABLE IF NOT EXISTS prayer_times (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) DEFAULT 'Burkina Faso',
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  date DATE NOT NULL,
  calculation_method VARCHAR(50) DEFAULT 'MWL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city, date)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location VARCHAR(255),
  image_url TEXT,
  event_type VARCHAR(50) DEFAULT 'conference',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  message TEXT,
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donation goals
CREATE TABLE IF NOT EXISTS donation_goals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO donation_goals (title, description, target_amount, current_amount) VALUES
  ('Soutenez Notre Cause', 'Aidez-nous à diffuser la parole d''Allah', 5000, 3600)
ON CONFLICT DO NOTHING;

-- Social links (étendue)
CREATE TABLE IF NOT EXISTS social_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics (simple page views)
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL,
  visitor_ip VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_prayer_times_city_date ON prayer_times(city, date);
CREATE INDEX IF NOT EXISTS idx_analytics_visited_at ON analytics(visited_at);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
