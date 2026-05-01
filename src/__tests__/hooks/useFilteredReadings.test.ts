import { renderHook, act } from '@testing-library/react-native';
import { useFilteredReadings } from '@hooks/useFilteredReadings';
import type { ReadingRow } from '@hooks/useReadings';
import type { DrawnCardRecord } from '@/types/tarot';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeCard(overrides: Partial<DrawnCardRecord> = {}): DrawnCardRecord {
  return {
    cardId: 1,
    cardName: 'The Fool',
    arcana: 'Major',
    suit: null,
    orientation: 'upright',
    position: null,
    ...overrides,
  };
}

function makeReading(overrides: Partial<ReadingRow> = {}): ReadingRow {
  return {
    id: crypto.randomUUID(),
    spread_type: 'daily',
    drawn_cards: [makeCard()],
    ai_insight: null,
    created_at: '2026-04-15T12:00:00.000Z',
    ...overrides,
  };
}

// Pinned "today" for all date-range tests: Wednesday, April 15 2026
const TODAY = new Date('2026-04-15T12:00:00.000Z');

// ── Fast path ─────────────────────────────────────────────────────────────────

describe('fast path — no active filters', () => {
  it('returns the exact same array reference when no filters are set', () => {
    const readings = [makeReading(), makeReading()];
    const { result } = renderHook(() => useFilteredReadings(readings));
    expect(result.current.filtered).toBe(readings);
  });

  it('isDebouncing is false on mount', () => {
    const { result } = renderHook(() => useFilteredReadings([]));
    expect(result.current.isDebouncing).toBe(false);
  });
});

// ── Spread filter ─────────────────────────────────────────────────────────────

describe('spreadFilter', () => {
  const daily = makeReading({ spread_type: 'daily' });
  const ppf = makeReading({ spread_type: 'past-present-future' });
  const readings = [daily, ppf];

  it('shows only daily readings when filter is "daily"', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    act(() => result.current.setSpreadFilter('daily'));
    expect(result.current.filtered).toEqual([daily]);
  });

  it('shows only spread readings when filter is "past-present-future"', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    act(() => result.current.setSpreadFilter('past-present-future'));
    expect(result.current.filtered).toEqual([ppf]);
  });

  it('shows all readings when filter is "all"', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    act(() => {
      result.current.setSpreadFilter('daily');
      result.current.setSpreadFilter('all');
    });
    expect(result.current.filtered).toBe(readings);
  });
});

// ── Search ────────────────────────────────────────────────────────────────────

describe('search', () => {
  jest.useFakeTimers();

  const tower = makeReading({ drawn_cards: [makeCard({ cardName: 'The Tower', arcana: 'Major' })] });
  const foolWands = makeReading({
    drawn_cards: [makeCard({ cardName: 'Ace of Wands', arcana: 'Minor', suit: 'Wands' })],
  });
  const reversed = makeReading({
    drawn_cards: [makeCard({ cardName: 'The Moon', orientation: 'reversed' })],
  });
  const ppf = makeReading({ spread_type: 'past-present-future' });
  const readings = [tower, foolWands, reversed, ppf];

  afterEach(() => jest.clearAllTimers());

  function search(result: { current: ReturnType<typeof useFilteredReadings> }, query: string) {
    act(() => result.current.onChangeSearch(query));
    act(() => jest.advanceTimersByTime(250));
  }

  it('filters by card name (case-insensitive)', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    search(result, 'tower');
    expect(result.current.filtered).toEqual([tower]);
  });

  it('matches partial card names', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    search(result, 'wand');
    expect(result.current.filtered).toEqual([foolWands]);
  });

  it('filters by suit', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    search(result, 'wands');
    expect(result.current.filtered).toContain(foolWands);
  });

  it('filters by orientation', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    search(result, 'reversed');
    expect(result.current.filtered).toEqual([reversed]);
  });

  it('filters by spread type label — daily draw', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    search(result, 'daily draw');
    expect(result.current.filtered).toEqual(expect.arrayContaining([tower, foolWands, reversed]));
    expect(result.current.filtered).not.toContain(ppf);
  });

  it('filters by spread type label — 3-card spread', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    search(result, '3-card spread');
    expect(result.current.filtered).toEqual([ppf]);
  });

  it('returns empty array when nothing matches', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    search(result, 'xyzzy');
    expect(result.current.filtered).toHaveLength(0);
  });

  it('isDebouncing is true immediately after typing', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    act(() => result.current.onChangeSearch('tower'));
    expect(result.current.isDebouncing).toBe(true);
  });

  it('isDebouncing becomes false after 250ms', () => {
    const { result } = renderHook(() => useFilteredReadings(readings));
    act(() => result.current.onChangeSearch('tower'));
    act(() => jest.advanceTimersByTime(250));
    expect(result.current.isDebouncing).toBe(false);
  });
});

// ── Date range filter ─────────────────────────────────────────────────────────

