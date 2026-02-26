-- =====================================================
-- Phase 1: Metaphysical Reference Tables
-- Creates normalized reference data for zodiac, tarot, crystals
-- No breaking changes - additive only
-- =====================================================

-- ============== ZODIAC SIGNS ==============
CREATE TABLE IF NOT EXISTS zodiac_signs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  element VARCHAR(20) NOT NULL CHECK (element IN ('Fire', 'Earth', 'Air', 'Water')),
  modality VARCHAR(20) NOT NULL CHECK (modality IN ('Cardinal', 'Fixed', 'Mutable')),
  ruling_planet VARCHAR(50),
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  description TEXT,
  keywords TEXT[],
  strengths TEXT[],
  weaknesses TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_zodiac_element ON zodiac_signs(element);
CREATE INDEX idx_zodiac_modality ON zodiac_signs(modality);
CREATE INDEX idx_zodiac_name ON zodiac_signs(name);

-- ============== TAROT CARDS ==============
CREATE TABLE IF NOT EXISTS tarot_cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  arcana VARCHAR(20) NOT NULL CHECK (arcana IN ('Major', 'Minor')),
  suit VARCHAR(20) CHECK (suit IN ('Wands', 'Cups', 'Swords', 'Pentacles') OR suit IS NULL),
  number INTEGER,
  court_rank VARCHAR(20) CHECK (court_rank IN ('Page', 'Knight', 'Queen', 'King') OR court_rank IS NULL),
  upright_meaning TEXT NOT NULL,
  reversed_meaning TEXT NOT NULL,
  keywords_upright TEXT[],
  keywords_reversed TEXT[],
  element VARCHAR(20),
  astrology_association VARCHAR(100),
  numerology INTEGER,
  image_url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tarot_arcana ON tarot_cards(arcana);
CREATE INDEX idx_tarot_suit ON tarot_cards(suit);
CREATE INDEX idx_tarot_element ON tarot_cards(element);
CREATE INDEX idx_tarot_name ON tarot_cards(name);

-- ============== CRYSTALS ==============
CREATE TABLE IF NOT EXISTS crystals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  scientific_name VARCHAR(100),
  color VARCHAR(50)[],
  chakra VARCHAR(50)[],
  element VARCHAR(20),
  planetary_ruler VARCHAR(50),
  properties TEXT[],
  metaphysical_uses TEXT,
  physical_properties TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crystal_element ON crystals(element);
CREATE INDEX idx_crystal_chakra ON crystals USING GIN(chakra);
CREATE INDEX idx_crystal_name ON crystals(name);

-- ============== PLANETS ==============
CREATE TABLE IF NOT EXISTS planets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  meaning TEXT NOT NULL,
  rules_sign VARCHAR(50)[],
  keywords TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_planet_name ON planets(name);

-- ============== ASSOCIATION TABLES ==============

-- Zodiac ↔ Tarot Associations
CREATE TABLE IF NOT EXISTS zodiac_tarot_associations (
  id SERIAL PRIMARY KEY,
  zodiac_sign_id INTEGER NOT NULL REFERENCES zodiac_signs(id) ON DELETE CASCADE,
  tarot_card_id INTEGER NOT NULL REFERENCES tarot_cards(id) ON DELETE CASCADE,
  association_type VARCHAR(50) NOT NULL,
  strength INTEGER DEFAULT 5 CHECK (strength >= 1 AND strength <= 10),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zodiac_sign_id, tarot_card_id, association_type)
);

CREATE INDEX idx_zodiac_tarot_zodiac ON zodiac_tarot_associations(zodiac_sign_id);
CREATE INDEX idx_zodiac_tarot_card ON zodiac_tarot_associations(tarot_card_id);

-- Zodiac ↔ Crystal Associations
CREATE TABLE IF NOT EXISTS zodiac_crystal_associations (
  id SERIAL PRIMARY KEY,
  zodiac_sign_id INTEGER NOT NULL REFERENCES zodiac_signs(id) ON DELETE CASCADE,
  crystal_id INTEGER NOT NULL REFERENCES crystals(id) ON DELETE CASCADE,
  association_type VARCHAR(50) NOT NULL,
  strength INTEGER DEFAULT 5 CHECK (strength >= 1 AND strength <= 10),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zodiac_sign_id, crystal_id, association_type)
);

CREATE INDEX idx_zodiac_crystal_zodiac ON zodiac_crystal_associations(zodiac_sign_id);
CREATE INDEX idx_zodiac_crystal_crystal ON zodiac_crystal_associations(crystal_id);

-- Daily Metaphysical Data
CREATE TABLE IF NOT EXISTS daily_metaphysical_data (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  lucky_numbers INTEGER[],
  lucky_colors VARCHAR(50)[],
  recommended_crystal_id INTEGER REFERENCES crystals(id),
  recommended_tarot_card_id INTEGER REFERENCES tarot_cards(id),
  moon_phase VARCHAR(50),
  moon_sign_id INTEGER REFERENCES zodiac_signs(id),
  retrograde_planets VARCHAR(50)[],
  energy_theme TEXT,
  advice TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_meta_date ON daily_metaphysical_data(date);
CREATE INDEX idx_daily_meta_moon_sign ON daily_metaphysical_data(moon_sign_id);

-- ============== ROW LEVEL SECURITY ==============

-- Reference tables are public read for authenticated users
ALTER TABLE zodiac_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE crystals ENABLE ROW LEVEL SECURITY;
ALTER TABLE planets ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_tarot_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zodiac_crystal_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metaphysical_data ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access to zodiac_signs"
  ON zodiac_signs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to tarot_cards"
  ON tarot_cards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to crystals"
  ON crystals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to planets"
  ON planets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to zodiac_tarot_associations"
  ON zodiac_tarot_associations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to zodiac_crystal_associations"
  ON zodiac_crystal_associations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to daily_metaphysical_data"
  ON daily_metaphysical_data FOR SELECT
  TO authenticated
  USING (true);

-- Service role can write (for seeding and updates)
CREATE POLICY "Allow service role to manage zodiac_signs"
  ON zodiac_signs FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to manage tarot_cards"
  ON tarot_cards FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to manage crystals"
  ON crystals FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to manage planets"
  ON planets FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to manage zodiac_tarot_associations"
  ON zodiac_tarot_associations FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to manage zodiac_crystal_associations"
  ON zodiac_crystal_associations FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to manage daily_metaphysical_data"
  ON daily_metaphysical_data FOR ALL
  TO service_role
  USING (true);

-- ============== UPDATE TRIGGER ==============

CREATE TRIGGER update_zodiac_signs_updated_at
  BEFORE UPDATE ON zodiac_signs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_tarot_cards_updated_at
  BEFORE UPDATE ON tarot_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_crystals_updated_at
  BEFORE UPDATE ON crystals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
