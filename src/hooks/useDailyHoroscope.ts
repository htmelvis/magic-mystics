import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';

export interface DailyHoroscope {
  date: string;
  sign: string;
  headline: string | null;
  body: string | null;
  theme: string | null;
  love_note: string | null;
  career_note: string | null;
  wellness_note: string | null;
}

async function fetchDailyHoroscope(date: string, sign: string): Promise<DailyHoroscope | null> {
  const { data, error } = await supabase
    .from('daily_horoscopes')
    .select('date, sign, headline, body, theme, love_note, career_note, wellness_note')
    .eq('date', date)
    .eq('sign', sign)
    .maybeSingle();

  if (error) throw error;
  return data as DailyHoroscope | null;
}

/**
 * Fetches today's horoscope for the user's sun sign.
 *
 * The query key includes both the date string and sign, so the cache entry
 * automatically becomes stale when the calendar day rolls over.
 * staleTime: Infinity means one DB round-trip per calendar day per device.
 */
export function useDailyHoroscope(sunSign: string | null | undefined) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, isLoading, error } = useQuery({
    queryKey: ['daily-horoscope', today, sunSign],
    queryFn: () => fetchDailyHoroscope(today, sunSign!),
    enabled: !!sunSign,
    staleTime: Infinity,
    gcTime: 25 * 60 * 60 * 1000, // 25h — outlasts the day
    retry: 1,
  });

  return { data: data ?? null, isLoading, error };
}
