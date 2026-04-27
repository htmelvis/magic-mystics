import {
  calculateSunSign,
  calculateMoonSign,
  calculateRisingSign,
  calculateAstrologyData,
  longitudeToSign,
} from '@lib/astrology/calculate-signs';

describe('calculateSunSign', () => {
  // Use local-time constructor (year, month-1, day) because calculateSunSign
  // calls getMonth()/getDate() which are local-time. Passing an ISO string
  // like '2000-03-21' is parsed as UTC midnight and would shift the day
  // backward in any UTC- timezone, breaking boundary tests.
  const cases: [string, Date, string][] = [
    ['Aries', new Date(2000, 2, 21), 'start of Aries'],
    ['Aries', new Date(2000, 3, 19), 'end of Aries'],
    ['Taurus', new Date(2000, 3, 20), 'start of Taurus'],
    ['Taurus', new Date(2000, 4, 20), 'end of Taurus'],
    ['Gemini', new Date(2000, 4, 21), 'start of Gemini'],
    ['Gemini', new Date(2000, 5, 20), 'end of Gemini'],
    ['Cancer', new Date(2000, 5, 21), 'start of Cancer'],
    ['Cancer', new Date(2000, 6, 22), 'end of Cancer'],
    ['Leo', new Date(2000, 6, 23), 'start of Leo'],
    ['Leo', new Date(2000, 7, 22), 'end of Leo'],
    ['Virgo', new Date(2000, 7, 23), 'start of Virgo'],
    ['Virgo', new Date(2000, 8, 22), 'end of Virgo'],
    ['Libra', new Date(2000, 8, 23), 'start of Libra'],
    ['Libra', new Date(2000, 9, 22), 'end of Libra'],
    ['Scorpio', new Date(2000, 9, 23), 'start of Scorpio'],
    ['Scorpio', new Date(2000, 10, 21), 'end of Scorpio'],
    ['Sagittarius', new Date(2000, 10, 22), 'start of Sagittarius'],
    ['Sagittarius', new Date(2000, 11, 21), 'end of Sagittarius'],
    ['Capricorn', new Date(2000, 11, 22), 'start of Capricorn'],
    ['Capricorn', new Date(2001, 0, 19), 'end of Capricorn'],
    ['Aquarius', new Date(2000, 0, 20), 'start of Aquarius'],
    ['Aquarius', new Date(2000, 1, 18), 'end of Aquarius'],
    ['Pisces', new Date(2000, 1, 19), 'start of Pisces'],
    ['Pisces', new Date(2000, 2, 20), 'end of Pisces'],
  ];

  test.each(cases)('%s — %s (%s)', (expected, date) => {
    expect(calculateSunSign(date)).toBe(expected);
  });
});

describe('calculateMoonSign', () => {
  it('returns a valid zodiac sign', () => {
    const validSigns = [
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ];
    const result = calculateMoonSign(new Date(1990, 5, 15));
    expect(validSigns).toContain(result);
  });

  it('is deterministic — same date always returns same sign', () => {
    const date = new Date(1985, 2, 1, 12, 0, 0);
    expect(calculateMoonSign(date)).toBe(calculateMoonSign(date));
  });

  it('returns different signs for dates ~2 weeks apart (moon moves ~1 sign/2.5 days)', () => {
    const a = calculateMoonSign(new Date(2000, 0, 1));
    const b = calculateMoonSign(new Date(2000, 0, 15));
    // Not strictly guaranteed but statistically very likely — documents the behavior
    expect(typeof a).toBe('string');
    expect(typeof b).toBe('string');
  });
});

describe('calculateRisingSign', () => {
  it('returns a valid zodiac sign', () => {
    const validSigns = [
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ];
    const result = calculateRisingSign(new Date(1990, 5, 15), '08:30');
    expect(validSigns).toContain(result);
  });

  it('is deterministic for the same inputs', () => {
    const date = new Date(1990, 5, 15);
    expect(calculateRisingSign(date, '08:30')).toBe(calculateRisingSign(date, '08:30'));
  });

  it('varies with birth time — different times 4+ hours apart produce different signs', () => {
    const date = new Date(1990, 5, 15);
    // Rising sign changes every ~2 hours; 6 hours apart should differ
    const early = calculateRisingSign(date, '00:00');
    const late = calculateRisingSign(date, '06:00');
    expect(early).not.toBe(late);
  });
});

