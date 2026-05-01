import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import { localDateString } from '@lib/utils/date';

export interface DailyMetaphysical {
  date: string;
  moon_phase: string;
  moon_special_name: string | null;
  retrograde_planets: string[] | null;
  lucky_numbers: number[] | null;
  lucky_colors: string[] | null;
  energy_theme: string | null;
  advice: string | null;
  moon_sign: { name: string; symbol: string; element: string } | null;
}

async function fetchTodayMetaphysical(date: string): Promise<DailyMetaphysical | null> {
  const { data, error } = await supabase
    .from('daily_metaphysical_data')
    .select(
      `
      date,
      moon_phase,
      moon_special_name,
      retrograde_planets,
      lucky_numbers,
      lucky_colors,
      energy_theme,
      advice,
      moon_sign:moon_sign_id(name, symbol, element)
    `
    )
    .eq('date', date)
    .maybeSingle();

  if (error) throw error;
  return data as DailyMetaphysical | null;
}

/**
 * Fetches today's metaphysical data with aggressive caching.
 *
 * The query key includes today's date string, so the cache entry automatically
 * becomes stale the moment the calendar day rolls over — no timers needed.
 * staleTime: Infinity means a single DB round-trip per calendar day per device.
 */
export function useDailyMetaphysical() {
  const today = localDateString();

  const { data, isLoading, error } = useQuery({
    queryKey: ['daily-metaphysical', today],
    queryFn: () => fetchTodayMetaphysical(today),
    staleTime: Infinity,
    gcTime: 25 * 60 * 60 * 1000, // 25h — outlasts the day so yesterday's entry is cleaned up
    retry: 1,
  });

  return { data: data ?? null, isLoading, error };
}
