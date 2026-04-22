import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import type { DailyPlanetaryAlignment } from '@/types/metaphysical';

async function fetchTodayPlanetaryAlignment(date: string): Promise<DailyPlanetaryAlignment | null> {
  const { data, error } = await supabase
    .from('daily_planetary_alignment')
    .select(
      `
      date,
      dominant_planet,
      dominant_planet_sign,
      dominant_planet_symbol,
      alignment_theme,
      supported_endeavors,
      all_planet_positions,
      advice
    `
    )
    .eq('date', date)
    .maybeSingle();

  if (error) throw error;
  return data as DailyPlanetaryAlignment | null;
}

/**
 * Fetches today's dominant planetary alignment with aggressive caching.
 * One DB round-trip per calendar day per device — cache invalidates automatically
 * when the date changes because the query key includes today's date string.
 */
function localDateString(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

export function useDailyPlanetaryAlignment() {
  const today = localDateString();

  const { data, isLoading, error } = useQuery({
    queryKey: ['daily-planetary-alignment', today],
    queryFn: () => fetchTodayPlanetaryAlignment(today),
    staleTime: Infinity,
    gcTime: 25 * 60 * 60 * 1000, // 25h
    retry: 1,
  });

  return { data: data ?? null, isLoading, error };
}
