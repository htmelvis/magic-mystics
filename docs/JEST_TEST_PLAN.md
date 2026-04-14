# Jest Test Plan

## Overview

This document tracks test coverage across the codebase and defines the priority order for writing new tests.

Run the test suite:

```bash
npm test                  # all tests
npm run test:watch        # watch mode
npm run test:coverage     # with coverage report
```

---

## Current Coverage (as of April 2026)

| Category | Files | Tested | Coverage |
|---|---|---|---|
| `src/lib/` | 10 | 6 | 60% |
| `src/hooks/` | 13 | 1 | 8% |
| `src/components/` | ~26 non-story | 4 | 15% |
| `app/` screens | 24 | 1 | 4% |

---

## What Is Covered

### Library (`src/lib/`) — 6 / 10

| File | Test File | What's Tested |
|---|---|---|
| `lib/tarot/draw.ts` | `__tests__/lib/draw.test.ts` | `drawDailyCard`, `drawCard`, `drawSpread` — determinism, exclusions, deck validation, orientations |
| `lib/astrology/calculate-signs.ts` | `__tests__/lib/calculate-signs.test.ts` | Sun/moon/rising sign calculations, all 12 zodiac boundaries, UTC midnight slip prevention |
| `lib/astrology/natal-chart.ts` | `__tests__/lib/natal-chart.test.ts` | All 10 planets, ascendant/midheaven, free vs premium planet lists, output shape |
| `lib/astrology/zodiac-themes.ts` | `__tests__/lib/zodiac-themes.test.ts` | All 12 signs covered, glyphs, elements, gradient colors |
| `lib/metaphysical/daily-helpers.ts` | `__tests__/lib/daily-helpers.test.ts` | Moon phases, ecliptic sign mapping, lucky colors/numbers — determinism and variation |
| `lib/validation/onboarding.ts` | `__tests__/lib/onboarding-validation.test.ts` | `onboardingParamsSchema`, `astrologyDataSchema`, `userOnboardingUpdateSchema` |

### Hooks (`src/hooks/`) — 1 / 13

| File | Test File | What's Tested |
|---|---|---|
| `hooks/useRevenueCat.ts` | `__tests__/hooks/useRevenueCat.test.ts` | `purchasePremium` (success, cancellation, errors), `restorePurchases` (free/premium paths) |

### Components (`src/components/`) — 4 / ~26

| File | Test File | What's Tested |
|---|---|---|
| `components/ui/CosmicWeatherCard.tsx` | `__tests__/components/CosmicWeatherCard.test.tsx` | Loading state, null data, full data render, optional fields |
| `components/ui/UpgradeSheet.tsx` | `__tests__/components/UpgradeSheet.test.tsx` | Visible/hidden states, features list, purchase button, `isPurchasing` loading state |
| `components/ui/ZodiacAvatar.tsx` | `__tests__/components/ZodiacAvatar.test.tsx` | All 12 signs, correct glyphs, size prop |
| `components/ui/NatalChartWheel.tsx` | `__tests__/components/NatalChartWheel.test.tsx` | Full chart, null angles, outer planets toggle, planet/zodiac glyphs |

### Screens (`app/`) — 1 / 24

| File | Test File | What's Tested |
|---|---|---|
| `app/ppf.tsx` | `__tests__/screens/ppf.test.tsx` | No insert on mount, single insert on shuffle complete, correct payload shape, parallel card fetches, duplicate-fire guard, error display |

---

## What Is Not Covered

### Library gaps

| File | Notes |
|---|---|
| `lib/colors/cosmicColors.ts` | Pure data mapping — low risk |
| `lib/geocoding/geocode.ts` | External API call — mock-heavy, lower ROI |
| `lib/supabase/client.ts` | Infrastructure config — not unit-testable |
| `lib/supabase/test-connection.ts` | Dev utility — not worth testing |

### Untested hooks

`useAuth`, `useFilteredReadings`, `useJourneyStats`, `useOnboarding`, `useReadingExpiry`, `useReadings`, `useReflection`, `useSubscription`, `useTarotDeck`, `useDailyMetaphysical`, `useUserProfile`, `useAppTheme`

### Untested screens

All routes under `(auth)/`, `(onboarding)/`, `(tabs)/`, and `app/draw.tsx`.

---

## Priority Roadmap

### Tier 1 — Ship these next

High business risk. Logic that can fail silently in production with no safety net.

#### `useFilteredReadings`
The active filter-drawer feature. Test the filter and search logic in isolation before it ships.

Key cases:
- Returns all readings when no filters active
- Filters by spread type correctly
- Search matches card name, position, and keywords
- Combined filter + search narrows results
- Returns empty array when no match

#### `useSubscription`
Gates every premium feature. A wrong return value silently locks users out of features they paid for, or exposes paid features to free users.

