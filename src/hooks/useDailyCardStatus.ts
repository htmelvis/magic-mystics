import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import { getTodayBounds, getTodayDateString } from '@lib/tarot/date';

export function useDailyCardStatus(userId: string | undefined) {
  return useQuery({
    queryKey: ['daily-card-status', userId, getTodayDateString()],
    queryFn: async () => {
      const { start, end } = getTodayBounds();
      const { data } = await supabase
        .from('readings')
        .select('id')
        .eq('user_id', userId!)
        .eq('spread_type', 'daily')
        .gte('created_at', start)
        .lte('created_at', end)
        .maybeSingle();
      return { hasDrawnToday: !!data };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
