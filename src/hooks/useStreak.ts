import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import { localDateString } from '@lib/utils/date';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  monthlyActivity: { month: string; count: number }[];
}

function computeStreakData(rawDates: string[]): StreakData {
  if (rawDates.length === 0) {
    const now = new Date();
    const monthlyActivity = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { month: d.toLocaleDateString(undefined, { month: 'short' }), count: 0 };
    });
    return { currentStreak: 0, longestStreak: 0, monthlyActivity };
  }

  const uniqueDays = [...new Set(rawDates.map(d => d.split('T')[0]))].sort();

  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const diffDays = Math.round(
      (new Date(uniqueDays[i]).getTime() - new Date(uniqueDays[i - 1]).getTime()) / 86400000
    );
    if (diffDays === 1) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  const today = localDateString();
  const _now = new Date();
  const _yest = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate() - 1);
  const yesterday = localDateString(_yest);
  const lastDay = uniqueDays[uniqueDays.length - 1];

  let currentStreak = 0;
  if (lastDay === today || lastDay === yesterday) {
    currentStreak = 1;
    for (let i = uniqueDays.length - 2; i >= 0; i--) {
      const diffDays = Math.round(
        (new Date(uniqueDays[i + 1]).getTime() - new Date(uniqueDays[i]).getTime()) / 86400000
      );
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  const now = new Date();
  const monthlyActivity = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const count = rawDates.filter(date => date.startsWith(monthKey)).length;
    return { month: d.toLocaleDateString(undefined, { month: 'short' }), count };
  });

  return { currentStreak, longestStreak: longest, monthlyActivity };
}

async function fetchStreakData(userId: string): Promise<StreakData> {
  const { data, error } = await supabase
    .from('readings')
    .select('created_at')
    .eq('user_id', userId);

  if (error) throw error;
  return computeStreakData((data ?? []).map(r => r.created_at));
}

export function useStreak(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['streak', userId],
    queryFn: () => fetchStreakData(userId!),
    enabled: !!userId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
