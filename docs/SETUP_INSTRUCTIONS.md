# Magic Mystics - Setup Instructions

## 🚀 Quick Start

### 1. Database Setup (Required)

Your Supabase credentials are already configured in `.env`. Now you need to run the database migration:

1. Go to your Supabase dashboard: [https://app.supabase.com/project/rbfrnhjlirnsgigozdbc]
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/APPLY_MIGRATIONS.sql`
5. Paste it into the SQL editor
6. Click **Run** (or press Cmd+Enter)

This will create all the tables, indexes, policies, and triggers needed for the app.

### 2. Run the App

```bash
npm start
```

Then choose your platform:

- Press `w` for web (easiest to test)
- Press `i` for iOS simulator
- Press `a` for Android emulator

### 3. Test the Flow

1. **Sign Up**: Create a new account with your email
2. **Onboarding**: Complete the birth info questionnaire
3. **Dashboard**: See your personalized dashboard with zodiac signs!

## 🔧 What's Been Built

### Authentication Flow

- ✅ Sign up screen with validation
- ✅ Sign in screen
- ✅ Auto-redirect based on auth state

### Onboarding Flow

- ✅ Welcome screen
- ✅ Birth date picker
- ✅ Birth time picker
- ✅ Birth location input
- ✅ Calculating screen (calculates Sun, Moon, Rising signs)

### Dashboard

- ✅ Personalized greeting (time-based)
- ✅ User profile with zodiac signs
- ✅ Draw Daily Card button
- ✅ Past/Present/Future spread (premium feature)
- ✅ Premium upgrade card (for free users)
- ✅ Stats card (for premium users)

## 🐛 Troubleshooting

### "Blank screen" or "Open App.tsx" message

This was caused by the old `App.tsx` entry point. Fixed by updating `index.ts` to use Expo Router.

### Storage/SecureStore errors

Fixed by using platform-specific storage (SecureStore for iOS/Android, AsyncStorage for web).

### Database errors

Make sure you've run the migration SQL in Supabase dashboard.

## 📁 Project Structure

```bash
magic-mystics/
├── app/
│   ├── (auth)/          # Sign in/up screens
│   ├── (onboarding)/    # Onboarding flow
│   ├── (tabs)/          # Main app (home, history, profile)
│   └── _layout.tsx      # Root layout with auth + onboarding routing
├── src/
│   ├── hooks/           # useAuth, useOnboarding, useSubscription
│   ├── lib/
│   │   ├── astrology/   # Zodiac sign calculations
│   │   └── supabase/    # Supabase client
│   └── types/           # TypeScript definitions
└── supabase/
    └── migrations/      # Database setup
```

## 🔮 Next Steps

Now that the core is set up, you can:

- Add tarot card drawing functionality
- Implement reading history
- Add reflections/journaling
- Integrate AI for card insights
- Add RevenueCat for in-app purchases
- Create card animations with Reanimated

Happy coding! ✨
