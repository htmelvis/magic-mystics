-- Add tarot card fields to users — stores the ruling tarot card for the user's sun sign,
-- along with its association description and type, written during the tarot-reveal
-- onboarding step so the profile page reads everything from the single user query.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS tarot_card_id INTEGER REFERENCES tarot_cards(id),
  ADD COLUMN IF NOT EXISTS tarot_association_type TEXT,
  ADD COLUMN IF NOT EXISTS tarot_association_description TEXT;

CREATE INDEX IF NOT EXISTS idx_users_tarot_card_id ON public.users(tarot_card_id);

-- Backfill existing users who completed onboarding before this column existed.
UPDATE public.users u
SET
  tarot_card_id = zta.tarot_card_id,
  tarot_association_type = zta.association_type,
  tarot_association_description = zta.description
FROM zodiac_tarot_associations zta
JOIN zodiac_signs zs ON zta.zodiac_sign_id = zs.id
WHERE u.sun_sign IS NOT NULL
  AND u.tarot_card_id IS NULL
  AND LOWER(u.sun_sign) = LOWER(zs.name);