describe('dateRangeFilter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(TODAY);
  });
  afterEach(() => jest.useRealTimers());

  // April 15 2026 is a Wednesday (day=3), so this week starts Sunday April 12
  const todayReading    = makeReading({ created_at: '2026-04-15T08:00:00.000Z' });
  const yesterdayReading = makeReading({ created_at: '2026-04-14T08:00:00.000Z' });
  const thisWeekReading  = makeReading({ created_at: '2026-04-13T08:00:00.000Z' }); // Monday
  const weekStartReading = makeReading({ created_at: '2026-04-12T08:00:00.000Z' }); // Sunday
  const lastWeekReading  = makeReading({ created_at: '2026-04-08T08:00:00.000Z' }); // Wed last week
  const lastMonthReading = makeReading({ created_at: '2026-03-10T08:00:00.000Z' });
  const oldReading       = makeReading({ created_at: '2026-02-01T08:00:00.000Z' });

  const all = [todayReading, yesterdayReading, thisWeekReading, weekStartReading, lastWeekReading, lastMonthReading, oldReading];

  it('"today" shows only readings from today', () => {
    const { result } = renderHook(() => useFilteredReadings(all));
    act(() => result.current.setDateRangeFilter('today'));
    expect(result.current.filtered).toEqual([todayReading]);
  });

  it('"this-week" includes readings from Sunday through today', () => {
    const { result } = renderHook(() => useFilteredReadings(all));
    act(() => result.current.setDateRangeFilter('this-week'));
    const ids = result.current.filtered.map(r => r.id);
    expect(ids).toContain(todayReading.id);
    expect(ids).toContain(yesterdayReading.id);
    expect(ids).toContain(thisWeekReading.id);
    expect(ids).toContain(weekStartReading.id);
    expect(ids).not.toContain(lastWeekReading.id);
  });

  it('"last-week" shows only the previous Sunday–Saturday window', () => {
    const { result } = renderHook(() => useFilteredReadings(all));
    act(() => result.current.setDateRangeFilter('last-week'));
    const ids = result.current.filtered.map(r => r.id);
    expect(ids).toContain(lastWeekReading.id);
    expect(ids).not.toContain(weekStartReading.id); // this week's Sunday
    expect(ids).not.toContain(todayReading.id);
  });

  it('"this-month" shows readings from April 1 through today', () => {
    const { result } = renderHook(() => useFilteredReadings(all));
    act(() => result.current.setDateRangeFilter('this-month'));
    const ids = result.current.filtered.map(r => r.id);
    expect(ids).toContain(todayReading.id);
    expect(ids).toContain(weekStartReading.id);
    expect(ids).not.toContain(lastMonthReading.id);
  });

  it('"last-month" shows only March readings', () => {
    const { result } = renderHook(() => useFilteredReadings(all));
    act(() => result.current.setDateRangeFilter('last-month'));
    const ids = result.current.filtered.map(r => r.id);
    expect(ids).toContain(lastMonthReading.id);
    expect(ids).not.toContain(todayReading.id);
    expect(ids).not.toContain(oldReading.id);
  });
});

// ── clearSearch / clearAllFilters ─────────────────────────────────────────────

describe('clearSearch', () => {
  it('resets query and filtered list', () => {
    jest.useFakeTimers();
    const tower = makeReading({ drawn_cards: [makeCard({ cardName: 'The Tower' })] });
    const fool  = makeReading({ drawn_cards: [makeCard({ cardName: 'The Fool' })] });
    const readings = [tower, fool];
    const { result } = renderHook(() => useFilteredReadings(readings));

    act(() => result.current.onChangeSearch('tower'));
    act(() => jest.advanceTimersByTime(250));
    expect(result.current.filtered).toHaveLength(1);

    act(() => result.current.clearSearch());
    expect(result.current.query).toBe('');
    expect(result.current.filtered).toBe(readings);
    jest.useRealTimers();
  });
});

describe('clearAllFilters', () => {
  it('resets spreadFilter and dateRangeFilter to "all"', () => {
    jest.useFakeTimers();
    jest.setSystemTime(TODAY);
    const readings = [makeReading(), makeReading({ spread_type: 'past-present-future' })];
    const { result } = renderHook(() => useFilteredReadings(readings));

    act(() => {
      result.current.setSpreadFilter('daily');
      result.current.setDateRangeFilter('today');
    });
    expect(result.current.filtered).toHaveLength(1);

    act(() => result.current.clearAllFilters());
    expect(result.current.spreadFilter).toBe('all');
    expect(result.current.dateRangeFilter).toBe('all');
    expect(result.current.filtered).toBe(readings);
    jest.useRealTimers();
  });
});

// ── Combined filters ──────────────────────────────────────────────────────────

describe('combined filters', () => {
  it('applies spread + search together', () => {
    jest.useFakeTimers();
    const dailyTower = makeReading({
      spread_type: 'daily',
      drawn_cards: [makeCard({ cardName: 'The Tower' })],
    });
    const dailyFool = makeReading({
      spread_type: 'daily',
      drawn_cards: [makeCard({ cardName: 'The Fool' })],
    });
    const ppfTower = makeReading({
      spread_type: 'past-present-future',
      drawn_cards: [makeCard({ cardName: 'The Tower' })],
    });
    const readings = [dailyTower, dailyFool, ppfTower];
    const { result } = renderHook(() => useFilteredReadings(readings));

    act(() => {
      result.current.setSpreadFilter('daily');
      result.current.onChangeSearch('tower');
    });
    act(() => jest.advanceTimersByTime(250));

    expect(result.current.filtered).toEqual([dailyTower]);
    jest.useRealTimers();
  });
});
