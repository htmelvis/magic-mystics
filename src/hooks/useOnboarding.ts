import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';

async function fetchOnboardingStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data?.onboarding_completed ?? false;
}

export function useOnboarding(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: onboardingCompleted, isPending } = useQuery({
    queryKey: ['onboarding', userId],
    queryFn: () => fetchOnboardingStatus(userId!),
    enabled: !!userId,
  });

  // Realtime subscription so calculating.tsx completing onboarding
  // immediately updates the layout without waiting for a refetch.
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`onboarding-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
        payload => {
          const row = payload.new as Record<string, unknown>;
          if (typeof row['onboarding_completed'] === 'boolean') {
            queryClient.setQueryData(['onboarding', userId], row['onboarding_completed']);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return {
    onboardingCompleted: onboardingCompleted ?? null,
    // isPending is true when enabled:false (no userId yet), so the layout
    // correctly waits rather than evaluating with null onboardingCompleted.
    loading: isPending,
  };
}
