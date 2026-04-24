# Magic Mystics 🔮

A daily tarot pull mobile application for iOS and Android, built with React Native and Expo.

## Features

### Current (MVP)

- **Authentication**: Supabase Auth for user accounts and cross-device sync
- **Daily Card Pull**: Draw a single tarot card each day with AI-generated insights
- **Reading History**: Limited history for free users, unlimited for premium
- **User Reflections**: Journal your thoughts on each reading
- **Subscription Tiers**:
  - Free: 30 readings history, basic features
  - Premium ($--/year): Unlimited history, monthly PPF spread, AI with historical context

### Upcoming Features

- **Past/Present/Future Spread**: Monthly 3-card spread (premium only)
- **Card Shuffle Animation**: React Native Reanimated card animations
- **AI Insights**: Vercel AI SDK with multiple provider support and fallbacks
- **Rider-Waite Deck**: Public domain tarot card imagery
- **In-app Purchases**: RevenueCat integration for subscriptions

## Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI**: Vercel AI SDK (OpenAI, Anthropic, etc.)
- **Animations**: React Native Reanimated
- **Storage**: Expo SecureStore, AsyncStorage

## Project Structure

```bash
magic-mystics/
├── app/                      # Expo Router file-based routing
│   ├── (auth)/              # Authentication screens
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── home.tsx
│   │   ├── etc.tsx
│   └── _layout.tsx          # Root layout with auth
├── src/
│   ├── components/         # React components
│   │   ├── ui/             # Shared UI components
│   │   ├── componentName/  # Shared UI components
│   ├── lib/
│   │   ├── supabase/       # Supabase client config
│   │   └── tarot/          # Tarot deck data and logic
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useSubscription.ts
│   └── types/              # TypeScript definitions
│       ├── tarot.ts
│       ├── user.ts
│       └── database.ts
├── assets/
└── supabase/
    ├── migrations/          # Database migrations
    └── functions/           # Edge functions
```

## Database Schema

### Tables

- **users**: Extended user profile data
- **subscriptions**: User subscription status and tiers
- **readings**: Reading history with drawn cards
- **reflections**: User reflections on readings
  
See `src/types/database.ts` for full schema types.

## Development

### TypeScript

The project uses TypeScript in strict mode with path aliases:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@lib/*` → `src/lib/*`
- `@hooks/*` → `src/hooks/*`
- `@types/*` → `src/types/*`

### Code Quality

- **ESLint**: Linting with Expo and Prettier rules
- **Prettier**: Code formatting (single quotes, 100 char width)
- **TypeScript**: Strict mode enabled

## Contributing

This is a personal project, but feel free to fork and customize!

## License

MIT

---

Built with ✨ by htmelvis
