# Magic Mystics - Tech & Product Overview

## What It Is

A mobile-first tarot reading app that combines daily tarot card pulls with personalized astrology insights. Users get AI-powered interpretations of their readings based on their birth chart data.

## Product Features

### Core Features (MVP)

- **Daily Tarot Card Draw**: Single card pull each day with AI-generated interpretations
- **Astrology Integration**: Personalized readings based on Sun, Moon, and Rising signs
- **User Onboarding**: Birth data collection to calculate astrological placements
- **Reading History**: Save and review past readings (limited for free, unlimited for premium)
- **User Reflections**: Journal entries for each reading
- **Subscription Tiers**:
  - Free: 30 readings history, basic features
  - Premium: $49/year - unlimited history, PPF spreads, contextual AI

### Planned Features

- **Past/Present/Future Spread**: Monthly 3-card spread (premium only)
- **Card Animations**: Shuffle and reveal animations with React Native Reanimated
- **AI Insights**: Context-aware interpretations using reading history
- **Rider-Waite Deck**: Public domain tarot imagery
- **In-App Purchases**: RevenueCat integration for subscriptions

## Tech Stack

### Frontend

- **React Native** - Cross-platform mobile framework
- **Expo** (~54.0) - Development and build tooling
- **Expo Router** (v6) - File-based navigation
- **TypeScript** - Type safety with strict mode
- **React Native Reanimated** - Card animations (planned)

### Backend & Services

- **Supabase** - Backend as a service
  - PostgreSQL database
  - Row Level Security (RLS) for data isolation
  - Authentication (email/password)
  - Edge Functions (planned for AI)
- **Vercel AI SDK** - AI integrations with provider fallbacks
  - OpenAI
  - Anthropic Claude
- **RevenueCat** (planned) - In-app purchase management

### Storage

- **Expo SecureStore** - Secure auth token storage (iOS/Android)
- **AsyncStorage** - Web storage fallback
- **Supabase Storage** - Asset and image hosting (planned)

### Development Tools

- **ESLint + Prettier** - Code quality and formatting
- **TypeScript** - Static typing
- **Git** - Version control

## Architecture

### App Structure

```bash
app/
├── (auth)/           # Authentication flows
├── (onboarding)/     # First-time user setup
├── (tabs)/           # Main app navigation
└── _layout.tsx       # Root layout with auth routing
```

### Data Flow

1. **Authentication**: Supabase Auth → SecureStore/AsyncStorage
2. **User Profile**: Trigger creates profile + free subscription on signup
3. **Onboarding**: Collects birth data → Calculates astrology signs → Saves to DB
4. **Readings**: Card draw → AI interpretation → Save to database → User reflection

### Database Schema

- **users**: Extended profile with birth data and astrology signs
- **subscriptions**: User tier and expiry tracking
- **readings**: Card draws with AI insights
- **reflections**: User journal entries per reading
- **ppf_readings**: Past/Present/Future spread results

## Key Technical Decisions

### Why Expo?

- Fast iteration with hot reloading
- Simplified native module integration
- Easy OTA updates
- Built-in navigation (Expo Router)

### Why Supabase?

- Real-time capabilities for future features
- Built-in auth and RLS
- PostgreSQL for complex queries
- Edge Functions for AI processing

### Why File-Based Routing?

- Cleaner navigation structure
- Better type safety
- Easier to maintain as app grows
- Natural grouping of related screens

## Product Positioning

### Target Users

- Astrology enthusiasts looking for daily guidance
- Tarot readers who want digital tools
- Spiritual wellness seekers
- Users interested in self-reflection and journaling

### Unique Value Props

- **Personalized Readings**: Uses actual birth chart data, not just sun signs
- **AI-Enhanced Interpretations**: Context from reading history
- **Simple Daily Ritual**: One card per day keeps it accessible
- **Premium Features**: Monthly spreads and unlimited history for serious users

### Monetization

- **Freemium Model**: Free tier with limited history
- **Annual Subscription**: $49/year for premium features
- **No Ads**: Clean, distraction-free experience

## Current State

### ✅ Completed

- Authentication (sign up, sign in, session management)
- Onboarding flow (birth data → astrology calculation)
- User profile with zodiac signs
- Database schema with RLS policies
- Basic dashboard UI
- Subscription tier tracking

### 🚧 In Progress

- Tarot card data and deck implementation
- Card drawing logic and UI
- Reading history views

### 📋 Planned

- AI integration for card interpretations
- Past/Present/Future spread
- Card animations
- RevenueCat integration
- Reflection/journaling interface
- Reading history with filters

## Development Setup

### Prerequisites

- Node.js 18+
- Expo CLI
- Supabase account
- iOS Simulator (Mac) or Android Emulator

### Quick Start

```bash
npm install
npm start
# Press 'w' for web, 'i' for iOS, 'a' for Android
```

### Environment Variables

```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-key (optional)
ANTHROPIC_API_KEY=your-key (optional)
```

## Performance Considerations

- Lazy loading for card images
- Optimistic UI updates for card draws
- Caching reading history locally
- Background sync for offline support (planned)

## Security

- Row Level Security on all database tables
- Secure token storage with encryption
- API keys via environment variables
- No sensitive data in client-side code
