-- Replace the two single-column indexes with one composite index that covers
-- the primary query pattern: "this user's readings, newest first."
--
-- The composite index on (user_id, created_at DESC) satisfies both equality
-- filtering on user_id AND the ORDER BY created_at DESC in a single B-tree
-- scan, eliminating a separate sort step.

DROP INDEX IF EXISTS idx_readings_user_id;
DROP INDEX IF EXISTS idx_readings_created_at;

CREATE INDEX idx_readings_user_created
  ON public.readings (user_id, created_at DESC);
