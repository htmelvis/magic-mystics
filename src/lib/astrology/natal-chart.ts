/**
 * Natal chart computation using the astronomia library (VSOP87B theory).
 * Accuracy: ~1 arcminute for inner planets, ~0.01° for outer planets, 2000–2050.
 *
 * API notes (verified against runtime):
 *  - solar.apparentLongitude(T)  → radians  (T = Julian centuries from J2000.0)
 *  - planetposition.Planet(data).position(jd) → {lon, lat, range} radians / AU (heliocentric)
 *  - moonposition.position(jd)   → {ra, dec} radians, geocentric equatorial
 *  - pluto.heliocentric(jd)      → {lon, lat, range} radians / AU (heliocentric)
 *  - nutation.meanObliquityLaskar(jd) → degrees
 *  - sidereal.apparent(jd)       → seconds of time
 *  - coord.Equatorial(ra,dec).toEcliptic(epsRad) → {lon, lat} radians
 *  - VSOP87B data files export `{ default: data }` — must use .default
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const {
  julian,
  solar,
  moonposition,
  planetposition,
  nutation,
  coord,
  sidereal,
  pluto: plutoModule,
} = require('astronomia');

/* eslint-disable @typescript-eslint/no-require-imports */
const vsop87Bearth = require('astronomia/data/vsop87Bearth').default;
const vsop87Bmercury = require('astronomia/data/vsop87Bmercury').default;
const vsop87Bvenus = require('astronomia/data/vsop87Bvenus').default;
const vsop87Bmars = require('astronomia/data/vsop87Bmars').default;
const vsop87Bjupiter = require('astronomia/data/vsop87Bjupiter').default;
const vsop87Bsaturn = require('astronomia/data/vsop87Bsaturn').default;
const vsop87Buranus = require('astronomia/data/vsop87Buranus').default;
const vsop87Bneptune = require('astronomia/data/vsop87Bneptune').default;
/* eslint-enable @typescript-eslint/no-require-imports */

import type { ZodiacSign } from './calculate-signs';

const RAD2DEG = 180 / Math.PI;

// Planets computed for all users; display gating is in the UI layer.
export const FREE_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'] as const;
export const PREMIUM_PLANETS = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as const;
export type PlanetName = (typeof FREE_PLANETS)[number] | (typeof PREMIUM_PLANETS)[number];

export interface PlanetPosition {
  name: PlanetName;
  glyph: string;
  longitude: number;   // 0–360 ecliptic degrees
  sign: ZodiacSign;
  degree: number;      // 0–29 within sign
  minute: number;      // 0–59
}

export interface StoredNatalChart {
  computedAt: string;
  planets: PlanetPosition[];
  ascendant: number | null;   // ecliptic longitude, null if no birth coords
  midheaven: number | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const PLANET_GLYPHS: Record<PlanetName, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
};

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function lonToPosition(name: PlanetName, longitude: number): PlanetPosition {
  const lon = normalizeDeg(longitude);
  const signIndex = Math.floor(lon / 30);
  const withinSign = lon - signIndex * 30;
  return {
    name,
    glyph: PLANET_GLYPHS[name],
    longitude: lon,
    sign: ZODIAC_SIGNS[signIndex],
    degree: Math.floor(withinSign),
    minute: Math.floor((withinSign % 1) * 60),
  };
}

/**
 * Convert heliocentric ecliptic planet position to geocentric ecliptic longitude.
 * Standard rectangular coordinate subtraction (Meeus Ch. 33).
 */
function helioToGeoLon(
  p: { lon: number; lat: number; range: number },
  earth: { lon: number; lat: number; range: number }
): number {
  const px = p.range * Math.cos(p.lat) * Math.cos(p.lon);
  const py = p.range * Math.cos(p.lat) * Math.sin(p.lon);
  const ex = earth.range * Math.cos(earth.lat) * Math.cos(earth.lon);
  const ey = earth.range * Math.cos(earth.lat) * Math.sin(earth.lon);
  return normalizeDeg(Math.atan2(py - ey, px - ex) * RAD2DEG);
}

// ── Ascendant / Midheaven ─────────────────────────────────────────────────────

/**
 * Compute Ascendant and Midheaven from RAMC, obliquity, and geographic latitude.
 * Formulas from Meeus Ch. 14 / standard astrological references.
 * Returns ecliptic longitudes in degrees [0, 360).
 */
function computeAngles(
  jd: number,
  birthLat: number,
  birthLng: number,
): { ascendant: number; midheaven: number } {
  // Apparent Greenwich Sidereal Time in seconds → convert to degrees
  const gstSec: number = sidereal.apparent(jd);
  const gstDeg = normalizeDeg((gstSec / 3600) * 15);

  // Right Ascension of the Midheaven (RAMC) in degrees
  const ramc = normalizeDeg(gstDeg + birthLng);
  const ramcRad = ramc * (Math.PI / RAD2DEG);

  const epsDeg: number = nutation.meanObliquityLaskar(jd);
  const epsRad = epsDeg * (Math.PI / RAD2DEG);
  const latRad = birthLat * (Math.PI / RAD2DEG);

  // Midheaven
  const mcRad = Math.atan2(Math.tan(ramcRad), Math.cos(epsRad));
  let mc = normalizeDeg(mcRad * RAD2DEG);
  // Ensure MC is in the correct hemisphere (same side as RAMC)
  if (Math.cos(ramcRad) < 0) mc = normalizeDeg(mc + 180);

  // Ascendant (atan2 form for correct quadrant)
  const ascRad = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(ramcRad)),
  );
  let asc = normalizeDeg(ascRad * RAD2DEG);
  // Ascendant must be in the eastern hemisphere relative to MC
  if (Math.abs(normalizeDeg(asc - mc)) < 90 || Math.abs(normalizeDeg(asc - mc)) > 270) {
    asc = normalizeDeg(asc + 180);
  }

  return { ascendant: asc, midheaven: mc };
}

