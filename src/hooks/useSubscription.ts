import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import type { UserLimits } from '@/types/user';
import type { Database } from '@/types/database';

const FREE_TIER_LIMITS: UserLimits = {
  maxReadingHistory: 30,
  canAccessPPF: false,
  hasAIContext: false,
  hasJournal: false,
};

const PREMIUM_TIER_LIMITS: UserLimits = {
  maxReadingHistory: -1,
  canAccessPPF: true,
  hasAIContext: true,
  hasJournal: true,
};

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];

async function fetchSubscription(userId: string): Promise<SubscriptionRow | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // no rows — free tier
    throw error;
  }
  return data;
}

export function useSubscription(userId: string | null | undefined) {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', userId],
    queryFn: () => fetchSubscription(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // subscriptions rarely change
  });

  const isPremium = subscription?.tier === 'premium' && subscription.is_active === true;
  const limits = isPremium ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS;

  return {
    subscription: subscription ?? null,
    limits,
    isPremium,
    loading: isLoading,
  };
}
