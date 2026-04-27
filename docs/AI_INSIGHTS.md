# AI Personalized Readings

## Current State

- **`readings.ai_insight`**: `TEXT`, nullable — exists on the table, rendered in
  `ReadingDrawer.tsx:238` when non-null. No code path writes to it today.
- **`docs/PROMPT_DRAFTS.md`**: Now holds the **follow-up / clarifying-card** prompt
  (a future Phase 2 feature). The primary reading prompts live in this document.
- **Edge function precedent**: `daily-metaphysical/index.ts` calls Claude Haiku via
  `@anthropic-ai/sdk` and stores structured output — the proven pattern to follow.
- **Subscription gating**: `hasAIContext` is defined on `UserLimits`, `true` for
  premium only.
- **User context available**: `users.sun_sign`, `moon_sign`, `rising_sign`.
  `daily_metaphysical_data` stores `moon_phase` and `retrograde_planets`.

---

## Spread Taxonomy

All reading types flow through one `readings` row. The `spread_type` field and
`drawn_cards` array determine which prompt variant and response shape to use.

| `spread_type`                            | Cards | Position identifiers                | Prompt variant |
| ---------------------------------------- | ----- | ----------------------------------- | -------------- |
| `daily`                                  | 1     | _(none — `position: null`)_         | Single-card    |
| `past-present-future`                    | 3     | `past`, `present`, `future`         | Multi-card     |
| `relationship` _(future)_                | 3     | `self`, `other`, `dynamic`          | Multi-card     |
| `situation-obstacle-solution` _(future)_ | 3     | `situation`, `obstacle`, `solution` | Multi-card     |
| `mind-body-spirit` _(future)_            | 3     | `mind`, `body`, `spirit`            | Multi-card     |
| `path-choice` _(future)_                 | 3     | `path_1`, `path_2`, `path_3`        | Multi-card     |

**Decision rule in the edge function is purely structural:**

```typescript
const isMultiCard = reading.drawn_cards.length > 1;
```

No switch on `spread_type` — all multi-card spreads use the same prompt template,
with positions passed through dynamically from `drawn_cards[i].position`. Adding
a new spread type in the future requires zero changes to the edge function.

### Human-readable spread names (for prompt context only)

The edge function maps `spread_type` → display name injected into the prompt:

```typescript
const SPREAD_DISPLAY_NAMES: Record<string, string> = {
  'past-present-future': 'past · present · future',
  relationship: 'self · other · dynamic between you',
  'situation-obstacle-solution': 'situation · obstacle · solution',
  'mind-body-spirit': 'mind · body · spirit',
  'path-choice': 'path 1 · path 2 · path 3',
};
const spreadLabel = SPREAD_DISPLAY_NAMES[reading.spread_type] ?? reading.spread_type;
```

---

## Storage Strategy

Keep `ai_insight` as `TEXT` and store serialized JSON — no migration needed. The
column is already fetched and rendered. The JSON shape differs by prompt variant;
a `kind` discriminator (injected by the edge function after parsing the LLM
response) lets the client render the right layout.

---

## TypeScript Types

```typescript
interface SingleCardInsight {
  kind: 'single';
  opening: string;
  card_essence: string; // core meaning in this orientation
  celestial_overlay: string; // big-three signs + moon phase + retrogrades
  guidance: string; // concrete 24-72h practice
  resonance: string; // ≤15-word screenshot line
}

interface SpreadInsight {
  kind: 'spread';
  opening: string;
  spread_reading: string; // holistic narrative — how the positions relate
  guidance: string;
  resonance: string;
}

// Phase 2 — follow-up clarifying card (prompt in PROMPT_DRAFTS.md)
interface FollowUpInsight {
  kind: 'followup';
  reframe: string;
  card_speaks: string;
  in_light_of: string;
  guidance: string;
  resonance: string;
}

type AIInsight = SingleCardInsight | SpreadInsight | FollowUpInsight;
```

### Parsing (client-side)

```typescript
function parseAIInsight(raw: string | null): AIInsight | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.kind === 'single' || parsed.kind === 'spread' || parsed.kind === 'followup') {
      return parsed as AIInsight;
    }
    return null;
  } catch {
    return null;
  }
}
```

---

## Prompt Templates

### Variant 1 — Single Card (daily draw)

`position_lens` is omitted — daily draws have no positional meaning.
`{{USER_INTENTION}}` defaults to `"daily guidance"` until a UI ships.

