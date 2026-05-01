-- In-app announcements table for surfacing feature updates and CTAs to users
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT CHECK (type IN ('info', 'cta', 'feature')) NOT NULL DEFAULT 'info',
  action_label TEXT,
  action_route TEXT,
  target_tier TEXT CHECK (target_tier IN ('all', 'free', 'premium')) NOT NULL DEFAULT 'all',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tracks which users have dismissed/seen each announcement
CREATE TABLE IF NOT EXISTS user_announcement_reads (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, announcement_id)
);

-- Announcements are read-only for authenticated users (admin inserts via service key)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'announcements'
      AND policyname = 'Authenticated users can read active announcements'
  ) THEN
    CREATE POLICY "Authenticated users can read active announcements"
      ON announcements FOR SELECT
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Users manage their own read records
ALTER TABLE user_announcement_reads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'user_announcement_reads'
      AND policyname = 'Users manage their own announcement reads'
  ) THEN
    CREATE POLICY "Users manage their own announcement reads"
      ON user_announcement_reads FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;
