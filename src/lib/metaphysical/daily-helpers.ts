/**
 * Pure helper functions for daily metaphysical data generation.
 * Extracted from supabase/functions/daily-metaphysical/index.ts so they can be
 * unit-tested with Jest. These have no external dependencies.
 */

const ZODIAC_SIGNS = [
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
] as const;

export type DailyZodiacSign = (typeof ZODIAC_SIGNS)[number];
export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';

export const SIGN_ELEMENTS: Record<DailyZodiacSign, ZodiacElement> = {
  Aries: 'Fire',
  Leo: 'Fire',
  Sagittarius: 'Fire',
  Taurus: 'Earth',
  Virgo: 'Earth',
  Capricorn: 'Earth',
  Gemini: 'Air',
  Libra: 'Air',
  Aquarius: 'Air',
  Cancer: 'Water',
  Scorpio: 'Water',
  Pisces: 'Water',
};

export const ELEMENT_COLOR_POOLS: Record<ZodiacElement, string[]> = {
  Fire: ['Red', 'Orange', 'Gold', 'Crimson', 'Amber', 'Scarlet'],
  Earth: ['Green', 'Brown', 'Amber', 'Emerald', 'Copper', 'Olive'],
  Air: ['Yellow', 'Silver', 'Lavender', 'White', 'Cyan', 'Lilac'],
  Water: ['Blue', 'Indigo', 'Teal', 'Violet', 'Pearl', 'Cobalt'],
};

/**
 * Maps a moon phase angle [0, 360) to a human-readable phase name.
 * Phase angle: 0=New, 90=First Quarter, 180=Full, 270=Last Quarter.
 */
export function getMoonPhaseName(angle: number): string {
  if (angle < 22.5 || angle >= 337.5) return 'New Moon';
  if (angle < 67.5) return 'Waxing Crescent';
  if (angle < 112.5) return 'First Quarter';
  if (angle < 157.5) return 'Waxing Gibbous';
  if (angle < 202.5) return 'Full Moon';
  if (angle < 247.5) return 'Waning Gibbous';
  if (angle < 292.5) return 'Last Quarter';
  return 'Waning Crescent';
}

/** Converts an ecliptic longitude in degrees to the corresponding zodiac sign. */
export function eclipticLonToSign(lon: number): DailyZodiacSign {
  const normalized = ((lon % 360) + 360) % 360;
  return ZODIAC_SIGNS[Math.floor(normalized / 30)];
}

/**
 * Picks 2 lucky colors from the element's pool seeded by date + moon degree.
 * Deterministic: same inputs always produce the same colors.
 */
export function generateLuckyColors(
  element: ZodiacElement,
  date: Date,
  moonDegreeInSign: number,
): string[] {
  const pool = ELEMENT_COLOR_POOLS[element];
  const base =
    date.getUTCFullYear() * 10000 +
    (date.getUTCMonth() + 1) * 100 +
    date.getUTCDate() +
    Math.floor(moonDegreeInSign * 10);

  const i1 = (base ^ 0x9e3779b9) % pool.length;
  const i2 = (base ^ 0x6c62272e) % pool.length;
  const second = i1 === i2 ? (i2 + 1) % pool.length : i2;
  return [pool[Math.abs(i1)], pool[Math.abs(second)]];
}

/**
 * Generates 5 unique lucky numbers in [1, 44], seeded by date + moon phase.
 * Deterministic: same inputs always produce the same numbers.
 */
export function generateLuckyNumbers(date: Date, moonAngle: number): number[] {
  let s =
    ((date.getUTCFullYear() * 10000 +
      (date.getUTCMonth() + 1) * 100 +
      date.getUTCDate() +
      Math.floor(moonAngle)) ^
      0x9e3779b9) >>>
    0;

  const nums = new Set<number>();
  while (nums.size < 5) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s = s >>> 0;
    nums.add((s % 44) + 1);
  }
  return [...nums].sort((a, b) => a - b);
}
