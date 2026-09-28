/**
 * The contract between Claude and the app for AI reading insights.
 *
 * These schemas are the single source of truth for the insight shape: the AI SDK
 * turns them into the JSON Schema Claude generates against, validates the response
 * with them, and they validate stored insights before they are served again.
 *
 * The `.describe()` text is sent to Claude as part of the schema, so it is prompt
 * copy — edit it with the same care as the prompt templates.
 *
 * Length and emptiness rules live in `.refine()` rather than `.min()`/`.max()`:
 * refinements run during validation but are not emitted into the JSON Schema, which
 * keeps the schema within the keywords Anthropic structured outputs accept.
 *
 * The app mirrors these shapes as plain interfaces in src/types/ai-insight.ts;
 * insight-schema_test.ts fails the type check if the two drift apart.
 */

import { z } from 'npm:zod@4';

const text = (description: string) =>
  z
    .string()
    .refine(s => s.trim().length > 0, 'must not be empty')
    .describe(description);

const resonance = text(
  'A single quote-worthy line the querent will want to screenshot. 15 words or fewer.'
);

/** What Claude generates for a single-card draw. `kind` is added server-side. */
export const SingleCardOutput = z.object({
  opening: text(
    'One or two sentences naming what the querent is really asking beneath their stated intention. Specific, not generic.'
  ),
  card_essence: text(
    'The core meaning of this card in this orientation, explained in 2-3 sentences with concrete, embodied imagery.'
  ),
  celestial_overlay: text(
    "How the sun/moon/rising signs plus the moon phase and any retrograde planets color this card's message. 2-3 sentences."
  ),
  guidance: text(
    'One concrete, embodied practice or reflection for the next 24-72 hours. Actionable, not vague.'
  ),
  resonance,
});

/** What Claude generates for a multi-card spread. `kind` is added server-side. */
export const SpreadOutput = z.object({
  opening: text(
    'One or two sentences naming what the querent is really carrying beneath their stated intention. Specific, not generic.'
  ),
  spread_reading: text(
    'The holistic narrative of this spread — 4-6 sentences reading the cards as a single arc. Name what the positions reveal about each other: contrast, confirmation, progression, or paradox. Weave in celestial context where it sharpens the story.'
  ),
  guidance: text(
    'One concrete, embodied practice or reflection for the next 24-72 hours that honors the full spread. Actionable, not vague.'
  ),
  resonance,
});

/** Phase 2 follow-up clarifying card (prompt in docs/PROMPT_DRAFTS.md). */
export const FollowUpOutput = z.object({
  reframe: z.string(),
  card_speaks: z.string(),
  in_light_of: z.string(),
  guidance: z.string(),
  resonance: z.string(),
});

/** A stored insight: the generated output plus the `kind` discriminator. */
export const AIInsightSchema = z.discriminatedUnion('kind', [
  SingleCardOutput.extend({ kind: z.literal('single') }),
  SpreadOutput.extend({ kind: z.literal('spread') }),
  FollowUpOutput.extend({ kind: z.literal('followup') }),
]);

export type SingleCardOutput = z.infer<typeof SingleCardOutput>;
export type SpreadOutput = z.infer<typeof SpreadOutput>;
export type AIInsight = z.infer<typeof AIInsightSchema>;
