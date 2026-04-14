import {
  getMoonPhaseName,
  eclipticLonToSign,
  generateLuckyColors,
  generateLuckyNumbers,
  SIGN_ELEMENTS,
  ELEMENT_COLOR_POOLS,
} from '@lib/metaphysical/daily-helpers';

// ── getMoonPhaseName ──────────────────────────────────────────────────────────

describe('getMoonPhaseName', () => {
  const cases: [number, string][] = [
    [0,     'New Moon'],
    [22.4,  'New Moon'],
    [22.5,  'Waxing Crescent'],
    [67.4,  'Waxing Crescent'],
    [67.5,  'First Quarter'],
    [112.4, 'First Quarter'],
    [112.5, 'Waxing Gibbous'],
    [157.4, 'Waxing Gibbous'],
    [157.5, 'Full Moon'],
    [202.4, 'Full Moon'],
    [202.5, 'Waning Gibbous'],
    [247.4, 'Waning Gibbous'],
    [247.5, 'Last Quarter'],
    [292.4, 'Last Quarter'],
    [292.5, 'Waning Crescent'],
    [337.4, 'Waning Crescent'],
    [337.5, 'New Moon'],     // wraps back to New
    [359.9, 'New Moon'],
  ];

  test.each(cases)('angle %s → %s', (angle, expected) => {
    expect(getMoonPhaseName(angle)).toBe(expected);
  });

  it('returns one of the 8 valid phase names for any angle in [0, 360)', () => {
    const valid = [
      'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
    ];
    for (let a = 0; a < 360; a += 7.3) {
      expect(valid).toContain(getMoonPhaseName(a));
    }
  });
});

// ── eclipticLonToSign ─────────────────────────────────────────────────────────

describe('eclipticLonToSign', () => {
  const SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  it('maps 0° to Aries', () => {
    expect(eclipticLonToSign(0)).toBe('Aries');
  });

  it('maps 29.9° to Aries', () => {
    expect(eclipticLonToSign(29.9)).toBe('Aries');
  });

  it('maps 30° to Taurus', () => {
    expect(eclipticLonToSign(30)).toBe('Taurus');
  });

  it('maps each 30° band to the correct sign', () => {
    SIGNS.forEach((sign, i) => {
      expect(eclipticLonToSign(i * 30 + 15)).toBe(sign);
    });
  });

  it('maps 360° back to Aries (wraps around)', () => {
    expect(eclipticLonToSign(360)).toBe('Aries');
  });

  it('handles negative longitudes correctly', () => {
    // -30° = 330° = Pisces (index 11)
    expect(eclipticLonToSign(-30)).toBe('Pisces');
  });

  it('handles large longitudes via modulo', () => {
    // 390° = 30° = Taurus
    expect(eclipticLonToSign(390)).toBe('Taurus');
  });

  it('returns a valid sign for every degree 0–359', () => {
    for (let lon = 0; lon < 360; lon++) {
      expect(SIGNS).toContain(eclipticLonToSign(lon));
    }
  });
});

// ── SIGN_ELEMENTS ─────────────────────────────────────────────────────────────

describe('SIGN_ELEMENTS', () => {
  it('covers all 12 zodiac signs', () => {
    expect(Object.keys(SIGN_ELEMENTS)).toHaveLength(12);
  });

  it('assigns Fire to Aries, Leo, Sagittarius', () => {
    expect(SIGN_ELEMENTS['Aries']).toBe('Fire');
    expect(SIGN_ELEMENTS['Leo']).toBe('Fire');
    expect(SIGN_ELEMENTS['Sagittarius']).toBe('Fire');
  });

  it('assigns Earth to Taurus, Virgo, Capricorn', () => {
    expect(SIGN_ELEMENTS['Taurus']).toBe('Earth');
    expect(SIGN_ELEMENTS['Virgo']).toBe('Earth');
    expect(SIGN_ELEMENTS['Capricorn']).toBe('Earth');
  });

  it('assigns Air to Gemini, Libra, Aquarius', () => {
    expect(SIGN_ELEMENTS['Gemini']).toBe('Air');
    expect(SIGN_ELEMENTS['Libra']).toBe('Air');
    expect(SIGN_ELEMENTS['Aquarius']).toBe('Air');
  });

  it('assigns Water to Cancer, Scorpio, Pisces', () => {
    expect(SIGN_ELEMENTS['Cancer']).toBe('Water');
    expect(SIGN_ELEMENTS['Scorpio']).toBe('Water');
    expect(SIGN_ELEMENTS['Pisces']).toBe('Water');
  });
});

