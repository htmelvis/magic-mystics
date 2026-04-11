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
 *
 * Idempotent: returns 200 with status "already_exists" if a row for the date
 * is already present. Safe to call multiple times.
 */

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk@0.35';
import * as Astronomy from 'npm:astronomy-engine@2';
import {
  getMoonPhaseName,
  eclipticLonToSign,
  generateLuckyColors,
  generateLuckyNumbers,
  SIGN_ELEMENTS,
  type DailyZodiacSign,
  type ZodiacElement,
} from '../../src/lib/metaphysical/daily-helpers.ts';

// ── Constants ─────────────────────────────────────────────────────────────────

type ZodiacSign = DailyZodiacSign;
type Element = ZodiacElement;

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

    // Use noon UTC on the target date so planetary positions are representative
    // of the middle of the day rather than midnight edge cases.
    const date = dateParam ? new Date(`${dateParam}T12:00:00Z`) : new Date();
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

    if (existing) {
      return Response.json({ status: 'already_exists', date: dateStr });
    }

    // ── Astronomical calculations (VSOP87 via astronomy-engine) ──────────────

    // Moon phase — returns [0, 360)
    const moonPhaseAngle = Astronomy.MoonPhase(date);
    const moonPhaseName = getMoonPhaseName(moonPhaseAngle);

    // Moon ecliptic longitude → sign
    const moonVec = Astronomy.GeoMoon(date);
    const moonEcl = Astronomy.Ecliptic(moonVec);
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
    for (const body of [Astronomy.Body.Mercury, Astronomy.Body.Venus, Astronomy.Body.Mars] as const) {
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

    const prompt = `Cosmic snapshot for ${dateStr}:
- Moon: ${Math.round(moonDegreeInSign)}° ${moonSignName} (${moonPhaseName}, phase angle ${Math.round(moonPhaseAngle)}°)
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

    const rawText =
      completion.content[0].type === 'text' ? completion.content[0].text.trim() : '';
    try {
      const jsonText = rawText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(jsonText);
      if (typeof parsed.energy_theme === 'string') energyTheme = parsed.energy_theme;
      if (typeof parsed.advice === 'string') advice = parsed.advice;
    } catch {
      console.warn('[daily-metaphysical] Could not parse Claude response, using fallback.');
    }

    // ── Upsert ────────────────────────────────────────────────────────────────
    const { error: upsertError } = await supabase
      .from('daily_metaphysical_data')
      .upsert(
        {
          date: dateStr,
          moon_phase: moonPhaseName,
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
