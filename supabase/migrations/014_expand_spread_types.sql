-- Expand allowed spread_type values to support all 3-card spread variants.
ALTER TABLE readings
  DROP CONSTRAINT IF EXISTS readings_spread_type_check;

ALTER TABLE readings
  ADD CONSTRAINT readings_spread_type_check CHECK (
    spread_type IN (
      'daily',
      'past-present-future',
      'relationship',
      'situation-obstacle-solution',
      'mind-body-spirit',
      'accept-embrace-let-go'
    )
  );
