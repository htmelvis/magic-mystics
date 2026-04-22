/**
 * Daily Planetary Alignment Generator
 *
 * Runs once per day (scheduled via pg_cron at 00:02 UTC, just after daily-metaphysical).
 * Computes all planetary positions using astronomy-engine, identifies the dominant planet
 * by counting major aspects (most aspected = most energetically prominent), then generates
 * an alignment theme and advice via Claude Haiku.
 *
 * Query params:
 *   ?date=YYYY-MM-DD  — override the target date (useful for backfilling)
 *
 * Idempotent: returns 200 with status "already_exists" if a row for the date is present.
 *
 * Cron setup (run in Supabase SQL editor after enabling pg_cron):
 *   SELECT cron.schedule(
 *     'daily-planetary',
 *     '2 0 * * *',
 *     $$
 *     SELECT net.http_post(
 *       url        := 'https://<PROJECT_REF>.supabase.co/functions/v1/daily-planetary',
 *       headers    := '{"Content-Type":"application/json","Authorization":"Bearer <SERVICE_ROLE_KEY>"}'::jsonb,
 *       body       := '{}'::jsonb,
 *       timeout_milliseconds := 30000
 *     );
 *     $$
 *   );
 */

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk@0.35';
import * as Astronomy from 'npm:astronomy-engine@2';
import { eclipticLonToSign, PLANET_RULING_SIGNS, hasMajorAspect } from '../_shared/daily-helpers.ts';

// ── Constants ─────────────────────────────────────────────────────────────────

const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
};