```text
You are a master tarot reader — intuitive, grounded, and deeply literate in the
Rider-Waite-Smith tradition. You read with the warmth of a close friend and the
precision of a scholar. You never sound like a horoscope app.

Keep your total response under 380 tokens.

<context>
  <intention>{{USER_INTENTION}}</intention>
  <card>{{CARD_NAME}}</card>
  <orientation>{{CARD_ORIENTATION}}</orientation>
  <sun_sign>{{SUN_SIGN}}</sun_sign>
  <moon_sign>{{MOON_SIGN}}</moon_sign>
  <rising_sign>{{RISING_SIGN}}</rising_sign>
  <moon_phase>{{MOON_PHASE}}</moon_phase>
  <retrograde_planets>{{RETROGRADE_PLANETS}}</retrograde_planets>
  <!-- Included only for premium users; omit this block entirely for free tier -->
  <recent_cards>{{RECENT_CARDS}}</recent_cards>
</context>

Deliver a reading that integrates every element above. Return ONLY valid JSON
with this exact shape:

{
  "opening": "One or two sentences naming what the querent is really asking
    beneath their stated intention. Specific, not generic.",
  "card_essence": "The core meaning of this card in this orientation, explained
    in 2-3 sentences with concrete, embodied imagery.",
  "celestial_overlay": "How the sun/moon/rising signs plus the moon phase and
    any retrograde planets color this card's message. 2-3 sentences.",
  "guidance": "One concrete, embodied practice or reflection for the next
    24-72 hours. Actionable, not vague.",
  "resonance": "A single quote-worthy line the querent will want to screenshot.
    15 words or fewer."
}

Voice rules:
- Speak TO the querent in second person. Never about them.
- Never predict with certainty. Use "the card suggests", "this energy asks",
  "you may find".
- Avoid clichés: "trust the journey", "the universe has a plan", "everything
  happens for a reason", "embrace your truth".
- Avoid evasive hedging ("this could mean many things"). Commit to an
  interpretation.
- If recent_cards is absent or empty, ignore it. If present, weave recurring
  themes naturally — do not force connections.
- Return ONLY the JSON. No preamble, no markdown fences, no trailing commentary.
```

---

### Variant 2 — Multi-Card Spread (all 3-card spreads, future N-card spreads)

The AI's job here is **synthesis** — the individual card meanings are already
shown by static content. `spread_reading` is holistic: how the positions
speak to each other as a narrative arc. Per-card breakdowns are not requested
because the static `drawn_cards` data already provides them.

Card positions are passed dynamically from `drawn_cards[i].position` — no
spread-specific branching needed. A 4-card or 5-card spread works identically.

```text
You are a master tarot reader — intuitive, grounded, and deeply literate in the
Rider-Waite-Smith tradition. You read with the warmth of a close friend and the
precision of a scholar. You never sound like a horoscope app.

Keep your total response under 520 tokens.

<context>
  <intention>{{USER_INTENTION}}</intention>
  <spread>{{SPREAD_DISPLAY_NAME}}</spread>
  <cards>
    <!-- Repeat for each drawn card, in draw order -->
    <card position="{{POSITION}}">
      <name>{{CARD_NAME}}</name>
      <orientation>{{ORIENTATION}}</orientation>
    </card>
  </cards>
  <sun_sign>{{SUN_SIGN}}</sun_sign>
  <moon_sign>{{MOON_SIGN}}</moon_sign>
  <rising_sign>{{RISING_SIGN}}</rising_sign>
  <moon_phase>{{MOON_PHASE}}</moon_phase>
  <retrograde_planets>{{RETROGRADE_PLANETS}}</retrograde_planets>
  <!-- Included only for premium users; omit this block entirely for free tier -->
  <recent_cards>{{RECENT_CARDS}}</recent_cards>
</context>

The querent already sees the individual card meanings. Your job is to read the
spread as a whole — name the story that emerges across the positions, the
tensions and resolutions between cards, and what that arc means for the
intention. Do NOT describe each card in isolation.

Return ONLY valid JSON with this exact shape:

{
  "opening": "One or two sentences naming what the querent is really carrying
    beneath their stated intention. Specific, not generic.",
  "spread_reading": "The holistic narrative of this spread — 4-6 sentences
    reading the cards as a single arc. Name what the positions reveal about
    each other: contrast, confirmation, progression, or paradox. Weave in
    celestial context where it sharpens the story.",
  "guidance": "One concrete, embodied practice or reflection for the next
    24-72 hours that honors the full spread. Actionable, not vague.",
  "resonance": "A single quote-worthy line the querent will want to screenshot.
    15 words or fewer."
}

Voice rules:
- Speak TO the querent in second person. Never about them.
- Never predict with certainty. Use "the spread suggests", "this arc asks",
  "you may find".
- Avoid clichés: "trust the journey", "the universe has a plan", "everything
  happens for a reason", "embrace your truth".
- Avoid evasive hedging. Commit to an interpretation of the spread's narrative.
- If recent_cards is absent or empty, ignore it. If present, call out recurring
  patterns naturally — do not force connections.
- Return ONLY the JSON. No preamble, no markdown fences, no trailing commentary.
```

---

## Edge Function Architecture

### `generate-reading-insight` — Request / Response

```typescript
// POST /generate-reading-insight
// Authorization: Bearer <user JWT>
interface RequestBody {
  reading_id: string;
}

interface ResponseBody {
  insight: AIInsight; // also written to readings.ai_insight
}
```

No `user_intention` in the request body. The edge function derives a
per-spread-type default; free-text intention is a future UI addition.

### Edge Function Logic

