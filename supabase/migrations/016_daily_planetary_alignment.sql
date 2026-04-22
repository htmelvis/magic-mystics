-- =====================================================
-- Migration 016: Daily planetary alignment table
-- Stores the dominant planetary energy for each day,
-- computed by the daily-planetary edge function.
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_planetary_alignment (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  dominant_planet VARCHAR(50) NOT NULL,
  dominant_planet_sign VARCHAR(50) NOT NULL,
  dominant_planet_symbol VARCHAR(10),
  alignment_theme TEXT,
  supported_endeavors TEXT[],
  all_planet_positions JSONB,   -- [{planet, symbol, sign, isRetrograde, longitude}, ...]
  advice TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_planet_date ON daily_planetary_alignment(date);

ALTER TABLE daily_planetary_alignment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to daily_planetary_alignment"
  ON daily_planetary_alignment FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role to manage daily_planetary_alignment"
  ON daily_planetary_alignment FOR ALL
  TO service_role
  USING (true);
