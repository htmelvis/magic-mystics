import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';

export interface JourneyStats {
  readings: number;
  reflections: number;
  daysActive: number;
}

async function fetchJourneyStats(userId: string): Promise<JourneyStats> {
  // Run all three queries in parallel — no sequential waterfall.
  const [readingsResult, reflectionsResult, datesResult] = await Promise.all([
    supabase.from('readings').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('reflections').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    // Fetch only created_at to compute distinct calendar days client-side.
    // Users won't accumulate thousands of readings, so this is cheaper than
    // a server-side COUNT(DISTINCT DATE(...)) which would require an RPC.
    supabase.from('readings').select('created_at').eq('user_id', userId),
  ]);

  if (readingsResult.error) throw readingsResult.error;
  if (reflectionsResult.error) throw reflectionsResult.error;
  if (datesResult.error) throw datesResult.error;

  const daysActive = new Set((datesResult.data ?? []).map(r => r.created_at.split('T')[0])).size;

  return {
    readings: readingsResult.count ?? 0,
    reflections: reflectionsResult.count ?? 0,
    daysActive,
  };
}

export function useJourneyStats(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['journey-stats', userId],
    queryFn: () => fetchJourneyStats(userId!),
    enabled: !!userId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

/** Call after creating a reading or reflection so the stats update immediately. */
export function useInvalidateJourneyStats() {
  const qc = useQueryClient();
  return (userId: string) => qc.invalidateQueries({ queryKey: ['journey-stats', userId] });
}