```
1. Authenticate request (JWT → user_id)
2. Fetch reading row — verify reading.user_id === user_id
3. Guard: if ai_insight is already populated, return it (idempotent)
4. Fetch user profile → sun_sign, moon_sign, rising_sign
5. Fetch daily_metaphysical_data for today → moon_phase, retrograde_planets
6. Fetch subscription → is_premium (hasAIContext)
7. If is_premium: fetch last 5 readings (excluding current) → recent_cards list
8. Determine prompt variant:
     drawn_cards.length === 1  → single-card prompt
     drawn_cards.length  >  1  → multi-card spread prompt
9. Assemble prompt, substituting all template variables
   - DEFAULT_INTENTIONS[spread_type] used for {{USER_INTENTION}}
   - Omit <recent_cards> block entirely for free users
   - Omit <retrograde_planets> content if array is empty (leave tag, say "none")
10. Call claude-haiku-4-5-20251001
      single-card:  max_tokens: 420
      multi-card:   max_tokens: 580
11. Parse JSON response; inject `kind` discriminator
12. Write JSON string to readings.ai_insight
13. Return { insight }
```

```typescript
const DEFAULT_INTENTIONS: Record<string, string> = {
  daily: 'daily guidance',
  'past-present-future': 'reflection on where I have been and where I am going',
  relationship: 'understanding this relationship',
  'situation-obstacle-solution': 'finding a way through this situation',
  'mind-body-spirit': 'alignment across all parts of myself',
  'path-choice': 'clarity on which path to take',
};
```

---

## Client Integration

### Where insights appear

`ReadingDrawer.tsx` renders `ai_insight` from history — that already works.
The gap is the **live draw screens**: `daily-draw.tsx` and `ppf.tsx` show card
detail inline but never fetch `ai_insight`. Both screens have `readingId` set
immediately after the insert, which is the hook point.

Proposed flow on both draw screens:

1. Reading inserted → `readingId` set
2. Fire `useGenerateInsight(readingId)` mutation (non-blocking)
3. Show a subtle loading shimmer below the card detail while insight generates
4. On success, populate an `AIInsightSection` component inline
5. The persisted `ai_insight` value means ReadingDrawer shows it too — no
   second fetch needed

### `useGenerateInsight` hook

```typescript
function useGenerateInsight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (readingId: string) =>
      supabase.functions.invoke('generate-reading-insight', {
        body: { reading_id: readingId },
      }),
    onSuccess: (_, readingId) => {
      queryClient.invalidateQueries({ queryKey: ['readings'] });
    },
  });
}
```

### `ReadingDrawer.tsx` — updated rendering

Replace the current plain-text `insightBody` with parsed section rendering:

```typescript
const insight = parseAIInsight(reading?.ai_insight ?? null);

// Single-card layout
if (insight?.kind === 'single') {
  // opening → card_essence → celestial_overlay → guidance → resonance (styled differently)
}

// Multi-card layout
if (insight?.kind === 'spread') {
  // opening → spread_reading → guidance → resonance
}
```

The `resonance` line always gets distinct treatment — larger type, subtle
border, screenshot-friendly. It is the shareable hook.

---

## Subscription Gating

- **Premium**: full insight with `recent_cards` context — this is the
  `hasAIContext` promise
- **Free**: no AI insight generated. Show a locked state in the insight section
  with an upgrade prompt. Do not generate a stripped-down insight — diluting
  the feature weakens the upgrade motivation

---

## Cost & Performance

| Variant             | Output tokens | Approx. cost/reading |
| ------------------- | ------------- | -------------------- |
| Single-card         | ~380          | $0.00095             |
| Multi-card spread   | ~520          | $0.0013              |
| Follow-up (Phase 2) | ~300          | $0.00075             |

- Edge function warm call: ~50ms + Claude latency ~1–2s total
- Insight generation never blocks the card reveal animation
- `ai_insight` is written once, read many times — no caching layer needed
- Idempotency guard (step 3 above) prevents duplicate Claude calls if the
  client retries

---

## Phase 2 — Follow-Up / Clarifying Card

Prompt is in `docs/PROMPT_DRAFTS.md`. This is a separate interaction: after
receiving a reading, the user asks a specific question and draws one more card.

Requires:

- A UI entry point in `ReadingDrawer.tsx` (question input + draw trigger)
- A `clarifying_card_draws` array or separate column on the `readings` row, OR
  a new `follow_up_readings` table linked to the parent reading
- A second edge function or a `mode` param on `generate-reading-insight`

Not in scope for Phase 1. Document the prompt now, implement when the UI ships.

---

## Open Questions

- [ ] Free-tier locked state: static upsell card, or a one-line teaser with
      content blurred?
- [ ] "Generate Insight" backfill button in the drawer for pre-feature readings?
      Strong upsell surface — show it only on premium-gated readings that predate
      the feature.
- [ ] Free-text intention input on the draw screen? Start with defaults; add
      a text field once the core flow ships and we validate engagement.
- [ ] Follow-up clarifying card (Phase 2): new column on `readings`, or a
      separate table? Separate table is cleaner if users can ask multiple follow-ups.
