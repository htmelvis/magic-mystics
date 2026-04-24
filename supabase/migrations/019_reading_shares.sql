-- Social sharing for readings.
--
-- A reading only becomes publicly readable (via get_shareable_reading) after
-- the user taps Share in-app, which stamps shared_at. RLS on readings stays
-- strict (auth.uid() = user_id); the RPC below is the single sealed surface
-- exposing a minimal subset to the anon role so the Cloudflare Worker at
-- links.magicmystics.com can render the OG landing page and PNG.

ALTER TABLE public.readings
  ADD COLUMN shared_at TIMESTAMPTZ;

CREATE INDEX idx_readings_shared_at ON public.readings(shared_at) WHERE shared_at IS NOT NULL;

-- Returns the public-safe shape of a shared reading, or NULL if the reading
-- does not exist or has not been shared. Never exposes ai_insight or
-- reflections — the landing page is generic enough to texted, not personal
-- mystical prose keyed to the user's birth chart.
--
-- The first drawn card is surfaced as `primary_card_*` so the Worker can
-- render a single hero tile regardless of spread size. `card_count` lets the
-- template annotate multi-card spreads.
CREATE OR REPLACE FUNCTION public.get_shareable_reading(p_id UUID)
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH r AS (
    SELECT id, spread_type, drawn_cards, shared_at, created_at
    FROM public.readings
    WHERE id = p_id AND shared_at IS NOT NULL
  ),
  first_card AS (
    SELECT (drawn_cards -> 0) AS c FROM r
  ),
  card_row AS (
    SELECT
      tc.name,
      tc.arcana,
      tc.suit,
      tc.number,
      tc.upright_summary,
      tc.reversed_summary,
      tc.image_url,
      tc.thumbnail_url
    FROM first_card, public.tarot_cards tc
    WHERE tc.id = ((first_card.c ->> 'cardId')::int)
  )
  SELECT json_build_object(
    'reading_id', r.id,
    'spread_type', r.spread_type,
    'card_count', jsonb_array_length(r.drawn_cards),
    'shared_at', r.shared_at,
    'created_at', r.created_at,
    'primary_card_name', card_row.name,
    'primary_card_arcana', card_row.arcana,
    'primary_card_suit', card_row.suit,
    'primary_card_number', card_row.number,
    'primary_card_orientation', first_card.c ->> 'orientation',
    'primary_card_summary', CASE
      WHEN (first_card.c ->> 'orientation') = 'reversed'
      THEN card_row.reversed_summary
      ELSE card_row.upright_summary
    END,
    'primary_card_image_url', card_row.image_url,
    'primary_card_thumbnail_url', card_row.thumbnail_url
  )
  FROM r, first_card, card_row;
$$;

REVOKE ALL ON FUNCTION public.get_shareable_reading(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shareable_reading(UUID) TO anon, authenticated;
