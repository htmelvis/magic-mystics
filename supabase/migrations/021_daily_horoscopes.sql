-- =====================================================
-- Migration 021: Daily horoscopes table
-- One row per (date, sign) — 12 rows generated each midnight.
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_horoscopes (
  id            SERIAL PRIMARY KEY,
  date          DATE        NOT NULL,
  sign          VARCHAR(20) NOT NULL,  -- 'Aries' … 'Pisces'
  headline      TEXT,                  -- ≤12-word punchy theme sentence
  body          TEXT,                  -- 3-4 sentence core reading
  theme         TEXT,                  -- 1-2 word energy label (e.g. 'bold moves')
  love_note     TEXT,                  -- 1 sentence on relationships
  career_note   TEXT,                  -- 1 sentence on work/ambition
  wellness_note TEXT,                  -- 1 sentence on body/rest
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(date, sign)
);

CREATE INDEX IF NOT EXISTS idx_daily_horoscopes_date_sign
  ON daily_horoscopes(date, sign);

-- Public read — horoscopes are keyed by sign, not user identity.
ALTER TABLE daily_horoscopes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'daily_horoscopes'
      AND policyname = 'horoscopes_public_read'
  ) THEN
    CREATE POLICY "horoscopes_public_read"
      ON daily_horoscopes
      FOR SELECT
      USING (true);
  END IF;
END $$;
