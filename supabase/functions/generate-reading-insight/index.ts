/**
 * Generate Reading Insight
 *
 * Generates a personalized AI reading for a completed tarot draw and persists
 * it to readings.ai_insight. Premium users receive additional context
 * (recent cards, full big-three astrology). Free users are rejected — the
 * subscription gate lives here, not only on the client.
 *
 * POST /generate-reading-insight
 * Authorization: Bearer <user JWT>
 * Body: { reading_id: string }
 *
 * Idempotent: returns the existing insight without calling Claude if
 * ai_insight is already populated.
 */

import { createClient } from 'npm:@supabase/supabase-js@2';
import Anthropic from 'npm:@anthropic-ai/sdk@0.35';
import {
  DEFAULT_INTENTIONS,
  SPREAD_DISPLAY_NAMES,
  parseAIInsight,
} from '../_shared/ai-insight.ts';

// ── Types ─────────────────────────────────────────────────────────────────────

interface RequestBody {
  reading_id: string;
}

interface DrawnCard {
  cardId: number;
  cardName: string;
  orientation: 'upright' | 'reversed';
  position: string | null;
}

// ── Prompt templates ──────────────────────────────────────────────────────────

function buildSingleCardPrompt(p: {
  intention: string;
  cardName: string;
  orientation: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  moonPhase: string;
  retrogradePlanets: string[];
  recentCards: string[];
}): string {
  const retrogradeStr =
    p.retrogradePlanets.length > 0 ? p.retrogradePlanets.join(', ') : 'none';
  const recentCardsBlock =
    p.recentCards.length > 0
      ? `  <recent_cards>${p.recentCards.join(', ')}</recent_cards>`
      : '';

  return `You are a master tarot reader — intuitive, grounded, and deeply literate in the Rider-Waite-Smith tradition. You read with the warmth of a close friend and the precision of a scholar. You never sound like a horoscope app.

Keep your total response under 380 tokens.

<context>
  <intention>${p.intention}</intention>
  <card>${p.cardName}</card>
  <orientation>${p.orientation}</orientation>
  <sun_sign>${p.sunSign}</sun_sign>
  <moon_sign>${p.moonSign}</moon_sign>
  <rising_sign>${p.risingSign}</rising_sign>
  <moon_phase>${p.moonPhase}</moon_phase>
  <retrograde_planets>${retrogradeStr}</retrograde_planets>${recentCardsBlock ? '\n' + recentCardsBlock : ''}
</context>

Deliver a reading that integrates every element above. Return ONLY valid JSON with this exact shape:

{
  "opening": "One or two sentences naming what the querent is really asking beneath their stated intention. Specific, not generic.",
  "card_essence": "The core meaning of this card in this orientation, explained in 2-3 sentences with concrete, embodied imagery.",
  "celestial_overlay": "How the sun/moon/rising signs plus the moon phase and any retrograde planets color this card's message. 2-3 sentences.",
  "guidance": "One concrete, embodied practice or reflection for the next 24-72 hours. Actionable, not vague.",
  "resonance": "A single quote-worthy line the querent will want to screenshot. 15 words or fewer."
}

Voice rules:
- Speak TO the querent in second person. Never about them.
- Never predict with certainty. Use "the card suggests", "this energy asks", "you may find".
- Avoid clichés: "trust the journey", "the universe has a plan", "everything happens for a reason", "embrace your truth".
- Avoid evasive hedging ("this could mean many things"). Commit to an interpretation.${recentCardsBlock ? '\n- If recent_cards is present, weave recurring themes naturally — do not force connections.' : ''}
- Return ONLY the JSON. No preamble, no markdown fences, no trailing commentary.`;
}

