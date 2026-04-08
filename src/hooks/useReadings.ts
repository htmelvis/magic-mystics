import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import type { DrawnCardRecord } from '@/types/tarot';

export interface ReadingRow {
  id: string;
  spread_type: 'daily' | 'past-present-future';
  drawn_cards: DrawnCardRecord[];
  ai_insight: string | null;
  created_at: string;
}

const PAGE_SIZE = 20;

async function fetchPage(
  userId: string,
  offset: number,
  maxHistory: number
): Promise<ReadingRow[]> {
  // For free users, never fetch beyond their history cap — enforced server-side
  // so no extra data is transferred regardless of what the client requests.
  const cap = maxHistory === -1 ? PAGE_SIZE : Math.min(PAGE_SIZE, maxHistory - offset);
  if (cap <= 0) return [];

  const { data, error } = await supabase
    .from('readings')
    .select('id, spread_type, drawn_cards, ai_insight, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + cap - 1);

  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    spread_type: r.spread_type as ReadingRow['spread_type'],
    drawn_cards: (r.drawn_cards as DrawnCardRecord[]) ?? [],
  }));
}

/**
 * Paginated reading history for a user.
 *
 * Respects the subscription limit (maxHistory) at the query level — free
 * users never receive more rows than their plan allows.
 *
 * Call `invalidateReadings(userId)` from the draw screen (or any screen that
 * creates a reading) so the list reflects new entries without waiting for
 * the 60-second stale window to expire.
 */
export function useReadings(userId: string | undefined, maxHistory: number) {
  return useInfiniteQuery<ReadingRow[]>({
    queryKey: ['readings', userId],
    queryFn: ({ pageParam }) => fetchPage(userId!, pageParam as number, maxHistory),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined; // last page
      const fetched = allPages.flat().length;
      if (maxHistory !== -1 && fetched >= maxHistory) return undefined; // hit cap
      return fetched; // next offset
    },
    initialPageParam: 0,
    enabled: !!userId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

/** Call this after inserting a reading to immediately reflect it in the list. */
export function useInvalidateReadings() {
  const qc = useQueryClient();
  return (userId: string) => qc.invalidateQueries({ queryKey: ['readings', userId] });
}
