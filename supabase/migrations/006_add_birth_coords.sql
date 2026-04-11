-- Add geocoding coordinates and one-time edit guard to users table
ALTER TABLE public.users
  ADD COLUMN birth_lat DOUBLE PRECISION,
  ADD COLUMN birth_lng DOUBLE PRECISION,
  ADD COLUMN birth_details_edited_at TIMESTAMPTZ;
