export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

interface AstrologyData {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
}

/**
 * Calculate sun sign from birth date
 */
export function calculateSunSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

/**
 * Convert a calendar date to Julian Day Number.
 * Algorithm from "Astronomical Algorithms" (Jean Meeus, 2nd ed.), Chapter 7.
 */
function toJulianDay(date: Date): number {
  let Y = date.getUTCFullYear();
  let M = date.getUTCMonth() + 1;
  const D =
    date.getUTCDate() +
    (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

/**
 * Calculate moon sign from birth date using Jean Meeus mean lunar longitude.
 * Accuracy: ±1 sign at sign boundaries (moon near 0° or 30° of a sign).
 * For exact results, use an ephemeris (e.g. the daily-metaphysical edge function).
 *
 * Reference: "Astronomical Algorithms" (Meeus), Chapter 47 — Moon's mean longitude:
 *   L' = 218.3164477 + 481267.88123421·T
 * where T = Julian centuries since J2000.0.
 */
export function calculateMoonSign(birthDate: Date): ZodiacSign {
  const signs: ZodiacSign[] = [
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

  const J2000 = 2451545.0;
  const jd = toJulianDay(birthDate);
  const T = (jd - J2000) / 36525.0;

  // Moon's mean longitude in degrees
  const L = 218.3164477 + 481267.88123421 * T;

  // Normalize to [0, 360)
  const lon = ((L % 360) + 360) % 360;

  return signs[Math.floor(lon / 30)];
}

/**
 * Calculate rising sign (ascendant) based on birth time and location
 * Note: This is a simplified calculation. For accurate rising sign, use ephemeris data
 */
export function calculateRisingSign(
  birthDate: Date,
  birthTime: string,
  _birthLocation?: string
): ZodiacSign {
  const signs: ZodiacSign[] = [
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

  // Parse birth time (HH:mm format)
  const [hours, minutes] = birthTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;

  // Rising sign changes approximately every 2 hours (120 minutes)
  // This is simplified - actual calculation requires latitude/longitude
  const risingIndex = Math.floor(totalMinutes / 120) % 12;

  // Offset by day of year to add variation
  const dayOfYear = Math.floor(
    (birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const offsetIndex = (risingIndex + Math.floor(dayOfYear / 30)) % 12;

  return signs[offsetIndex];
}

/**
 * Calculate all astrology signs from birth data
 */
export function calculateAstrologyData(
  birthDate: Date,
  birthTime: string,
  birthLocation?: string
): AstrologyData {
  return {
    sunSign: calculateSunSign(birthDate),
    moonSign: calculateMoonSign(birthDate),
    risingSign: calculateRisingSign(birthDate, birthTime, birthLocation),
  };
}
