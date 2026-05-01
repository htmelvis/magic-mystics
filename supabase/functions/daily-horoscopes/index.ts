/**
 * Daily Horoscope Generator
 *
 * Runs once per day (scheduled via pg_cron at 00:15 UTC, after daily-metaphysical
 * at 00:01 and daily-planetary at 00:02). The 13-minute gap ensures daily-planetary
 * (which can take up to 55 s) has fully written its row before this function reads it.
 *
 * Reads today's planet positions from daily_planetary_alignment and moon phase
 * from daily_metaphysical_data, then calls Claude Haiku in parallel for all 12
 * signs and upserts the results into daily_horoscopes.
 *
 * Query params:
 *   ?date=YYYY-MM-DD  — override the target date (useful for backfilling)
 *
 * Idempotent: returns 200 with status "already_exists" if all 12 rows for the
 * date are already present. Safe to call multiple times.
 */

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk@0.35';

// ── Sign metadata ─────────────────────────────────────────────────────────────

const SIGNS = [
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

type Sign = (typeof SIGNS)[number];

interface SignData {
  element: string;
  modality: string;
  ruler: string;
  keywords: string[];
}

const SIGN_DATA: Record<Sign, SignData> = {
  Aries: { element: 'Fire', modality: 'Cardinal', ruler: 'Mars', keywords: ['initiative', 'courage', 'action'] },
  Taurus: { element: 'Earth', modality: 'Fixed', ruler: 'Venus', keywords: ['stability', 'pleasure', 'persistence'] },
  Gemini: { element: 'Air', modality: 'Mutable', ruler: 'Mercury', keywords: ['curiosity', 'communication', 'adaptability'] },
  Cancer: { element: 'Water', modality: 'Cardinal', ruler: 'Moon', keywords: ['intuition', 'nurturing', 'home'] },
  Leo: { element: 'Fire', modality: 'Fixed', ruler: 'Sun', keywords: ['creativity', 'leadership', 'warmth'] },
  Virgo: { element: 'Earth', modality: 'Mutable', ruler: 'Mercury', keywords: ['precision', 'service', 'discernment'] },
  Libra: { element: 'Air', modality: 'Cardinal', ruler: 'Venus', keywords: ['harmony', 'beauty', 'balance'] },
  Scorpio: { element: 'Water', modality: 'Fixed', ruler: 'Pluto', keywords: ['transformation', 'depth', 'intensity'] },
  Sagittarius: { element: 'Fire', modality: 'Mutable', ruler: 'Jupiter', keywords: ['expansion', 'truth', 'freedom'] },
  Capricorn: { element: 'Earth', modality: 'Cardinal', ruler: 'Saturn', keywords: ['ambition', 'discipline', 'mastery'] },
  Aquarius: { element: 'Air', modality: 'Fixed', ruler: 'Uranus', keywords: ['innovation', 'community', 'originality'] },
  Pisces: { element: 'Water', modality: 'Mutable', ruler: 'Neptune', keywords: ['compassion', 'dreams', 'surrender'] },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlanetPosition {
  planet: string;
  sign: string;
  isRetrograde: boolean;
}

interface HoroscopeRow {
  date: string;
  sign: string;
  headline: string;
  body: string;
  theme: string;
  love_note: string;
  career_note: string;
  wellness_note: string;
  metadata: Record<string, unknown>;
}

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(
  sign: Sign,
  dateStr: string,
  moonPhase: string,
  positions: PlanetPosition[]
): string {
  const { element, modality, ruler, keywords } = SIGN_DATA[sign];

  const moonPosition = positions.find(p => p.planet === 'Moon');
  const moonSign = moonPosition?.sign ?? 'unknown';

  const rulerPosition = positions.find(p => p.planet === ruler);
  const rulerSign = rulerPosition?.sign ?? 'unknown';

  const retrogrades = positions
    .filter(p => p.isRetrograde)
    .map(p => p.planet)
    .join(', ') || 'none';

  const planetLines = positions
    .map(p => `- ${p.planet}: in ${p.sign}${p.isRetrograde ? ' ℞' : ''}`)
    .join('\n');

  return `You are a skilled astrologer writing the daily horoscope for ${sign} on ${dateStr}.

TODAY'S SKY:
- Moon: ${moonPhase} in ${moonSign}
${planetLines}
- Retrograde planets: ${retrogrades}

${sign.toUpperCase()} PROFILE:
- Element: ${element} | Modality: ${modality} | Ruling planet: ${ruler} (currently in ${rulerSign})
- Keywords: ${keywords.join(', ')}

Write a daily horoscope for ${sign} grounded in these specific astrological conditions. Reference the current transits most relevant to this sign's nature. Write in second person ("you"). Tone: warm, insightful, empowering. No generic clichés.

Return ONLY valid JSON (no markdown fences):
{
  "headline": "...",
  "body": "...",
  "theme": "...",
  "love_note": "...",
  "career_note": "...",
  "wellness_note": "..."
}

Field constraints:
- headline: one vivid sentence, max 12 words
- body: 3-4 sentences of core daily reading
- theme: 1-2 word energy label (e.g. "inner clarity", "bold moves")
- love_note: one sentence on relationships or love
- career_note: one sentence on work or ambition
- wellness_note: one sentence on body, rest, or health`;
}

// ── Per-sign generator ────────────────────────────────────────────────────────

async function generateHoroscope(
  anthropic: Anthropic,
  sign: Sign,
  dateStr: string,
  moonPhase: string,
  positions: PlanetPosition[]
): Promise<HoroscopeRow> {
  const { element, modality } = SIGN_DATA[sign];

  const fallback: HoroscopeRow = {
    date: dateStr,
    sign,
    headline: `${sign} moves with intention through today's sky`,
    body: `The current planetary configuration calls you to lean into your ${element.toLowerCase()} nature. Stay present to what's shifting around you and trust your instincts as the day unfolds.`,
    theme: 'mindful presence',
    love_note: `Bring your natural ${element.toLowerCase()} energy into your connections today.`,
    career_note: `Your ${modality.toLowerCase()} drive is an asset — direct it with focus.`,
    wellness_note: `Honor your body with consistent, gentle attention today.`,
    metadata: { generated_by: 'daily-horoscopes-v1', fallback: true, generated_at: new Date().toISOString() },
  };

  try {
    const prompt = buildPrompt(sign, dateStr, moonPhase, positions);
    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText =
      completion.content[0].type === 'text' ? completion.content[0].text.trim() : '';
    const jsonText = rawText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(jsonText);

    return {
      date: dateStr,
      sign,
      headline: typeof parsed.headline === 'string' ? parsed.headline : fallback.headline,
      body: typeof parsed.body === 'string' ? parsed.body : fallback.body,
      theme: typeof parsed.theme === 'string' ? parsed.theme : fallback.theme,
      love_note: typeof parsed.love_note === 'string' ? parsed.love_note : fallback.love_note,
      career_note:
        typeof parsed.career_note === 'string' ? parsed.career_note : fallback.career_note,
      wellness_note:
        typeof parsed.wellness_note === 'string'
          ? parsed.wellness_note
          : fallback.wellness_note,
      metadata: { generated_by: 'daily-horoscopes-v1', fallback: false, generated_at: new Date().toISOString() },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[daily-horoscopes] ${sign}: Claude parse failed — ${message}`);
    return fallback;
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date');

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
    const { count } = await supabase
      .from('daily_horoscopes')
      .select('id', { count: 'exact', head: true })
      .eq('date', dateStr);

    if (count === 12) {
      return Response.json({ status: 'already_exists', date: dateStr });
    }

    // ── Read pre-computed astronomical context ─────────────────────────────────
    const [{ data: planetary }, { data: metaphysical }] = await Promise.all([
      supabase
        .from('daily_planetary_alignment')
        .select('all_planet_positions')
        .eq('date', dateStr)
        .maybeSingle(),
      supabase
        .from('daily_metaphysical_data')
        .select('moon_phase')
        .eq('date', dateStr)
        .maybeSingle(),
    ]);

    if (!planetary?.all_planet_positions) {
      return Response.json(
        { error: `daily_planetary_alignment row missing for ${dateStr} — run daily-planetary first` },
        { status: 422 }
      );
    }

    const positions: PlanetPosition[] = planetary.all_planet_positions as PlanetPosition[];
    const moonPhase: string = metaphysical?.moon_phase ?? 'unknown phase';

    // ── Generate all 12 horoscopes in parallel ────────────────────────────────
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const rows = await Promise.all(
      SIGNS.map(sign => generateHoroscope(anthropic, sign, dateStr, moonPhase, positions))
    );

    // ── Upsert all 12 rows ────────────────────────────────────────────────────
    const { error: upsertError } = await supabase
      .from('daily_horoscopes')
      .upsert(rows, { onConflict: 'date,sign' });

    if (upsertError) throw upsertError;

    return Response.json({
      status: 'created',
      date: dateStr,
      signs: rows.map(r => ({ sign: r.sign, theme: r.theme })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[daily-horoscopes] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
});