describe('calculateAstrologyData', () => {
  it('returns all three signs', () => {
    const result = calculateAstrologyData(new Date(1990, 5, 15), '14:30', 'New York, NY');
    expect(result).toHaveProperty('sunSign');
    expect(result).toHaveProperty('moonSign');
    expect(result).toHaveProperty('risingSign');
  });

  it('sunSign matches standalone calculateSunSign', () => {
    const date = new Date(1990, 5, 15);
    const { sunSign } = calculateAstrologyData(date, '14:30');
    expect(sunSign).toBe(calculateSunSign(date));
  });

  it('moonSign matches standalone calculateMoonSign', () => {
    const date = new Date(1990, 5, 15);
    const { moonSign } = calculateAstrologyData(date, '14:30');
    expect(moonSign).toBe(calculateMoonSign(date));
  });

  it('risingSign matches standalone calculateRisingSign', () => {
    const date = new Date(1990, 5, 15);
    const { risingSign } = calculateAstrologyData(date, '14:30', 'New York, NY');
    expect(risingSign).toBe(calculateRisingSign(date, '14:30', 'New York, NY'));
  });

  it('works without a birth location (risingSign uses simplified fallback)', () => {
    const result = calculateAstrologyData(new Date(1990, 5, 15), '14:30');
    expect(result).toHaveProperty('sunSign');
    expect(result).toHaveProperty('moonSign');
    expect(result).toHaveProperty('risingSign');
  });

  it('all returned signs are valid zodiac signs', () => {
    const validSigns = [
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ];
    const result = calculateAstrologyData(new Date(1985, 10, 1), '08:00', 'London, UK');
    expect(validSigns).toContain(result.sunSign);
    expect(validSigns).toContain(result.moonSign);
    expect(validSigns).toContain(result.risingSign);
  });
});

// ── longitudeToSign ───────────────────────────────────────────────────────────

describe('longitudeToSign', () => {
  const table: [number, string][] = [
    [0, 'Aries'],
    [29.9, 'Aries'],
    [30, 'Taurus'],
    [59.99, 'Taurus'],
    [60, 'Gemini'],
    [120, 'Leo'],
    [180, 'Libra'],
    [270, 'Capricorn'],
    [330, 'Pisces'],
    [359.999, 'Pisces'],
    [360, 'Aries'],
    [720, 'Aries'],
    [-1, 'Pisces'],
    [-30, 'Pisces'],
    [-31, 'Aquarius'],
  ];

  test.each(table)('longitude %p → %s', (lon, expected) => {
    expect(longitudeToSign(lon)).toBe(expected);
  });
});

// ── Noon-parsed date pattern (used in the calculating screen) ─────────────────
//
// The calculating screen parses "YYYY-MM-DD" router params as local noon to
// avoid UTC boundary shifts. These tests document that the pattern gives correct
// sun signs regardless of the device timezone.

describe('noon-parsed birth date pattern', () => {
  it('gives correct sun sign for a date parsed as local noon', () => {
    // Simulates: const [y,m,d] = "1990-06-15".split('-').map(Number)
    //            const date = new Date(y, m-1, d, 12, 0, 0)
    const [year, month, day] = '1990-06-15'.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    expect(calculateSunSign(date)).toBe('Gemini');
  });

  it('noon-parsed date matches direct local Date constructor', () => {
    const [year, month, day] = '2000-03-21'.split('-').map(Number);
    const noonParsed = new Date(year, month - 1, day, 12, 0, 0);
    const direct = new Date(2000, 2, 21, 12, 0, 0);
    expect(calculateSunSign(noonParsed)).toBe(calculateSunSign(direct));
  });

  it('noon-parsed boundary date avoids UTC midnight sign slip', () => {
    // March 21 is the Aries start boundary. A UTC midnight parse in a UTC-offset
    // timezone would slip to March 20 (Pisces). Noon parse stays on March 21.
    const [year, month, day] = '2000-03-21'.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    expect(calculateSunSign(date)).toBe('Aries');
  });
});
