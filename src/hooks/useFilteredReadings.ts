import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import type { ReadingRow } from '@hooks/useReadings';

export type SpreadFilter = 'all' | 'daily' | 'past-present-future';
export type DateRangeFilter =
  | 'all'
  | 'today'
  | 'this-week'
  | 'last-week'
  | 'this-month'
  | 'last-month';

const DEBOUNCE_MS = 250;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Normalises a string for case-insensitive matching.
 */
function norm(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().trim();
}

/**
 * Returns a `[start, end)` window for the given filter, or `null` for 'all'.
 * All boundaries are computed at midnight local time.
 */
function getDateRange(
  filter: DateRangeFilter
): { start: Date; end: Date } | null {
  if (filter === 'all') return null;

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  switch (filter) {
    case 'today':
      return { start: todayStart, end: tomorrowStart };

    case 'this-week': {
      const day = todayStart.getDay(); // 0 = Sun
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - day);
      return { start: weekStart, end: tomorrowStart };
    }

    case 'last-week': {
      const day = todayStart.getDay();
      const thisWeekStart = new Date(todayStart);
      thisWeekStart.setDate(thisWeekStart.getDate() - day);
      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      return { start: lastWeekStart, end: thisWeekStart };
    }

    case 'this-month': {
      const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
      return { start: monthStart, end: tomorrowStart };
    }

    case 'last-month': {
      const thisMonthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
      const lastMonthStart = new Date(todayStart.getFullYear(), todayStart.getMonth() - 1, 1);
      return { start: lastMonthStart, end: thisMonthStart };
    }
  }
}

function matchesSearch(reading: ReadingRow, query: string): boolean {
  // Card names / attributes
  for (const card of reading.drawn_cards) {
    if (norm(card.cardName).includes(query)) return true;
    if (card.suit && norm(card.suit).includes(query)) return true;
    if (norm(card.orientation).includes(query)) return true;
    if (card.arcana && norm(card.arcana).includes(query)) return true;
  }

  // Spread type label
  const spreadLabel = reading.spread_type === 'daily' ? 'daily draw' : '3-card spread';
  if (spreadLabel.includes(query)) return true;

  return false;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Filters a flat array of readings by free-text search, spread-type chip,
 * and date-range chip.
 *
 * Returns the debounced query, setters, active filters, and the filtered list.
 * All filtering is done in a single `useMemo` pass — no intermediate arrays.
 */
export function useFilteredReadings(readings: ReadingRow[]) {
  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [spreadFilter, setSpreadFilter] = useState<SpreadFilter>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>('all');
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

  const clearAllFilters = useCallback(() => {
    setSpreadFilter('all');
    setDateRangeFilter('all');
  }, []);

  const filtered = useMemo(() => {
    const query = norm(debouncedQuery);
    const hasQuery = query.length > 0;
    const hasSpread = spreadFilter !== 'all';
    const dateRange = getDateRange(dateRangeFilter);

    // Fast path: no filters active
    if (!hasQuery && !hasSpread && !dateRange) return readings;

    return readings.filter((r) => {
      if (hasSpread && r.spread_type !== spreadFilter) return false;
      if (dateRange) {
        const ts = new Date(r.created_at).getTime();
        if (ts < dateRange.start.getTime() || ts >= dateRange.end.getTime()) return false;
      }
      if (hasQuery && !matchesSearch(r, query)) return false;
      return true;
    });
  }, [readings, debouncedQuery, spreadFilter, dateRangeFilter]);

  return {
    /** The raw (non-debounced) query for display in the TextInput */
    query: rawQuery,
    onChangeSearch,
    clearSearch,
    spreadFilter,
    setSpreadFilter,
    dateRangeFilter,
    setDateRangeFilter,
    clearAllFilters,
    filtered,
    /** True when the debounced query hasn't caught up to the raw input yet */
    isDebouncing: rawQuery !== debouncedQuery,
  } as const;
}
