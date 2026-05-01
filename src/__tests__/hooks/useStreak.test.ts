import { computeStreakData } from '@hooks/useStreak';

jest.mock('@lib/supabase/client', () => ({ supabase: {} }));

// Pin "today" to April 29 2026 for all tests
const TODAY_ISO = '2026-04-29T12:00:00.000Z';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(TODAY_ISO));
});

afterEach(() => {
  jest.useRealTimers();
});

// ── helpers ───────────────────────────────────────────────────────────────────

/** Creates ISO timestamps for days relative to TODAY (0 = today, -1 = yesterday, etc.) */
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}

// ── empty input ───────────────────────────────────────────────────────────────

describe('empty input', () => {
  it('returns zeros for currentStreak and longestStreak', () => {
    const { currentStreak, longestStreak } = computeStreakData([]);
    expect(currentStreak).toBe(0);
    expect(longestStreak).toBe(0);
  });

  it('returns 6 months of zero-count activity', () => {
    const { monthlyActivity } = computeStreakData([]);
    expect(monthlyActivity).toHaveLength(6);
    monthlyActivity.forEach(m => expect(m.count).toBe(0));
  });
});

// ── currentStreak ─────────────────────────────────────────────────────────────

describe('currentStreak', () => {
  it('is 1 for a single reading today', () => {
    const { currentStreak } = computeStreakData([daysAgo(0)]);
    expect(currentStreak).toBe(1);
  });

  it('is 1 for a single reading yesterday (streak survives midnight)', () => {
    const { currentStreak } = computeStreakData([daysAgo(1)]);
    expect(currentStreak).toBe(1);
  });

  it('is 0 when the last reading was 2 days ago', () => {
    const { currentStreak } = computeStreakData([daysAgo(2)]);
    expect(currentStreak).toBe(0);
  });

  it('is 2 for readings on today and yesterday', () => {
    const { currentStreak } = computeStreakData([daysAgo(0), daysAgo(1)]);
    expect(currentStreak).toBe(2);
  });

  it('counts a multi-day consecutive run ending today', () => {
    const { currentStreak } = computeStreakData([daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3)]);
    expect(currentStreak).toBe(4);
  });

  it('counts a multi-day run ending yesterday', () => {
    const { currentStreak } = computeStreakData([daysAgo(1), daysAgo(2), daysAgo(3)]);
    expect(currentStreak).toBe(3);
  });

  it('stops counting at a gap — only the tail matters', () => {
    // 5 days ago, 4 days ago, then gap, then today and yesterday
    const { currentStreak } = computeStreakData([
      daysAgo(0),
      daysAgo(1),
      daysAgo(4),
      daysAgo(5),
    ]);
    expect(currentStreak).toBe(2);
  });

  it('is 0 when the last reading is older than yesterday', () => {
    const { currentStreak } = computeStreakData([daysAgo(7), daysAgo(8), daysAgo(9)]);
    expect(currentStreak).toBe(0);
  });
});

// ── longestStreak ─────────────────────────────────────────────────────────────

describe('longestStreak', () => {
  it('is 1 for a single reading', () => {
    const { longestStreak } = computeStreakData([daysAgo(0)]);
    expect(longestStreak).toBe(1);
  });

  it('reflects the longest consecutive run, even when current streak is 0', () => {
    // 3-day run last week — not active today
    const { longestStreak, currentStreak } = computeStreakData([
      daysAgo(10),
      daysAgo(11),
      daysAgo(12),
    ]);
    expect(longestStreak).toBe(3);
    expect(currentStreak).toBe(0);
  });

  it('is updated correctly when a new streak exceeds the old longest', () => {
    // 2-day run then a 4-day run
    const { longestStreak } = computeStreakData([
      daysAgo(0),
      daysAgo(1),
      daysAgo(2),
      daysAgo(3),
      daysAgo(10),
      daysAgo(11),
    ]);
    expect(longestStreak).toBe(4);
  });
});

// ── deduplication ─────────────────────────────────────────────────────────────

describe('deduplication', () => {
  it('counts multiple readings on the same day as a single streak day', () => {
    // Three readings today at different times should still be streak = 1
    const { currentStreak } = computeStreakData([
      '2026-04-29T08:00:00.000Z',
      '2026-04-29T14:00:00.000Z',
      '2026-04-29T20:00:00.000Z',
    ]);
    expect(currentStreak).toBe(1);
  });

  it('does not inflate longestStreak when same-day readings are deduplicated', () => {
    const { longestStreak } = computeStreakData([
      '2026-04-29T08:00:00.000Z',
      '2026-04-29T14:00:00.000Z',
    ]);
    expect(longestStreak).toBe(1);
  });
});

// ── monthlyActivity ───────────────────────────────────────────────────────────

describe('monthlyActivity', () => {
  it('always returns 6 months', () => {
    const { monthlyActivity } = computeStreakData([daysAgo(0), daysAgo(1)]);
    expect(monthlyActivity).toHaveLength(6);
  });

  it('counts readings in the current month correctly', () => {
    // 3 readings in April 2026
    const dates = ['2026-04-01T12:00:00.000Z', '2026-04-15T12:00:00.000Z', daysAgo(0)];
    const { monthlyActivity } = computeStreakData(dates);
    const april = monthlyActivity[monthlyActivity.length - 1]; // last bucket = current month
    expect(april.count).toBe(3);
  });

  it('counts readings in a prior month bucket correctly', () => {
    // 2 readings in March 2026 (1 month ago = index 4)
    const dates = ['2026-03-10T12:00:00.000Z', '2026-03-25T12:00:00.000Z'];
    const { monthlyActivity } = computeStreakData(dates);
    const march = monthlyActivity[monthlyActivity.length - 2]; // second-to-last = previous month
    expect(march.count).toBe(2);
  });

  it('gives 0 for months with no readings', () => {
    const { monthlyActivity } = computeStreakData([daysAgo(0)]);
    // All months except the current one should be 0
    const nonCurrent = monthlyActivity.slice(0, -1);
    nonCurrent.forEach(m => expect(m.count).toBe(0));
  });
});
