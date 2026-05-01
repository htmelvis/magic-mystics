import { getTodayBounds, getTodayDateString } from '@lib/tarot/date';

describe('getTodayDateString', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const result = getTodayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('matches today\'s date components', () => {
    const now = new Date();
    const expected = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
    expect(getTodayDateString()).toBe(expected);
  });
});

describe('getTodayBounds', () => {
  it('returns start and end as ISO strings', () => {
    const { start, end } = getTodayBounds();
    expect(() => new Date(start)).not.toThrow();
    expect(() => new Date(end)).not.toThrow();
    expect(typeof start).toBe('string');
    expect(typeof end).toBe('string');
  });

  it('start is midnight (00:00:00.000) local time', () => {
    const { start } = getTodayBounds();
    const d = new Date(start);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
  });

  it('end is end-of-day (23:59:59.999) local time', () => {
    const { end } = getTodayBounds();
    const d = new Date(end);
    expect(d.getHours()).toBe(23);
    expect(d.getMinutes()).toBe(59);
    expect(d.getSeconds()).toBe(59);
    expect(d.getMilliseconds()).toBe(999);
  });

  it('start and end fall on the same calendar date', () => {
    const { start, end } = getTodayBounds();
    const s = new Date(start);
    const e = new Date(end);
    expect(s.getFullYear()).toBe(e.getFullYear());
    expect(s.getMonth()).toBe(e.getMonth());
    expect(s.getDate()).toBe(e.getDate());
  });

  it('start is before end', () => {
    const { start, end } = getTodayBounds();
    expect(new Date(start).getTime()).toBeLessThan(new Date(end).getTime());
  });
});
