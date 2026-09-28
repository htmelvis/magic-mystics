/**
 * Tests for the AI insight contract.
 *
 * Run from supabase/functions:  deno test _shared/insight-schema_test.ts
 *
 * Besides the runtime cases, this file is a compile-time drift check: the app reads
 * insights through the plain interfaces in src/types/ai-insight.ts, and the
 * assignments below fail `deno check` if those stop matching the Zod schemas.
 */

import { assert, assertEquals } from 'jsr:@std/assert@1';
import { z } from 'npm:zod@4';
import { parseAIInsight } from './ai-insight.ts';
import {
  AIInsightSchema,
  SingleCardOutput,
  SpreadOutput,
  type AIInsight,
} from './insight-schema.ts';
import type { AIInsight as AppAIInsight } from '../../../src/types/ai-insight.ts';

// ── Compile-time parity with the app's interfaces ─────────────────────────────

type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const parity: Equals<AIInsight, AppAIInsight> = true;

Deno.test('server schema and app interfaces describe the same insight shape', () => {
  assert(parity);
});

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SINGLE = {
  kind: 'single',
  opening: 'You are asking whether it is safe to let go.',
  card_essence: 'The Tower upright clears what was built on sand.',
  celestial_overlay: 'Your Scorpio moon feels this as relief, not loss.',
  guidance: 'Write down one structure you are propping up out of habit.',
  resonance: 'You were never the building.',
};

const SPREAD = {
  kind: 'spread',
  opening: 'You are carrying a decision you have already made.',
  spread_reading: 'The past card grieves; the present card plants; the future card harvests.',
  guidance: 'Name the choice out loud to someone you trust.',
  resonance: 'Every ending opens a door.',
};

const raw = (value: unknown) => JSON.stringify(value);

// ── parseAIInsight ────────────────────────────────────────────────────────────

Deno.test('accepts a complete single-card insight', () => {
  assertEquals(parseAIInsight(raw(SINGLE)), SINGLE as AIInsight);
});

Deno.test('accepts a complete spread insight', () => {
  assertEquals(parseAIInsight(raw(SPREAD)), SPREAD as AIInsight);
});

Deno.test('rejects null, empty and malformed input', () => {
  assertEquals(parseAIInsight(null), null);
  assertEquals(parseAIInsight(''), null);
  assertEquals(parseAIInsight('{broken'), null);
});

Deno.test('rejects an insight missing a field, so it gets regenerated', () => {
  const { resonance: _, ...missing } = SINGLE;
  assertEquals(parseAIInsight(raw(missing)), null);
});

Deno.test('rejects a blank field', () => {
  assertEquals(parseAIInsight(raw({ ...SPREAD, guidance: '   ' })), null);
});

Deno.test('rejects fields from the wrong variant', () => {
  // A spread-shaped body labelled as a single card lacks card_essence and celestial_overlay.
  assertEquals(parseAIInsight(raw({ ...SPREAD, kind: 'single' })), null);
});

Deno.test('rejects an unknown kind', () => {
  assertEquals(parseAIInsight(raw({ ...SINGLE, kind: 'oracle' })), null);
});

// ── JSON Schema sent to Claude ────────────────────────────────────────────────

for (const [name, schema] of [
  ['single', SingleCardOutput],
  ['spread', SpreadOutput],
] as const) {
  Deno.test(`${name} output schema requires every field and describes each one`, () => {
    const json = z.toJSONSchema(schema) as {
      required: string[];
      properties: Record<string, { description?: string }>;
    };
    assertEquals(json.required.sort(), Object.keys(schema.shape).sort());
    for (const [field, prop] of Object.entries(json.properties)) {
      assert(prop.description, `${field} has no description for Claude`);
    }
  });

  Deno.test(`${name} output schema emits no length keywords`, () => {
    // Emptiness is enforced by .refine(), which never reaches the JSON Schema.
    const text = JSON.stringify(z.toJSONSchema(schema));
    assert(!/minLength|maxLength/.test(text), 'use .refine() rather than .min()/.max()');
  });
}

Deno.test('the stored-insight union covers every kind the app renders', () => {
  const kinds = AIInsightSchema.options.map(o => o.shape.kind.value).sort();
  assertEquals(kinds, ['followup', 'single', 'spread']);
});
