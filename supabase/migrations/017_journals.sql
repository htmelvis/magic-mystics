CREATE TABLE IF NOT EXISTS public.journals (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reading_id  UUID        NULL REFERENCES public.readings(id) ON DELETE SET NULL,
  title       TEXT        NULL,
  body        TEXT        NOT NULL DEFAULT '',
  ai_prompt   TEXT        NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journals_user_created ON public.journals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journals_reading_id   ON public.journals(reading_id) WHERE reading_id IS NOT NULL;

-- update_updated_at() already exists from migration 001
CREATE TRIGGER update_journals_updated_at
  BEFORE UPDATE ON public.journals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journals"   ON public.journals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own journals" ON public.journals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journals" ON public.journals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journals" ON public.journals FOR DELETE USING (auth.uid() = user_id);
