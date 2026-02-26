-- Backfill any auth.users that don't have corresponding public.users records
-- Run this in your Supabase SQL Editor to fix existing users

-- Insert missing user records
INSERT INTO public.users (id, email, display_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1)) as display_name
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Insert missing subscription records
INSERT INTO public.subscriptions (user_id, tier, is_active)
SELECT 
  pu.id,
  'free' as tier,
  true as is_active
FROM public.users pu
LEFT JOIN public.subscriptions s ON pu.id = s.user_id
WHERE s.user_id IS NULL;

-- Verify the results
SELECT 
  COUNT(*) as total_auth_users,
  (SELECT COUNT(*) FROM public.users) as total_public_users,
  (SELECT COUNT(*) FROM public.subscriptions) as total_subscriptions
FROM auth.users;
