import { localDateString, localDayBounds } from '@lib/utils/date';

describe('localDateString', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(localDateString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('formats the provided date in local time', () => {
    // A fixed local date — use Date constructor which takes local components
    const d = new Date(2026, 3, 30); // April 30, 2026 local midnight
    expect(localDateString(d)).toBe('2026-04-30');
  });

  it('returns local date, not UTC date, when offset is non-zero', () => {
    // Simulate 9 PM local time in UTC-4 (= 1 AM UTC next day).
    // Spy on the local getters that localDateString() uses to verify it reads
    // local time rather than calling toISOString() which would return the UTC date.
    const spyYear = jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2026);
    const spyMonth = jest.spyOn(Date.prototype, 'getMonth').mockReturnValue(3); // April
    const spyDay = jest.spyOn(Date.prototype, 'getDate').mockReturnValue(30);

    try {
      const result = localDateString(new Date());
      expect(result).toBe('2026-04-30');
      expect(result).not.toBe('2026-05-01');
    } finally {
      spyYear.mockRestore();
      spyMonth.mockRestore();
      spyDay.mockRestore();
    }
  });
});

describe('localDayBounds', () => {
  it('returns ISO strings', () => {
    const { start, end } = localDayBounds();
    expect(start).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(end).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('start is before end', () => {
    const { start, end } = localDayBounds();
    expect(new Date(start).getTime()).toBeLessThan(new Date(end).getTime());
  });

  it('start represents local midnight', () => {
    const now = new Date(2026, 3, 30, 14, 0, 0); // April 30 2pm local
    const { start } = localDayBounds(now);
    // Parsed back to a Date, its local hours should be 0
    const startDate = new Date(start);
    expect(startDate.getHours()).toBe(0);
    expect(startDate.getMinutes()).toBe(0);
    expect(startDate.getSeconds()).toBe(0);
  });

  it('end represents local 23:59:59.999', () => {
    const now = new Date(2026, 3, 30, 14, 0, 0);
    const { end } = localDayBounds(now);
    const endDate = new Date(end);
    expect(endDate.getHours()).toBe(23);
    expect(endDate.getMinutes()).toBe(59);
    expect(endDate.getSeconds()).toBe(59);
  });
});

describe('yesterday is one calendar day before today', () => {
  it('localDateString with yesterday date differs from today', () => {
    const now = new Date();
    const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    expect(localDateString(yest)).not.toBe(localDateString(now));
  });

  it('yesterday is exactly the prior calendar date', () => {
    // Use a fixed date to avoid month-boundary edge cases
    const today = new Date(2026, 3, 30); // April 30
    const yest = new Date(2026, 3, 29); // April 29
    expect(localDateString(yest)).toBe('2026-04-29');
    expect(localDateString(today)).toBe('2026-04-30');
  });

  it('rolls back across month boundary correctly', () => {
    const may1 = new Date(2026, 4, 1); // May 1
    const apr30 = new Date(may1.getFullYear(), may1.getMonth(), may1.getDate() - 1);
    expect(localDateString(apr30)).toBe('2026-04-30');
  });
});
