import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import type { ReadingRow } from '@hooks/useReadings';

export interface SpreadStat {
  spreadType: ReadingRow['spread_type'];
  count: number;
  percentage: number;
}

async function fetchSpreadStats(userId: string): Promise<SpreadStat[]> {
  const { data, error } = await supabase
    .from('readings')
    .select('spread_type')
    .eq('user_id', userId);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.spread_type] = (counts[row.spread_type] ?? 0) + 1;
  }

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return Object.entries(counts)
    .map(([spreadType, count]) => ({
      spreadType: spreadType as ReadingRow['spread_type'],
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function useSpreadStats(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['spread-stats', userId],
    queryFn: () => fetchSpreadStats(userId!),
    enabled: !!userId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
