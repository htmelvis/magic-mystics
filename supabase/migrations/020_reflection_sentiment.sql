-- Reflection sentiment fields.
--
-- The reflection UI (post-reading) collects two sentiment signals alongside
-- the free-text content: how the user felt about the reading and how aligned
-- it felt with their experience. Stored as TEXT with a CHECK constraint
-- rather than a Postgres ENUM so the value set can be extended later without
-- a migration to ALTER TYPE.
--
-- Columns are nullable in the DB to accommodate any pre-existing rows and
-- partial saves; the form enforces required at write time.
--
-- Idempotent: these columns may already exist on some environments where
-- they were added out-of-band before this migration was authored.

ALTER TABLE public.reflections
  ADD COLUMN IF NOT EXISTS feeling TEXT,
  ADD COLUMN IF NOT EXISTS alignment TEXT;

ALTER TABLE public.reflections
  DROP CONSTRAINT IF EXISTS reflections_feeling_check;
ALTER TABLE public.reflections
  ADD CONSTRAINT reflections_feeling_check
  CHECK (feeling IN ('positive', 'neutral', 'negative'));

ALTER TABLE public.reflections
  DROP CONSTRAINT IF EXISTS reflections_alignment_check;
ALTER TABLE public.reflections
  ADD CONSTRAINT reflections_alignment_check
  CHECK (alignment IN ('positive', 'neutral', 'negative'));

-- One reflection per (reading, user) — the hook upserts on this conflict target.
CREATE UNIQUE INDEX IF NOT EXISTS idx_reflections_reading_user
  ON public.reflections(reading_id, user_id);
