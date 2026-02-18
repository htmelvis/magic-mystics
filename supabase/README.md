# Supabase Setup Guide

## Database Setup

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project at https://app.supabase.com
2. Navigate to **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Click **Run** to execute the migration
6. Verify tables were created in **Table Editor**

### Option 2: Using Supabase CLI

1. Install Supabase CLI:

```bash
npm install -g supabase
```

2. Link your project:

```bash
supabase link --project-ref your-project-ref
```

3. Push migrations:

```bash
supabase db push
```

## Verify Setup

After running the migration, verify the following tables exist:

- `users`
- `subscriptions`
- `readings`
- `reflections`
- `ppf_readings`

### Check Row Level Security

In the Supabase dashboard, go to **Authentication > Policies** and ensure RLS policies are
enabled for all tables.

## Database Schema

### users

Extends `auth.users` with profile information:

- `id` (UUID, Primary Key)
- `email` (TEXT)
- `display_name` (TEXT, nullable)
- `avatar_url` (TEXT, nullable)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### subscriptions

Manages user subscription tiers:

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `tier` ('free' | 'premium')
- `start_date`, `expiry_date` (TIMESTAMPTZ)
- `is_active` (BOOLEAN)
- `auto_renew` (BOOLEAN)

### readings

Stores tarot reading history:

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `spread_type` ('daily' | 'past-present-future')
- `drawn_cards` (JSONB) - Array of drawn cards with orientation
- `ai_insight` (TEXT, nullable)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### reflections

User journal entries for readings:

- `id` (UUID, Primary Key)
- `reading_id` (UUID, Foreign Key → readings)
- `user_id` (UUID, Foreign Key → users)
- `content` (TEXT)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### ppf_readings

Past/Present/Future spreads (premium feature):

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `past_card`, `present_card`, `future_card` (JSONB)
- `ai_insight` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ)

## Automatic Features

### New User Creation

When a user signs up via Supabase Auth, the `handle_new_user()` trigger automatically:

1. Creates a profile in the `users` table
2. Creates a default free subscription

### Updated Timestamps

All tables with `updated_at` fields automatically update the timestamp on row updates.

## Testing the Integration

After setup, test the integration by:

1. Starting your Expo app: `npm start`
2. Signing up a new user
3. Verifying the user appears in the `users` and `subscriptions` tables
4. Check that RLS policies prevent users from viewing other users' data

## Troubleshooting

### "relation does not exist" error

- Make sure the migration ran successfully
- Check you're using the correct database (not a different branch/project)

### RLS policy errors

- Verify RLS is enabled on all tables
- Check that policies allow the operations you're attempting
- Ensure you're authenticated when testing from the app

### Trigger not firing

- Verify triggers exist in **Database > Triggers**
- Check function definitions in **Database > Functions**
- Review Supabase logs for error messages
