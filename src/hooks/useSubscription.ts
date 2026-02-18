import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabase/client';
import type { Subscription, UserLimits } from '@types/user';

const FREE_TIER_LIMITS: UserLimits = {
  maxReadingHistory: 30, // Last 30 readings
  canAccessPPF: false,
  hasAIContext: false,
};

const PREMIUM_TIER_LIMITS: UserLimits = {
  maxReadingHistory: -1, // Unlimited
  canAccessPPF: true,
  hasAIContext: true,
};

export function useSubscription(userId: string | null | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [limits, setLimits] = useState<UserLimits>(FREE_TIER_LIMITS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setLimits(FREE_TIER_LIMITS);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('userId', userId)
        .eq('isActive', true)
        .single();

      if (error) {
        console.warn('Error fetching subscription:', error);
        setSubscription(null);
        setLimits(FREE_TIER_LIMITS);
      } else {
        setSubscription(data);
        setLimits(data.tier === 'premium' ? PREMIUM_TIER_LIMITS : FREE_TIER_LIMITS);
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [userId]);

  const isPremium = subscription?.tier === 'premium' && subscription.isActive;

  return {
    subscription,
    limits,
    isPremium,
    loading,
  };
}
