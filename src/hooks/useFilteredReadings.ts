import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import type { ReadingRow } from '@hooks/useReadings';

export type SpreadFilter = 'all' | 'daily' | 'past-present-future';

const DEBOUNCE_MS = 250;

/**
 * Normalises a string for case-insensitive, accent-insensitive matching.
 * Using a shared helper avoids allocating inside the hot filter loop.
 */
function norm(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().trim();
}

function matchesSearch(reading: ReadingRow, query: string): boolean {
  // Card names
  for (const card of reading.drawn_cards) {
    if (norm(card.cardName).includes(query)) return true;
    if (card.suit && norm(card.suit).includes(query)) return true;
    if (norm(card.orientation).includes(query)) return true;
    if (card.arcana && norm(card.arcana).includes(query)) return true;
  }

  // Spread type label
  const spreadLabel = reading.spread_type === 'daily' ? 'daily draw' : '3-card spread';
  if (spreadLabel.includes(query)) return true;

  // Date (formatted)
  const dateStr = new Date(reading.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  if (norm(dateStr).includes(query)) return true;

  return false;
}

/**
 * Filters a flat array of readings by free-text search and spread-type chip.
 *
 * Returns the debounced query, setter, active filter, setter, and filtered list.
 * All filtering is done in a single `useMemo` pass — no intermediate arrays.
 */
export function useFilteredReadings(readings: ReadingRow[]) {
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [spreadFilter, setSpreadFilter] = useState<SpreadFilter>('all');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the search input so filtering doesn't fire on every keystroke
  const onChangeSearch = useCallback((text: string) => {
    setRawQuery(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(text), DEBOUNCE_MS);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const clearSearch = useCallback(() => {
    setRawQuery('');
    setDebouncedQuery('');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const filtered = useMemo(() => {
    const query = norm(debouncedQuery);
    const hasQuery = query.length > 0;
    const hasSpread = spreadFilter !== 'all';

    // Fast path: no filters active
    if (!hasQuery && !hasSpread) return readings;

    return readings.filter((r) => {
      if (hasSpread && r.spread_type !== spreadFilter) return false;
      if (hasQuery && !matchesSearch(r, query)) return false;
      return true;
    });
  }, [readings, debouncedQuery, spreadFilter]);

  return {
    /** The raw (non-debounced) query for display in the TextInput */
    query: rawQuery,
    onChangeSearch,
    clearSearch,
    spreadFilter,
    setSpreadFilter,
    filtered,
    /** True when the debounced query hasn't caught up to the raw input yet */
    isDebouncing: rawQuery !== debouncedQuery,
  } as const;
}