// ── Timezone handling ─────────────────────────────────────────────────────────

/**
 * Convert a wall-clock moment in the given IANA zone to the equivalent UTC Date.
 * Uses Intl.DateTimeFormat to read the offset at that instant so DST is honored.
 * Returns the input unchanged if the offset can't be parsed.
 */
function shiftToUTC(wall: Date, tz: string): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'shortOffset',
  }).formatToParts(wall);
  const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const match = /GMT(?:([+-])(\d{1,2})(?::?(\d{2}))?)?/.exec(tzPart);
  if (!match) return wall;
  const sign = match[1] === '-' ? -1 : 1;
  const hrs = parseInt(match[2] ?? '0', 10);
  const mins = parseInt(match[3] ?? '0', 10);
  const offsetMin = sign * (hrs * 60 + mins);
  return new Date(wall.getTime() - offsetMin * 60_000);
}

// ── Main export ───────────────────────────────────────────────────────────────

export function computeNatalChart(
  birthDate: Date,
  birthTime: string,
  birthLat: number | null,
  birthLng: number | null,
  birthTimezone: string | null = null,
): StoredNatalChart {
  const [h, m] = birthTime.split(':').map(Number);

  let jdYear: number;
  let jdMonth: number;
  let jdFractionalDay: number;

  if (birthTimezone) {
    const wall = new Date(
      birthDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
      h,
      m,
      0,
    );
    const utc = shiftToUTC(wall, birthTimezone);
    jdYear = utc.getUTCFullYear();
    jdMonth = utc.getUTCMonth() + 1;
    jdFractionalDay = utc.getUTCDate() + (utc.getUTCHours() + utc.getUTCMinutes() / 60) / 24;
  } else {
    // No timezone known — treat the wall-clock reading as UTC. This preserves
    // historical behavior and avoids adding a per-device offset bias.
    jdYear = birthDate.getFullYear();
    jdMonth = birthDate.getMonth() + 1;
    jdFractionalDay = birthDate.getDate() + (h + m / 60) / 24;
  }

  const jd: number = julian.CalendarGregorianToJD(jdYear, jdMonth, jdFractionalDay);
  const T = (jd - 2451545.0) / 36525;

  // Shared: Earth heliocentric position for geocentric conversions
  const earthPlanet = new planetposition.Planet(vsop87Bearth);
  const earthPos: { lon: number; lat: number; range: number } = earthPlanet.position(jd);

  // Sun: geocentric = Earth helio + 180°
  const sunLon = normalizeDeg(solar.apparentLongitude(T) * RAD2DEG);

  // Moon: geocentric equatorial → ecliptic
  const moonEq = moonposition.position(jd);
  const epsDeg: number = nutation.meanObliquityLaskar(jd);
  const epsRad = epsDeg * (Math.PI / RAD2DEG);
  const moonEcl: { lon: number; lat: number } = new coord.Equatorial(moonEq.ra, moonEq.dec).toEcliptic(epsRad);
  const moonLon = normalizeDeg(moonEcl.lon * RAD2DEG);

  // Inner planets via VSOP87B
  const mercuryLon = helioToGeoLon(new planetposition.Planet(vsop87Bmercury).position(jd), earthPos);
  const venusLon   = helioToGeoLon(new planetposition.Planet(vsop87Bvenus).position(jd),   earthPos);
  const marsLon    = helioToGeoLon(new planetposition.Planet(vsop87Bmars).position(jd),    earthPos);

  // Outer planets via VSOP87B
  const jupiterLon = helioToGeoLon(new planetposition.Planet(vsop87Bjupiter).position(jd), earthPos);
  const saturnLon  = helioToGeoLon(new planetposition.Planet(vsop87Bsaturn).position(jd),  earthPos);
  const uranusLon  = helioToGeoLon(new planetposition.Planet(vsop87Buranus).position(jd),  earthPos);
  const neptuneLon = helioToGeoLon(new planetposition.Planet(vsop87Bneptune).position(jd), earthPos);

  // Pluto uses its own module (not VSOP87)
  const plutoH: { lon: number; lat: number; range: number } = plutoModule.heliocentric(jd);
  const plutoLon = helioToGeoLon(plutoH, earthPos);

  const planets: PlanetPosition[] = [
    lonToPosition('Sun',     sunLon),
    lonToPosition('Moon',    moonLon),
    lonToPosition('Mercury', mercuryLon),
    lonToPosition('Venus',   venusLon),
    lonToPosition('Mars',    marsLon),
    lonToPosition('Jupiter', jupiterLon),
    lonToPosition('Saturn',  saturnLon),
    lonToPosition('Uranus',  uranusLon),
    lonToPosition('Neptune', neptuneLon),
    lonToPosition('Pluto',   plutoLon),
  ];

  let ascendant: number | null = null;
  let midheaven: number | null = null;
  if (birthLat !== null && birthLng !== null) {
    const angles = computeAngles(jd, birthLat, birthLng);
    ascendant = angles.ascendant;
    midheaven = angles.midheaven;
  }

  return { computedAt: new Date().toISOString(), planets, ascendant, midheaven };
}
