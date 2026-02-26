import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabase/client';

export function useOnboarding(userId: string | undefined) {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('onboarding_completed')
          .eq('id', userId)
          .single();

        if (error) {
          console.warn('Error checking onboarding status:', error);
          setOnboardingCompleted(false);
        } else {
          setOnboardingCompleted(data?.onboarding_completed ?? false);
        }
      } catch (error) {
        console.warn('Error in useOnboarding:', error);
        setOnboardingCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();

    // Subscribe to realtime updates so the layout reflects completion
    // immediately when calculating.tsx writes onboarding_completed: true.
    const channel = supabase
      .channel(`onboarding-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          if (typeof row['onboarding_completed'] === 'boolean') {
            setOnboardingCompleted(row['onboarding_completed']);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { onboardingCompleted, loading };
}
