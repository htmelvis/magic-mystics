-- Enforce that birth_date, birth_time, birth_location, and birth_details_edited_at
-- can only be changed once. birth_lat / birth_lng are intentionally excluded so the
-- profile's "retry geocoding" flow can update coordinates without triggering the lock.
CREATE OR REPLACE FUNCTION public.guard_birth_details_edit()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.birth_details_edited_at IS NOT NULL AND (
    NEW.birth_date IS DISTINCT FROM OLD.birth_date OR
    NEW.birth_time IS DISTINCT FROM OLD.birth_time OR
    NEW.birth_location IS DISTINCT FROM OLD.birth_location OR
    NEW.birth_details_edited_at IS DISTINCT FROM OLD.birth_details_edited_at
  ) THEN
    RAISE EXCEPTION 'BIRTH_DETAILS_LOCKED: birth details can only be edited once';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_birth_details_one_edit
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_birth_details_edit();
