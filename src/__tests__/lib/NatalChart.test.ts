import {
  computeNatalChart,
  FREE_PLANETS,
  PREMIUM_PLANETS,
  type PlanetName,
  type PlanetPosition,
  type StoredNatalChart,
} from '@lib/astrology/natal-chart';

const VALID_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const ALL_PLANETS: PlanetName[] = [...FREE_PLANETS, ...PREMIUM_PLANETS];

const PLANET_GLYPHS: Record<PlanetName, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
};

// Reference birth data: 1990-06-15, noon, New York-ish coords
const BIRTH_DATE = new Date(1990, 5, 15, 12, 0, 0); // local noon, June 15 1990
const BIRTH_TIME = '12:00';
const BIRTH_LAT = 40.7128;
const BIRTH_LNG = -74.0060;

// ── Planet constants ───────────────────────────────────────────────────────────

describe('FREE_PLANETS', () => {
  it('contains exactly Sun, Moon, Mercury, Venus, Mars', () => {
    expect([...FREE_PLANETS]).toEqual(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']);
  });
});

describe('PREMIUM_PLANETS', () => {
  it('contains exactly Jupiter, Saturn, Uranus, Neptune, Pluto', () => {
    expect([...PREMIUM_PLANETS]).toEqual(['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']);
  });

  it('has no overlap with FREE_PLANETS', () => {
    const freeSet = new Set<PlanetName>(FREE_PLANETS);
    PREMIUM_PLANETS.forEach((p) => expect(freeSet.has(p)).toBe(false));
  });
});

// ── computeNatalChart — output shape ──────────────────────────────────────────

describe('computeNatalChart', () => {
  let chart: StoredNatalChart;

  beforeAll(() => {
    chart = computeNatalChart(BIRTH_DATE, BIRTH_TIME, BIRTH_LAT, BIRTH_LNG);
  });

  it('returns a computedAt ISO timestamp', () => {
    expect(chart.computedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(() => new Date(chart.computedAt)).not.toThrow();
    expect(new Date(chart.computedAt).getTime()).not.toBeNaN();
  });

  it('returns all 10 planets', () => {
    const names = chart.planets.map((p) => p.name);
    expect(names).toHaveLength(10);
    ALL_PLANETS.forEach((planet) => expect(names).toContain(planet));
  });

  it('lists planets in canonical order (free then premium)', () => {
    const names = chart.planets.map((p) => p.name);
    expect(names).toEqual([...FREE_PLANETS, ...PREMIUM_PLANETS]);
  });

  describe.each(ALL_PLANETS)('%s position', (planetName) => {
    let pos: PlanetPosition;

    beforeAll(() => {
      pos = chart.planets.find((p) => p.name === planetName)!;
    });

    it('has the correct glyph', () => {
      expect(pos.glyph).toBe(PLANET_GLYPHS[planetName]);
    });

    it('has longitude in [0, 360)', () => {
      expect(pos.longitude).toBeGreaterThanOrEqual(0);
      expect(pos.longitude).toBeLessThan(360);
    });

    it('has a valid zodiac sign', () => {
      expect(VALID_SIGNS).toContain(pos.sign);
    });

    it('has degree in [0, 30)', () => {
      expect(pos.degree).toBeGreaterThanOrEqual(0);
      expect(pos.degree).toBeLessThan(30);
    });

    it('has minute in [0, 60)', () => {
      expect(pos.minute).toBeGreaterThanOrEqual(0);
      expect(pos.minute).toBeLessThan(60);
    });

    it('sign is consistent with longitude', () => {
      const expectedSignIndex = Math.floor(pos.longitude / 30);
      expect(pos.sign).toBe(VALID_SIGNS[expectedSignIndex]);
    });

    it('degree is consistent with longitude', () => {
      const expectedDegree = Math.floor(pos.longitude % 30);
      expect(pos.degree).toBe(expectedDegree);
    });
  });

  // ── Ascendant / Midheaven ──────────────────────────────────────────────────

  describe('ascendant and midheaven', () => {
    it('are non-null when birth coords are provided', () => {
      expect(chart.ascendant).not.toBeNull();
      expect(chart.midheaven).not.toBeNull();
    });

    it('ascendant is in [0, 360)', () => {
      expect(chart.ascendant!).toBeGreaterThanOrEqual(0);
      expect(chart.ascendant!).toBeLessThan(360);
    });

    it('midheaven is in [0, 360)', () => {
      expect(chart.midheaven!).toBeGreaterThanOrEqual(0);
      expect(chart.midheaven!).toBeLessThan(360);
    });

    it('are null when no birth coords are provided', () => {
      const chartNoCoords = computeNatalChart(BIRTH_DATE, BIRTH_TIME, null, null);
      expect(chartNoCoords.ascendant).toBeNull();
      expect(chartNoCoords.midheaven).toBeNull();
    });

    it('still returns all 10 planets when coords are null', () => {
      const chartNoCoords = computeNatalChart(BIRTH_DATE, BIRTH_TIME, null, null);
      expect(chartNoCoords.planets).toHaveLength(10);
    });
  });

  // ── Determinism ───────────────────────────────────────────────────────────

  describe('determinism', () => {
    it('returns identical planet longitudes for the same inputs', () => {
      const a = computeNatalChart(BIRTH_DATE, BIRTH_TIME, BIRTH_LAT, BIRTH_LNG);
      const b = computeNatalChart(BIRTH_DATE, BIRTH_TIME, BIRTH_LAT, BIRTH_LNG);
      a.planets.forEach((planet, i) => {
        expect(planet.longitude).toBe(b.planets[i].longitude);
      });
    });

    it('returns different sun longitude for a different birth date', () => {
      const other = computeNatalChart(new Date(1990, 11, 15, 12, 0, 0), BIRTH_TIME, BIRTH_LAT, BIRTH_LNG);
      const sunA = chart.planets.find((p) => p.name === 'Sun')!.longitude;
      const sunB = other.planets.find((p) => p.name === 'Sun')!.longitude;
      expect(sunA).not.toBeCloseTo(sunB, 0);
    });

    it('returns different angles for different birth locations', () => {
      const london = computeNatalChart(BIRTH_DATE, BIRTH_TIME, 51.5074, -0.1278);
      expect(london.ascendant).not.toBeCloseTo(chart.ascendant!, 0);
    });

    it('shifts the ascendant when a timezone is supplied', () => {
      // Same wall-clock time in NYC vs. UTC: the underlying UTC instants differ
      // by the NYC offset, producing a different sidereal time and thus a
      // different Ascendant.
      const noTz = computeNatalChart(BIRTH_DATE, BIRTH_TIME, BIRTH_LAT, BIRTH_LNG);
      const withTz = computeNatalChart(
        BIRTH_DATE,
        BIRTH_TIME,
        BIRTH_LAT,
        BIRTH_LNG,
        'America/New_York',
      );
      expect(withTz.ascendant).not.toBeCloseTo(noTz.ascendant!, 1);
    });
  });

  // ── Sun sign spot-check ───────────────────────────────────────────────────

  it('Sun is in Gemini for a June 15 birth (90–119° range)', () => {
    const sun = chart.planets.find((p) => p.name === 'Sun')!;
    // Gemini occupies 60°–90° ecliptic; expect sun around 84° for mid-June
    expect(sun.sign).toBe('Gemini');
  });
});
