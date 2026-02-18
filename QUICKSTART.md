# Magic Mystics - Quick Start Guide 🚀

## Current Status ✅

Your app is scaffolded and ready! Here's what's done:

- ✅ React Native + Expo with TypeScript
- ✅ Expo Router navigation (auth + tabs)
- ✅ Supabase client configured with your credentials
- ✅ Authentication screens (sign in/sign up)
- ✅ Database schema ready to deploy

## Next Steps

### 1. Deploy Database Schema

Go to your Supabase dashboard and run the migration:

1. Visit https://app.supabase.com/project/rbfrnhjlirnsgigozdbc
2. Go to **SQL Editor** → **New Query**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** to execute

This creates:

- User profiles table
- Subscriptions table
- Readings history table
- Reflections table
- PPF readings table
- Row Level Security policies
- Automatic user creation trigger

### 2. Test the App

Start the development server:

```bash
npm start
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

### 3. Test Authentication

1. Sign up with a test email
2. Verify the user appears in Supabase **Table Editor** → **users**
3. Check that a free subscription was auto-created in **subscriptions** table
4. Tap the "🔍 Test Supabase Connection" button on the home screen

### 4. Verify Row Level Security

In Supabase dashboard:

- Go to **Authentication** → **Policies**
- Verify policies are enabled for all tables
- Each user should only see their own data

## What to Build Next

Based on your plan, here are the next features to implement:

### High Priority

1. **Tarot Card Data** - Create the 78-card Rider-Waite deck data
2. **Card Drawing Logic** - Implement shuffle and draw functionality
3. **Card Display UI** - Build card components with Reanimated animations
4. **AI Integration** - Set up Vercel AI SDK with Supabase Edge Functions

### Medium Priority

5. **Reading History** - Display past readings in the history tab
6. **Reflections** - Add journal entry UI for each reading
7. **PPF Spread** - Build the Past/Present/Future spread flow

### Lower Priority

8. **Card Images** - Source/add Rider-Waite public domain images
9. **RevenueCat** - Integrate in-app purchases
10. **Onboarding** - Create first-time user flow

## Project Structure

```
magic-mystics/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Sign in/up
│   ├── (tabs)/            # Home, history, profile
│   └── _layout.tsx        # Root with auth guard
├── src/
│   ├── hooks/             # useAuth, useSubscription
│   ├── lib/               # Supabase client, AI integration
│   ├── types/             # TypeScript definitions
│   └── components/        # (coming soon) UI components
├── supabase/
│   ├── migrations/        # Database schema
│   └── functions/         # (coming soon) Edge functions
└── assets/                # Images, fonts

```

## Environment Variables

Your `.env` file has:

✅ `EXPO_PUBLIC_SUPABASE_URL` - Configured  
✅ `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Configured  
⚠️ `OPENAI_API_KEY` - Add when ready for AI features  
⚠️ `ANTHROPIC_API_KEY` - Add when ready for AI features

## Troubleshooting

### App won't start

```bash
rm -rf node_modules
npm install
npm start
```

### "Failed to connect to Supabase"

- Check `.env` credentials are correct
- Verify Supabase project is active
- Run database migration first

### Authentication not working

- Confirm migration ran successfully
- Check Supabase logs in dashboard
- Verify RLS policies exist

### TypeScript errors

```bash
npm run tsc --noEmit
```

## Useful Commands

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS
npm run android        # Run on Android
npm run web            # Run in browser
npm run lint           # Check code quality
npx expo doctor        # Check for issues
```

## Resources

- [Expo Docs](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## Need Help?

Check these files for detailed info:

- `README.md` - Full project documentation
- `supabase/README.md` - Database setup guide
- `src/types/` - TypeScript type definitions

---

Happy coding! 🔮✨
