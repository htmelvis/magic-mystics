/**
 * Daily Metaphysical Data Generator
 *
 * Runs once per day (scheduled via pg_cron at 00:01 UTC).
 * Computes astronomical data using VSOP87-accuracy algorithms (astronomy-engine),
 * generates an energy theme and advice via Claude Haiku, then upserts one row
 * into daily_metaphysical_data.
 *
 * Query params:
 *   ?date=YYYY-MM-DD  — override the target date (useful for backfilling)
 *   ?force=true       — regenerate even if a row already exists for the date
 *
 * Idempotent by default: returns 200 with status "already_exists" if a row
 * for the date is already present. Pass ?force=true to overwrite.
 */

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk@0.35';
import * as Astronomy from 'npm:astronomy-engine@2';
import {
  eclipticLonToSign,
  generateLuckyColors,
  generateLuckyNumbers,
  SIGN_ELEMENTS,
} from '../_shared/daily-helpers.ts';

// Planets to check for retrograde (outer planets only — Sun/Moon don't retrograde)
const PLANETS = [
  { body: Astronomy.Body.Mercury, name: 'Mercury' },
  { body: Astronomy.Body.Venus, name: 'Venus' },
  { body: Astronomy.Body.Mars, name: 'Mars' },
  { body: Astronomy.Body.Jupiter, name: 'Jupiter' },
  { body: Astronomy.Body.Saturn, name: 'Saturn' },
  { body: Astronomy.Body.Uranus, name: 'Uranus' },
  { body: Astronomy.Body.Neptune, name: 'Neptune' },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

// Traditional full moon names by calendar month (UTC)
const MONTHLY_MOON_NAMES: Record<number, string> = {
  1: 'Wolf Moon',
  2: 'Snow Moon',
  3: 'Worm Moon',
  4: 'Pink Moon',
  5: 'Flower Moon',
  6: 'Strawberry Moon',
  7: 'Buck Moon',
  8: 'Sturgeon Moon',
  9: 'Corn Moon',
  10: "Hunter's Moon",
  11: 'Beaver Moon',
  12: 'Cold Moon',
};

/**
 * Computes the special cultural/astronomical name for a Full Moon day.
 * Returns null for non-full-moon days (caller must gate on moonPhaseName).
 *
 * Composition: [Super] [Blue] [Blood] <BaseName>
 * Base precedence: Harvest Moon > Hunter's Moon > monthly traditional name
 */
function computeMoonSpecialName(noonDate: Date, moonVec: Astronomy.Vector): string | null {
  const dayStart = new Date(noonDate);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(noonDate);
  dayEnd.setUTCHours(23, 59, 59, 999);
  const year = noonDate.getUTCFullYear();
  const month = noonDate.getUTCMonth() + 1; // 1-indexed

  // ── Base name ──────────────────────────────────────────────────────────────
  let baseName = MONTHLY_MOON_NAMES[month] ?? 'Full Moon';

  // Harvest Moon: full moon nearest the autumnal equinox (can be Sep or Oct)
  const equinox = Astronomy.Seasons(year).sep_equinox.date;
  // Full moon in the ~30 days preceding the equinox
  const fullMoon1 = Astronomy.SearchMoonPhase(
    180,
    new Date(equinox.getTime() - 30 * 86400000),
    30
  );
  // Full moon in the ~30 days following that one
  const fullMoon2 = fullMoon1
    ? Astronomy.SearchMoonPhase(180, new Date(fullMoon1.date.getTime() + 86400000), 35)
    : null;

  if (fullMoon1) {
    const diff1 = Math.abs(fullMoon1.date.getTime() - equinox.getTime());
    const diff2 = fullMoon2
      ? Math.abs(fullMoon2.date.getTime() - equinox.getTime())
      : Infinity;
    const harvestDate = (diff1 <= diff2 ? fullMoon1 : fullMoon2!).date;

    if (harvestDate >= dayStart && harvestDate <= dayEnd) {
      baseName = 'Harvest Moon';
    } else {
      // Hunter's Moon: the full moon immediately following the Harvest Moon
      const hunterFull = Astronomy.SearchMoonPhase(
        180,
        new Date(harvestDate.getTime() + 86400000),
        35
      );
      if (hunterFull && hunterFull.date >= dayStart && hunterFull.date <= dayEnd) {
        baseName = "Hunter's Moon";
      }
    }
  }

  // ── Modifiers ──────────────────────────────────────────────────────────────
  const prefixes: string[] = [];

  // Super Moon: moon distance ≤ 360,000 km at the moment of the full moon
  const distKm =
    Math.sqrt(moonVec.x ** 2 + moonVec.y ** 2 + moonVec.z ** 2) * 149597870.7;
  if (distKm <= 360000) prefixes.push('Super');

  // Blue Moon: second full moon in the same UTC calendar month
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const priorFull = Astronomy.SearchMoonPhase(180, firstOfMonth, 30);
  if (priorFull && priorFull.date < dayStart) prefixes.push('Blue');

  // Blood Moon: total lunar eclipse whose peak falls on this UTC calendar day
  try {
    const eclipse = Astronomy.NextLunarEclipse(dayStart);
    if (
      eclipse.kind === 'total' &&
      eclipse.peak.date >= dayStart &&
      eclipse.peak.date <= dayEnd
    ) {
      prefixes.push('Blood');
    }
  } catch {
    // eclipse detection unavailable — skip silently
  }

  // ── Compose ────────────────────────────────────────────────────────────────
  return prefixes.length > 0 ? `${prefixes.join(' ')} ${baseName}` : baseName;
}

// Primary phases are point-in-time events. A day is labeled with a primary
// phase name only when the exact event (Moon reaching 0°/90°/180°/270°) falls
// within that UTC calendar day, matching how Google and standard apps label it.
const PRIMARY_PHASES = [
  { targetLon: 0, name: 'New Moon' },
  { targetLon: 90, name: 'First Quarter' },
  { targetLon: 180, name: 'Full Moon' },
  { targetLon: 270, name: 'Last Quarter' },
] as const;

function getMoonPhaseNameForDay(angle: number, noonDate: Date): string {
  const dayStart = new Date(noonDate);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(noonDate);
  dayEnd.setUTCHours(23, 59, 59, 999);

  for (const { targetLon, name } of PRIMARY_PHASES) {
    const event = Astronomy.SearchMoonPhase(targetLon, dayStart, 1.0);
    if (event !== null && event.date >= dayStart && event.date <= dayEnd) {
      return name;
    }
  }

  // No primary phase event today — determine intermediate phase from quadrant
  if (angle < 90) return 'Waxing Crescent';
  if (angle < 180) return 'Waxing Gibbous';
  if (angle < 270) return 'Waning Gibbous';
  return 'Waning Crescent';
}

/** Detects if a planet is retrograde by comparing today's vs yesterday's geocentric ecliptic longitude. */
function isRetrograde(body: Astronomy.Body, today: Date, yesterday: Date): boolean {
  const todayEcl = Astronomy.Ecliptic(Astronomy.GeoVector(body, today, false));
  const yestEcl = Astronomy.Ecliptic(Astronomy.GeoVector(body, yesterday, false));

  // Normalize delta to handle the 0°/360° wrap
  let delta = todayEcl.elon - yestEcl.elon;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  return delta < 0;
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date');
    const forceRegen = url.searchParams.get('force') === 'true';

    // Use noon UTC on the target date so planetary positions are representative
    // of the middle of the day rather than midnight edge cases.
    const date = dateParam
      ? new Date(`${dateParam}T12:00:00Z`)
      : (() => {
          const d = new Date();
          d.setUTCHours(12, 0, 0, 0);
          return d;
        })();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── Idempotency check ─────────────────────────────────────────────────────
    const { data: existing } = await supabase
      .from('daily_metaphysical_data')
      .select('id')
      .eq('date', dateStr)
      .maybeSingle();

    if (existing && !forceRegen) {
      return Response.json({ status: 'already_exists', date: dateStr });
    }

    // ── Astronomical calculations (VSOP87 via astronomy-engine) ──────────────

    // Moon phase — returns [0, 360)
    const moonPhaseAngle = Astronomy.MoonPhase(date);
    const moonPhaseName = getMoonPhaseNameForDay(moonPhaseAngle, date);

    // Moon ecliptic longitude → sign
    const moonVec = Astronomy.GeoMoon(date);
    const moonEcl = Astronomy.Ecliptic(moonVec);

    // Special cultural/astronomical name (Full Moon days only)
    const moonSpecialName =
      moonPhaseName === 'Full Moon' ? computeMoonSpecialName(date, moonVec) : null;
    const moonSignName = eclipticLonToSign(moonEcl.elon);
    const element = SIGN_ELEMENTS[moonSignName];

    // Retrograde detection
    const yesterday = new Date(date);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const retrogradePlanets: string[] = [];
    for (const { body, name } of PLANETS) {
      if (isRetrograde(body, date, yesterday)) {
        retrogradePlanets.push(name);
      }
    }

    // Moon degree within its sign (0–30°) — key differentiator across days in the same sign
    const moonDegreeInSign = moonEcl.elon % 30;

    // Sun sign
    const sunEcl = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, date, false));
    const sunSignName = eclipticLonToSign(sunEcl.elon);

    // Fast-moving planet signs (Mercury, Venus, Mars) for richer daily context
    const innerPlanetSigns: Record<string, string> = {};
    for (const body of [
      Astronomy.Body.Mercury,
      Astronomy.Body.Venus,
      Astronomy.Body.Mars,
    ] as const) {
      const ecl = Astronomy.Ecliptic(Astronomy.GeoVector(body, date, false));
      innerPlanetSigns[Astronomy.Body[body]] = eclipticLonToSign(ecl.elon);
    }

    const luckyNumbers = generateLuckyNumbers(date, moonPhaseAngle);
    const luckyColors = generateLuckyColors(element, date, moonDegreeInSign);

    // ── Fetch FK references ───────────────────────────────────────────────────
    const { data: moonSignRow } = await supabase
      .from('zodiac_signs')
      .select('id')
      .eq('name', moonSignName)
      .maybeSingle();

    const { data: crystalAssoc } = await supabase
      .from('zodiac_crystal_associations')
      .select('crystal_id')
      .eq('zodiac_sign_id', moonSignRow?.id ?? 0)
      .order('strength', { ascending: false })
      .limit(1)
      .maybeSingle();

    // ── Claude Haiku: energy theme + advice ───────────────────────────────────
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    // Build a polarity hint so Haiku doesn't hallucinate the wrong phase direction.
    const phasePolarity = moonPhaseName.toLowerCase().includes('waxing')
      ? 'This is a WAXING (building, growing) phase — use only waxing/growing language in advice.'
      : moonPhaseName.toLowerCase().includes('waning')
        ? 'This is a WANING (releasing, decreasing) phase — use only waning/releasing language in advice.'
        : '';

    const prompt = `Cosmic snapshot for ${dateStr}:
- Moon phase: ${moonPhaseName}${phasePolarity ? ` — ${phasePolarity}` : ''}
- Moon position: ${Math.round(moonDegreeInSign)}° ${moonSignName}, phase angle ${Math.round(moonPhaseAngle)}°
- Sun: ${sunSignName}
- Mercury: ${innerPlanetSigns['Mercury']}
- Venus: ${innerPlanetSigns['Venus']}
- Mars: ${innerPlanetSigns['Mars']}
- Retrograde Planets: ${retrogradePlanets.length > 0 ? retrogradePlanets.join(', ') : 'None'}

The moon's exact degree within ${moonSignName} is important — early degrees (0–10°) carry raw, initiating energy; middle degrees (10–20°) are settled and expressive; late degrees (20–30°) are culminating and releasing. Reflect this in both outputs.

Return a JSON object with exactly two keys:
- "energy_theme": 3–7 word evocative phrase capturing THIS specific day's energy (no punctuation, no sentence case) — must be distinct from a generic moon phase/sign label
- "advice": One grounded, practical metaphysical sentence (25–40 words) specific to today's planetary picture

Respond with valid JSON only. No markdown fences, no extra text.`;

    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    // Fallbacks in case parsing fails
    let energyTheme = `${moonPhaseName} in ${moonSignName}`;
    let advice = `Align with the ${moonPhaseName.toLowerCase()} as the Moon moves through ${moonSignName} — focus on ${element.toLowerCase()} energy today.`;

    const rawText = completion.content[0].type === 'text' ? completion.content[0].text.trim() : '';
    try {
      const jsonText = rawText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(jsonText);
      if (typeof parsed.energy_theme === 'string') energyTheme = parsed.energy_theme;
      if (typeof parsed.advice === 'string') advice = parsed.advice;
    } catch {
      console.warn('[daily-metaphysical] Could not parse Claude response, using fallback.');
    }

    // Guard: reject advice that uses the wrong phase polarity (e.g. "waning" for a
    // waxing phase). Haiku can hallucinate this when the angle is near a boundary.
    const adviceLower = advice.toLowerCase();
    const isWaxing = moonPhaseName.toLowerCase().includes('waxing');
    const isWaning = moonPhaseName.toLowerCase().includes('waning');
    if (
      (isWaxing && adviceLower.includes('waning')) ||
      (isWaning && adviceLower.includes('waxing'))
    ) {
      console.warn('[daily-metaphysical] AI advice had wrong moon polarity; using fallback.');
      advice = `Align with the ${moonPhaseName.toLowerCase()} as the Moon moves through ${moonSignName} — focus on ${element.toLowerCase()} energy today.`;
    }

    // ── Upsert ────────────────────────────────────────────────────────────────
    const { error: upsertError } = await supabase.from('daily_metaphysical_data').upsert(
      {
        date: dateStr,
        moon_phase: moonPhaseName,
        moon_special_name: moonSpecialName,
        moon_sign_id: moonSignRow?.id ?? null,
        retrograde_planets: retrogradePlanets,
        lucky_numbers: luckyNumbers,
        lucky_colors: luckyColors,
        recommended_crystal_id: crystalAssoc?.crystal_id ?? null,
        energy_theme: energyTheme,
        advice,
        metadata: {
          moon_phase_angle: Math.round(moonPhaseAngle * 100) / 100,
          moon_sign: moonSignName,
          moon_degree_in_sign: Math.round(moonDegreeInSign * 100) / 100,
          element,
          moon_ecliptic_lon: Math.round(moonEcl.elon * 100) / 100,
          sun_sign: sunSignName,
          inner_planet_signs: innerPlanetSigns,
          generated_by: 'daily-metaphysical-v2',
          generated_at: new Date().toISOString(),
        },
      },
      { onConflict: 'date' }
    );

    if (upsertError) throw upsertError;

    return Response.json({
      status: 'created',
      date: dateStr,
      moonPhaseName,
      moonSignName,
      element,
      retrogradePlanets,
      energyTheme,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[daily-metaphysical] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
});
