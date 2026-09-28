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
import { createAnthropic } from 'npm:@ai-sdk/anthropic@3';
import { generateText, NoObjectGeneratedError, Output } from 'npm:ai@6';
import type { z } from 'npm:zod@4';
import { DEFAULT_INTENTIONS, SPREAD_DISPLAY_NAMES, parseAIInsight } from '../_shared/ai-insight.ts';
import { SingleCardOutput, SpreadOutput, type AIInsight } from '../_shared/insight-schema.ts';

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
  const retrogradeStr = p.retrogradePlanets.length > 0 ? p.retrogradePlanets.join(', ') : 'none';
  const recentCardsBlock =
    p.recentCards.length > 0 ? `  <recent_cards>${p.recentCards.join(', ')}</recent_cards>` : '';

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

Deliver a reading that integrates every element above, following the field descriptions in the output schema.

Voice rules:
- Speak TO the querent in second person. Never about them.
- Never predict with certainty. Use "the card suggests", "this energy asks", "you may find".
- Avoid clichés: "trust the journey", "the universe has a plan", "everything happens for a reason", "embrace your truth".
- Avoid evasive hedging ("this could mean many things"). Commit to an interpretation.${recentCardsBlock ? '\n- If recent_cards is present, weave recurring themes naturally — do not force connections.' : ''}`;
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
  const retrogradeStr = p.retrogradePlanets.length > 0 ? p.retrogradePlanets.join(', ') : 'none';
  const cardsXml = p.cards
    .map(
      c =>
        `    <card position="${c.position}">\n      <name>${c.name}</name>\n      <orientation>${c.orientation}</orientation>\n    </card>`
    )
    .join('\n');
  const recentCardsBlock =
    p.recentCards.length > 0 ? `  <recent_cards>${p.recentCards.join(', ')}</recent_cards>` : '';

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

Follow the field descriptions in the output schema.

Voice rules:
- Speak TO the querent in second person. Never about them.
- Never predict with certainty. Use "the spread suggests", "this arc asks", "you may find".
- Avoid clichés: "trust the journey", "the universe has a plan", "everything happens for a reason", "embrace your truth".
- Avoid evasive hedging. Commit to an interpretation of the spread's narrative.${recentCardsBlock ? '\n- If recent_cards is present, call out recurring patterns naturally — do not force connections.' : ''}`;
}

// ── Claude call ───────────────────────────────────────────────────────────────

const MODEL = 'claude-haiku-4-5-20251001';

/**
 * Generates an insight constrained to `schema`. The AI SDK sends the schema to
 * Claude as a structured-output format and validates the response against it, so a
 * returned `output` is always well-formed.
 *
 * A response that is truncated or fails validation throws NoObjectGeneratedError.
 * That is retried once with double the token budget, since the prompts ask for a
 * length close to the limit and truncation is the likeliest cause. Transport errors
 * are already retried inside generateText.
 */
async function generateInsight<T extends object>(
  schema: z.ZodType<T>,
  prompt: string,
  maxOutputTokens: number
) {
  const model = createAnthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })(MODEL);

  try {
    return await generateText({
      model,
      output: Output.object({ schema }),
      prompt,
      maxOutputTokens,
    });
  } catch (err) {
    if (!NoObjectGeneratedError.isInstance(err)) throw err;
    console.warn('[generate-reading-insight] Invalid output, retrying:', {
      finishReason: err.finishReason,
      cause: err.cause instanceof Error ? err.cause.message : err.cause,
      text: err.text,
    });
    return await generateText({
      model,
      output: Output.object({ schema }),
      prompt,
      maxOutputTokens: maxOutputTokens * 2,
    });
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Supabase verifies the JWT signature at the infrastructure level before
    // routing to this function, so decoding the payload here is safe.
    let userId: string;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.sub) throw new Error('missing sub');
      userId = payload.sub as string;
    } catch {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Parse body ────────────────────────────────────────────────────────────
    const body: RequestBody = await req.json();
    if (!body.reading_id) {
      return Response.json({ error: 'reading_id is required' }, { status: 400 });
    }

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
    if (reading.user_id !== userId) {
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
      supabase.from('users').select('sun_sign, moon_sign, rising_sign').eq('id', userId).single(),
      supabase
        .from('daily_metaphysical_data')
        .select('moon_phase, retrograde_planets')
        .eq('date', today)
        .maybeSingle(),
      supabase
        .from('subscriptions')
        .select('tier, is_active')
        .eq('user_id', userId)
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
      .eq('user_id', userId)
      .neq('id', body.reading_id)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentCards = (recentReadings ?? [])
      .flatMap(r => (r.drawn_cards as DrawnCard[]) ?? [])
      .map(c => c.cardName)
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

    // ── Generate ──────────────────────────────────────────────────────────────
    // `kind` is added here rather than generated, so Claude spends no tokens on it.
    let insight: AIInsight;
    let usage: unknown;
    try {
      if (isMultiCard) {
        const prompt = buildSpreadPrompt({
          intention,
          spreadLabel: SPREAD_DISPLAY_NAMES[spreadType] ?? spreadType,
          cards: drawnCards.map(c => ({
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
        });
        const result = await generateInsight(SpreadOutput, prompt, 580);
        insight = { kind: 'spread', ...result.output };
        usage = result.totalUsage;
      } else {
        const prompt = buildSingleCardPrompt({
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
        const result = await generateInsight(SingleCardOutput, prompt, 420);
        insight = { kind: 'single', ...result.output };
        usage = result.totalUsage;
      }
    } catch (err) {
      if (!NoObjectGeneratedError.isInstance(err)) throw err;
      console.error('[generate-reading-insight] Invalid output after retry:', {
        finishReason: err.finishReason,
        text: err.text,
      });
      return Response.json({ error: 'Failed to generate a valid reading' }, { status: 502 });
    }

    // ── Persist ───────────────────────────────────────────────────────────────
    // Only schema-validated insights reach the database.
    const { error: updateError } = await supabase
      .from('readings')
      .update({ ai_insight: JSON.stringify(insight) })
      .eq('id', body.reading_id);

    if (updateError) throw updateError;

    console.log('[generate-reading-insight]', {
      reading_id: body.reading_id,
      spread_type: spreadType,
      variant: insight.kind,
      tokens_used: usage,
    });

    return Response.json({ insight });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[generate-reading-insight] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
});