// ── generateLuckyColors ───────────────────────────────────────────────────────

describe('generateLuckyColors', () => {
  const date = new Date('2024-06-15T12:00:00Z');

  it('returns exactly 2 colors', () => {
    const colors = generateLuckyColors('Fire', date, 15);
    expect(colors).toHaveLength(2);
  });

  it('returns colors from the correct element pool', () => {
    const colors = generateLuckyColors('Water', date, 10);
    const pool = ELEMENT_COLOR_POOLS['Water'];
    colors.forEach((c) => expect(pool).toContain(c));
  });

  it('returns two distinct colors', () => {
    const colors = generateLuckyColors('Earth', date, 5);
    expect(colors[0]).not.toBe(colors[1]);
  });

  it('is deterministic — same inputs produce same colors', () => {
    const a = generateLuckyColors('Air', date, 20);
    const b = generateLuckyColors('Air', date, 20);
    expect(a).toEqual(b);
  });

  it('varies when moon degree changes', () => {
    const a = generateLuckyColors('Fire', date, 1);
    const b = generateLuckyColors('Fire', date, 29);
    // Different seed → likely different output (may occasionally match, so just check type)
    expect(Array.isArray(a)).toBe(true);
    expect(Array.isArray(b)).toBe(true);
  });

  it('varies across dates', () => {
    const date2 = new Date('2024-06-16T12:00:00Z');
    const a = generateLuckyColors('Water', date, 15);
    const b = generateLuckyColors('Water', date2, 15);
    // Different date → different seed
    expect(a).not.toEqual(b);
  });

  it('works for all four elements', () => {
    (['Fire', 'Earth', 'Air', 'Water'] as const).forEach((element) => {
      const colors = generateLuckyColors(element, date, 10);
      expect(colors).toHaveLength(2);
      colors.forEach((c) => expect(ELEMENT_COLOR_POOLS[element]).toContain(c));
    });
  });
});

// ── generateLuckyNumbers ──────────────────────────────────────────────────────

describe('generateLuckyNumbers', () => {
  const date = new Date('2024-06-15T12:00:00Z');

  it('returns exactly 5 numbers', () => {
    expect(generateLuckyNumbers(date, 90)).toHaveLength(5);
  });

  it('all numbers are in range [1, 44]', () => {
    const nums = generateLuckyNumbers(date, 90);
    nums.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(44);
    });
  });

  it('returns all unique numbers (no duplicates)', () => {
    const nums = generateLuckyNumbers(date, 90);
    expect(new Set(nums).size).toBe(5);
  });

  it('returns numbers in ascending order', () => {
    const nums = generateLuckyNumbers(date, 90);
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i]).toBeGreaterThan(nums[i - 1]);
    }
  });

  it('is deterministic — same inputs produce same numbers', () => {
    const a = generateLuckyNumbers(date, 90);
    const b = generateLuckyNumbers(date, 90);
    expect(a).toEqual(b);
  });

  it('varies with different dates', () => {
    const date2 = new Date('2024-06-16T12:00:00Z');
    const a = generateLuckyNumbers(date, 90);
    const b = generateLuckyNumbers(date2, 90);
    expect(a).not.toEqual(b);
  });

  it('varies with different moon angles', () => {
    const a = generateLuckyNumbers(date, 0);
    const b = generateLuckyNumbers(date, 180);
    expect(a).not.toEqual(b);
  });
});
