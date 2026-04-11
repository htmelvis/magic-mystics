-- Store the IANA timezone of the birth location (e.g. "America/New_York").
-- Derived from geocoordinates after onboarding or edit. Nullable — geocoding
-- can fail silently and the field gets backfilled on retry.
ALTER TABLE public.users
  ADD COLUMN birth_timezone TEXT;
