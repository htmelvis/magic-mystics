-- Add astrology and onboarding fields to users table
ALTER TABLE public.users
  ADD COLUMN birth_date DATE,
  ADD COLUMN birth_time TIME,
  ADD COLUMN birth_location TEXT,
  ADD COLUMN sun_sign TEXT,
  ADD COLUMN moon_sign TEXT,
  ADD COLUMN rising_sign TEXT,
  ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

-- Add index for onboarding status queries
CREATE INDEX idx_users_onboarding_completed ON public.users(onboarding_completed);