const PLANETS = [
  { body: Astronomy.Body.Sun,     name: 'Sun',     canRetrograde: false },
  { body: Astronomy.Body.Moon,    name: 'Moon',    canRetrograde: false },
  { body: Astronomy.Body.Mercury, name: 'Mercury', canRetrograde: true  },
  { body: Astronomy.Body.Venus,   name: 'Venus',   canRetrograde: true  },
  { body: Astronomy.Body.Mars,    name: 'Mars',    canRetrograde: true  },
  { body: Astronomy.Body.Jupiter, name: 'Jupiter', canRetrograde: true  },
  { body: Astronomy.Body.Saturn,  name: 'Saturn',  canRetrograde: true  },
  { body: Astronomy.Body.Uranus,  name: 'Uranus',  canRetrograde: true  },
  { body: Astronomy.Body.Neptune, name: 'Neptune', canRetrograde: true  },
  { body: Astronomy.Body.Pluto,   name: 'Pluto',   canRetrograde: true  },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRetrograde(body: Astronomy.Body, today: Date, yesterday: Date): boolean {
  const todayEcl = Astronomy.Ecliptic(Astronomy.GeoVector(body, today, false));
  const yestEcl = Astronomy.Ecliptic(Astronomy.GeoVector(body, yesterday, false));
  let delta = todayEcl.elon - yestEcl.elon;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

interface PlanetSnapshot {
  planet: string;
  symbol: string;
  sign: string;
  longitude: number;
  isRetrograde: boolean;
}

function pickDominantPlanet(positions: PlanetSnapshot[]): PlanetSnapshot & { aspectCount: number } {
  // Count major aspects for each planet against all others
  const withCounts = positions.map((p, i) => {
    let count = 0;
    for (let j = 0; j < positions.length; j++) {
      if (i === j) continue;
      if (hasMajorAspect(p.longitude, positions[j].longitude)) count++;
    }
    return { ...p, aspectCount: count };
  });

  // Sort: most aspects first; break ties by dignity (planet in ruling sign)
  withCounts.sort((a, b) => {
    if (b.aspectCount !== a.aspectCount) return b.aspectCount - a.aspectCount;
    const aDignified = (PLANET_RULING_SIGNS[a.planet] ?? []).includes(a.sign) ? 1 : 0;
    const bDignified = (PLANET_RULING_SIGNS[b.planet] ?? []).includes(b.sign) ? 1 : 0;
    return bDignified - aDignified;
  });

  return withCounts[0];
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date');

    // Use noon UTC so positions are representative of the full day
    const date = dateParam ? new Date(`${dateParam}T12:00:00Z`) : (() => {
      const d = new Date();
      d.setUTCHours(12, 0, 0, 0);
      return d;
    })();
    const dateStr = date.toISOString().split('T')[0];

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── Idempotency check ─────────────────────────────────────────────────────
    const { data: existing } = await supabase
      .from('daily_planetary_alignment')
      .select('id')
      .eq('date', dateStr)
      .maybeSingle();

    if (existing) {
      return Response.json({ status: 'already_exists', date: dateStr });
    }

    // ── Compute planetary positions ───────────────────────────────────────────
    const yesterday = new Date(date);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const positions: PlanetSnapshot[] = PLANETS.map(({ body, name, canRetrograde }) => {
      const ecl = Astronomy.Ecliptic(Astronomy.GeoVector(body, date, false));
      return {
        planet: name,
        symbol: PLANET_GLYPHS[name],
        sign: eclipticLonToSign(ecl.elon),
        longitude: ecl.elon,
        isRetrograde: canRetrograde ? isRetrograde(body, date, yesterday) : false,
      };
    });

    // ── Determine dominant planet ─────────────────────────────────────────────
    const dominant = pickDominantPlanet(positions);

    // ── Claude Haiku: theme, supported endeavors, advice ─────────────────────
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const positionSummary = positions
      .map((p) => `${p.planet} in ${p.sign}${p.isRetrograde ? ' (retrograde)' : ''}`)
      .join(', ');

    const prompt = `Planetary snapshot for ${dateStr}:
${positionSummary}

Dominant planet: ${dominant.planet} in ${dominant.sign}${dominant.isRetrograde ? ' (retrograde)' : ''} — forming ${dominant.aspectCount} major aspects today.

The dominant planet carries the strongest energetic signature for this day. Generate content that reflects its character in ${dominant.sign} and how the broader planetary picture shapes the day's potential.

Return a JSON object with exactly three keys:
- "alignment_theme": 4–8 word evocative headline capturing today's dominant planetary energy (no punctuation, no sentence case) — must name the planet or its quality
- "supported_endeavors": JSON array of 3–5 specific activities or intentions this energy supports (each 2–4 words, lowercase)
- "advice": One grounded, practical metaphysical sentence (25–40 words) specific to today's planetary dominant

Respond with valid JSON only. No markdown fences, no extra text.`;

    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    // Fallbacks
    let alignmentTheme = `${dominant.planet} leads the sky today`;
    let supportedEndeavors = ['focus and intention', 'mindful action', 'reflection'];
    let advice = `With ${dominant.planet} forming ${dominant.aspectCount} major aspects today, its energy permeates the sky — align your actions with its nature for greatest resonance.`;

    const rawText =
      completion.content[0].type === 'text' ? completion.content[0].text.trim() : '';
    try {
      const jsonText = rawText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(jsonText);
      if (typeof parsed.alignment_theme === 'string') alignmentTheme = parsed.alignment_theme;
      if (Array.isArray(parsed.supported_endeavors)) supportedEndeavors = parsed.supported_endeavors;
      if (typeof parsed.advice === 'string') advice = parsed.advice;
    } catch {
      console.warn('[daily-planetary] Could not parse Claude response, using fallback.');
    }

    // ── Upsert ────────────────────────────────────────────────────────────────
    const { error: upsertError } = await supabase
      .from('daily_planetary_alignment')
      .upsert(
        {
          date: dateStr,
          dominant_planet: dominant.planet,
          dominant_planet_sign: dominant.sign,
          dominant_planet_symbol: dominant.symbol,
          alignment_theme: alignmentTheme,
          supported_endeavors: supportedEndeavors,
          all_planet_positions: positions.map(({ longitude: _lon, ...rest }) => rest),
          advice,
          metadata: {
            dominant_aspect_count: dominant.aspectCount,
            dominant_longitude: Math.round(dominant.longitude * 100) / 100,
            generated_by: 'daily-planetary-v1',
            generated_at: new Date().toISOString(),
          },
        },
        { onConflict: 'date' }
      );

    if (upsertError) throw upsertError;

    return Response.json({
      status: 'created',
      date: dateStr,
      dominantPlanet: dominant.planet,
      dominantSign: dominant.sign,
      aspectCount: dominant.aspectCount,
      alignmentTheme,
      supportedEndeavors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[daily-planetary] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
});
