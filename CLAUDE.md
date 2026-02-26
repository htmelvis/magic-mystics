# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server
npx expo start

# Platform-specific
npx expo start --ios
npx expo start --android
npx expo start --web

# Lint (no npm script configured)
npx eslint . --ext .ts,.tsx

# Format
npx prettier --write .
```

No test runner is configured.

## Architecture

**Magic Mystics** is a React Native / Expo app (TypeScript, strict mode) for tarot readings with astrology personalization. Target platforms: iOS, Android, Web.

### Routing

Expo Router v6 with file-based routing under `app/`. The root layout (`app/_layout.tsx`) controls all navigation via three states:

1. Unauthenticated → `/(auth)/sign-in`
2. Authenticated + onboarding incomplete → `/(onboarding)/welcome`
3. Authenticated + onboarding complete → `/(tabs)/home`

Route groups:

- `(auth)/` — sign-in, sign-up
- `(onboarding)/` — 5-step flow: welcome → birth-date → birth-time → birth-location → calculating
- `(tabs)/` — main app: home, history, profile

### Path Aliases

Configured in `tsconfig.json`:

- `@/*` → `src/*`
- `@components/*`, `@lib/*`, `@hooks/*`, `@types/*`

### State Management

No Redux or global context. State lives in custom hooks:

- `useAuth()` — Supabase session, `signIn/signUp/signOut`
- `useOnboarding(userId)` — reads `users.onboarding_completed` from Supabase
- `useSubscription(userId)` — tier (`free` | `premium`) with feature gates (`canAccessPPF`, `hasAIContext`, `maxReadingHistory`)

### Backend: Supabase

- PostgreSQL with Row Level Security (all tables user-scoped)
- Email/password auth via `@supabase/supabase-js`
- Storage: Expo SecureStore on native, AsyncStorage on web (platform-detected in `src/lib/supabase/client.ts`)
- Migrations in `supabase/migrations/`, seeds in `supabase/seeds/`

Key tables: `users`, `subscriptions`, `readings`, `reflections`, `ppf_readings`

### AI Integration (Planned)

Vercel AI SDK (`ai` package) is installed with support for OpenAI and Anthropic providers. AI call logic is scaffolded under `src/lib/ai/` but not yet implemented. Edge Functions on Supabase are the intended invocation path.

### Business Logic

- **Astrology calculations**: `src/lib/astrology/calculate-signs.ts` — computes sun/moon/rising sign from birth date/time/location
- **Subscription tiers**: Free (30 readings, no PPF, no AI context) vs. Premium ($49/yr, unlimited, PPF, AI context)
- **Tarot**: Card types in `src/types/tarot.ts`, deck logic scaffolded under `src/lib/tarot/` (not yet implemented)

### Environment Variables

Required in `.env.local`:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

### Code Style

Prettier config: single quotes, trailing commas (ES5), 2-space indent, 100 char line width, no semicolon-less (semis on), arrow parens avoided.

ESLint extends `expo` + `prettier`; `console.log` is warned against; unused vars are errors.