Key cases:
- `canAccessPPF` is `false` for free tier, `true` for premium
- `hasAIContext` is `false` for free tier, `true` for premium
- `maxReadingHistory` returns `30` for free, `Infinity` for premium
- Loading state while Supabase query is in flight
- Defaults to free tier on fetch error

#### `app/draw.tsx`
Mirrors PPF — same event-driven draw pattern with a `hasDrawn` guard. Can reuse the PPF mock setup almost entirely.

Key cases (same invariants as ppf.test.tsx):
- No insert on mount
- Single insert when shuffle animation completes
- Correct payload shape (user_id, spread_type, drawn_cards)
- Guard blocks second fire of `onShuffleComplete`
- Error display on insert failure

---

### Tier 2 — High value, schedule soon

#### `useAuth`
Happy paths are implicitly exercised everywhere. Focus on the error paths that aren't covered.

Key cases:
- `signIn` surfaces the Supabase error message on failure
- `signUp` surfaces validation errors
- `signOut` clears session state
- Loading state during async operations

#### `useReflection`
Directly exercised in ppf.test.tsx via mock, but never tested directly. Small and isolated.

Key cases:
- Fetches reflection for a given `readingId`
- Returns `null` when no reflection exists
- `save` inserts when no reflection exists (upsert new)
- `save` updates when reflection already exists
- `isSaving` is true during the save operation

#### `ReflectionSheet`
Complex form with controlled state and sentiment selection.

Key cases:
- Renders with initial values pre-filled
- Calls `onSave` with correct feeling/alignment/content
- `isSaving` disables the save button
- `onClose` fires when cancelled

#### `SearchFilterBar`
The UI entry point for filter-drawer. Test that user interaction correctly fires callbacks.

Key cases:
- Typing into search input calls `onSearch` with the value
- Selecting a spread filter calls `onFilterChange`
- Clear button resets both
- Debounce behavior (if any)

---

### Tier 3 — Nice to have, lower priority

These have minimal logic, are well-documented in Storybook, or are better covered by E2E tests.

| Target | Reason for lower priority |
|---|---|
| `app/(auth)/sign-in.tsx`, `sign-up.tsx` | Form UX — better suited to E2E with Maestro |
| `app/(onboarding)/*` | Multi-step flow — Maestro E2E covers the happy path |
| `ReadingDrawer` | Render-only, data comes in via props |
| `Button`, `Card`, `Input`, `Badge` | Primitive UI, no internal logic, Storybook covers visual states |
| `useOnboarding` | Single field read from Supabase — minimal logic |
| `useTarotDeck` | Simple fetch + transform, covered indirectly via ppf.test.tsx |

---

## Mock Conventions

Established patterns from existing tests — follow these when writing new tests.

### Supabase client

Mock the entire client at `@lib/supabase/client`. Match the exact query chain your hook or screen calls — including every `.select()`, `.eq()`, `.single()`, `.maybeSingle()`, etc.

```typescript
jest.mock('@lib/supabase/client', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'your_table') {
        return {
          select: () => ({
            eq: () => ({
              single: mockFetchFn,
            }),
          }),
        };
      }
      return {};
    },
  },
}));
```

If a query also chains after `insert` (e.g. `.insert(...).select('id').single()`), split into two mocks — one for the insert call, one for the terminal `.single()`:

```typescript
const mockInsert = jest.fn();      // records the payload
const mockInsertSingle = jest.fn(); // returns { data, error }

// in the from() mock:
insert: (payload: unknown) => {
  mockInsert(payload);
  return { select: () => ({ single: mockInsertSingle }) };
},
```

### Hook mocks

Always mock hooks your screen depends on, even if the test doesn't exercise them directly — otherwise they'll try to call real Supabase and fail.

```typescript
jest.mock('@hooks/useReflection', () => ({
  useReflection: () => ({ reflection: null, isSaving: false, save: jest.fn() }),
}));
```

### Expo Router

```typescript
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() }),
}));
```

### Event-driven screen pattern

For screens like PPF and Draw that use an `onShuffleComplete`-style callback, capture it via the component mock so tests can fire it manually:

```typescript
let capturedOnShuffleComplete: (() => void) | undefined;

jest.mock('@components/tarot', () => ({
  TarotDeck: ({ onShuffleComplete }: { onShuffleComplete?: () => void }) => {
    capturedOnShuffleComplete = onShuffleComplete;
    return null;
  },
}));

// In the test:
await act(async () => {
  capturedOnShuffleComplete?.();
});
```

---

## Setup Notes

- **Config**: `jest.config.js` at root — do not add a `"jest"` key to `package.json` (causes conflict)
- **Preset**: `jest-expo` — handles React Native transforms
- **Path aliases**: Resolved via `moduleNameMapper` in `jest.config.js` (`@components`, `@lib`, `@hooks`, etc.)
- **TypeScript**: `"types": ["jest"]` in `tsconfig.json` exposes jest globals without explicit imports
- **Babel**: `babel.config.js` uses `babel-preset-expo` + `module-resolver` for path aliases