function buildSpreadPrompt(p: {
  intention: string;
  spreadLabel: string;
  cards: Array<{ position: string; name: string; orientation: string }>;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  moonPhase: string;
  retrogradePlanets: string[];
  recentCards: string[];
}): string {
  const retrogradeStr =
    p.retrogradePlanets.length > 0 ? p.retrogradePlanets.join(', ') : 'none';
  const cardsXml = p.cards
    .map(
      (c) =>
        `    <card position="${c.position}">\n      <name>${c.name}</name>\n      <orientation>${c.orientation}</orientation>\n    </card>`
    )
    .join('\n');
  const recentCardsBlock =
    p.recentCards.length > 0
      ? `  <recent_cards>${p.recentCards.join(', ')}</recent_cards>`
      : '';

  return `You are a master tarot reader — intuitive, grounded, and deeply literate in the Rider-Waite-Smith tradition. You read with the warmth of a close friend and the precision of a scholar. You never sound like a horoscope app.

Keep your total response under 520 tokens.

<context>
  <intention>${p.intention}</intention>
  <spread>${p.spreadLabel}</spread>
  <cards>
${cardsXml}
  </cards>
  <sun_sign>${p.sunSign}</sun_sign>
  <moon_sign>${p.moonSign}</moon_sign>
  <rising_sign>${p.risingSign}</rising_sign>
  <moon_phase>${p.moonPhase}</moon_phase>
  <retrograde_planets>${retrogradeStr}</retrograde_planets>${recentCardsBlock ? '\n' + recentCardsBlock : ''}
</context>

The querent already sees the individual card meanings. Your job is to read the spread as a whole — name the story that emerges across the positions, the tensions and resolutions between cards, and what that arc means for the intention. Do NOT describe each card in isolation.

Return ONLY valid JSON with this exact shape:

{
  "opening": "One or two sentences naming what the querent is really carrying beneath their stated intention. Specific, not generic.",
  "spread_reading": "The holistic narrative of this spread — 4-6 sentences reading the cards as a single arc. Name what the positions reveal about each other: contrast, confirmation, progression, or paradox. Weave in celestial context where it sharpens the story.",
  "guidance": "One concrete, embodied practice or reflection for the next 24-72 hours that honors the full spread. Actionable, not vague.",
  "resonance": "A single quote-worthy line the querent will want to screenshot. 15 words or fewer."
}

Voice rules:
- Speak TO the querent in second person. Never about them.
- Never predict with certainty. Use "the spread suggests", "this arc asks", "you may find".
- Avoid clichés: "trust the journey", "the universe has a plan", "everything happens for a reason", "embrace your truth".
- Avoid evasive hedging. Commit to an interpretation of the spread's narrative.${recentCardsBlock ? '\n- If recent_cards is present, call out recurring patterns naturally — do not force connections.' : ''}
- Return ONLY the JSON. No preamble, no markdown fences, no trailing commentary.`;
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse body ────────────────────────────────────────────────────────────
    const body: RequestBody = await req.json();
    if (!body.reading_id) {
      return Response.json({ error: 'reading_id is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Fetch reading + verify ownership ─────────────────────────────────────
    const { data: reading, error: readingError } = await supabase
      .from('readings')
      .select('id, user_id, spread_type, drawn_cards, ai_insight')
      .eq('id', body.reading_id)
      .maybeSingle();

    if (readingError) throw readingError;
    if (!reading) {
      return Response.json({ error: 'Reading not found' }, { status: 404 });
    }
    if (reading.user_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Idempotency guard ─────────────────────────────────────────────────────
    if (reading.ai_insight) {
      const existing = parseAIInsight(reading.ai_insight);
      if (existing) return Response.json({ insight: existing });
    }

    // ── Parallel context fetches ──────────────────────────────────────────────
    const today = new Date().toISOString().split('T')[0];

    const [userRes, metaphysicalRes, subscriptionRes] = await Promise.all([
      supabase
        .from('users')
        .select('sun_sign, moon_sign, rising_sign')
        .eq('id', user.id)
        .single(),
      supabase
        .from('daily_metaphysical_data')
        .select('moon_phase, retrograde_planets')
        .eq('date', today)
        .maybeSingle(),
      supabase
        .from('subscriptions')
        .select('tier, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle(),
    ]);

    if (userRes.error) throw userRes.error;

    const isPremium =
      subscriptionRes.data?.tier === 'premium' && subscriptionRes.data?.is_active === true;

    // ── Subscription gate ─────────────────────────────────────────────────────
    if (!isPremium) {
      return Response.json({ error: 'Premium subscription required' }, { status: 403 });
    }

    // ── Recent cards (premium only) ───────────────────────────────────────────
    const { data: recentReadings } = await supabase
      .from('readings')
      .select('drawn_cards')
      .eq('user_id', user.id)
      .neq('id', body.reading_id)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentCards = (recentReadings ?? [])
      .flatMap((r) => (r.drawn_cards as DrawnCard[]) ?? [])
      .map((c) => c.cardName)
      .filter(Boolean)
      .slice(0, 5);

    // ── Assemble prompt ───────────────────────────────────────────────────────
    const drawnCards = reading.drawn_cards as DrawnCard[];
    const spreadType = reading.spread_type as string;
    const isMultiCard = drawnCards.length > 1;

    const intention = DEFAULT_INTENTIONS[spreadType] ?? 'guidance';
    const sunSign = userRes.data.sun_sign ?? 'unknown';
    const moonSign = userRes.data.moon_sign ?? 'unknown';
    const risingSign = userRes.data.rising_sign ?? 'unknown';
    const moonPhase = metaphysicalRes.data?.moon_phase ?? 'unknown';
    const retrogradePlanets = (metaphysicalRes.data?.retrograde_planets as string[]) ?? [];

    const prompt = isMultiCard
      ? buildSpreadPrompt({
          intention,
          spreadLabel: SPREAD_DISPLAY_NAMES[spreadType] ?? spreadType,
          cards: drawnCards.map((c) => ({
            position: c.position ?? 'card',
            name: c.cardName,
            orientation: c.orientation,
          })),
          sunSign,
          moonSign,
          risingSign,
          moonPhase,
          retrogradePlanets,
          recentCards,
        })
      : buildSingleCardPrompt({
          intention,
          cardName: drawnCards[0].cardName,
          orientation: drawnCards[0].orientation,
          sunSign,
          moonSign,
          risingSign,
          moonPhase,
          retrogradePlanets,
          recentCards,
        });

    // ── Claude call ───────────────────────────────────────────────────────────
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! });

    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: isMultiCard ? 580 : 420,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText =
      completion.content[0].type === 'text' ? completion.content[0].text.trim() : '';

    // Strip markdown fences if the model ignores that instruction
    const jsonText = rawText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      console.error('[generate-reading-insight] Failed to parse Claude response:', rawText);
      return Response.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Inject kind discriminator (not requested from Claude to avoid wasting tokens)
    parsed.kind = isMultiCard ? 'spread' : 'single';

    const insightStr = JSON.stringify(parsed);

    // ── Persist ───────────────────────────────────────────────────────────────
    const { error: updateError } = await supabase
      .from('readings')
      .update({ ai_insight: insightStr })
      .eq('id', body.reading_id);

    if (updateError) throw updateError;

    const insight = parseAIInsight(insightStr);

    console.log('[generate-reading-insight]', {
      reading_id: body.reading_id,
      spread_type: spreadType,
      variant: isMultiCard ? 'spread' : 'single',
      tokens_used: completion.usage,
    });

    return Response.json({ insight });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[generate-reading-insight] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
});
