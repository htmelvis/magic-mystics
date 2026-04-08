import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@lib/supabase/client';

// Must stay in sync with the purge-free-history edge function.
const EXPIRY_DAYS = 30;
const WARNING_START_DAYS = 23; // warn 7 days before deletion

interface ExpiringRow {
  id: string;
  created_at: string;
}

interface ExpiryResult {
  readings: ExpiringRow[];
  ppfReadings: ExpiringRow[];
}

/** Returns readings and ppf_readings that are 23–30 days old (due for deletion within 7 days). */
async function fetchExpiringRows(userId: string): Promise<ExpiryResult> {
  const now = new Date();

  // Older bound: already beyond 30 days = already purged, exclude them.
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - EXPIRY_DAYS);

  // Newer bound: not yet in the warning window.
  const warnThreshold = new Date(now);
  warnThreshold.setUTCDate(warnThreshold.getUTCDate() - WARNING_START_DAYS);

  const [readingsRes, ppfRes] = await Promise.all([
    supabase
      .from('readings')
      .select('id, created_at')
      .eq('user_id', userId)
      .gte('created_at', cutoff.toISOString())
      .lte('created_at', warnThreshold.toISOString())
      .order('created_at', { ascending: true }),

    supabase
      .from('ppf_readings')
      .select('id, created_at')
      .eq('user_id', userId)
      .gte('created_at', cutoff.toISOString())
      .lte('created_at', warnThreshold.toISOString())
      .order('created_at', { ascending: true }),
  ]);

  if (readingsRes.error) throw readingsRes.error;
  if (ppfRes.error) throw ppfRes.error;

  return {
    readings: readingsRes.data ?? [],
    ppfReadings: ppfRes.data ?? [],
  };
}

/** Dismiss key is tied to the oldest expiring date so the banner re-surfaces
 *  if new readings enter the warning window after the user dismissed. */
function dismissKey(userId: string, oldestDate: string): string {
  const day = oldestDate.split('T')[0]; // YYYY-MM-DD
  return `expiry_banner_dismissed_${userId}_${day}`;
}

/** How many days until a reading created at `createdAt` is purged. */
function daysUntilPurge(createdAt: string): number {
  const deleteAt = new Date(createdAt);
  deleteAt.setUTCDate(deleteAt.getUTCDate() + EXPIRY_DAYS);
  const msLeft = deleteAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

export interface ReadingExpiryState {
  /** Total rows (readings + ppf) about to be purged. 0 means nothing to warn about. */
  expiringCount: number;
  /** Days until the oldest expiring row is deleted. null when expiringCount is 0. */
  daysUntilOldest: number | null;
  /** True while the banner has been dismissed for the current expiry bucket. */
  isDismissed: boolean;
  /** Call to hide the banner until the next expiry bucket. */
  dismiss: () => void;
  isLoading: boolean;
}

/**
 * Tracks readings approaching the 30-day free-tier deletion window.
 *
 * Returns a stable no-op state for premium users — call it unconditionally
 * and gate display with `expiringCount > 0`.
 */
export function useReadingExpiry(
  userId: string | null | undefined,
  isPremium: boolean
): ReadingExpiryState {
  const [isDismissed, setIsDismissed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reading-expiry', userId],
    queryFn: () => fetchExpiringRows(userId!),
    enabled: !!userId && !isPremium,
    // Re-check once per hour — no need for real-time accuracy here.
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });

  const allExpiring = [...(data?.readings ?? []), ...(data?.ppfReadings ?? [])];
  const oldest = allExpiring[0] ?? null; // already sorted ASC

  // Sync dismiss state from AsyncStorage whenever the oldest expiry bucket changes.
  useEffect(() => {
    if (!userId || !oldest) {
      setIsDismissed(false);
      return;
    }
    const key = dismissKey(userId, oldest.created_at);
    AsyncStorage.getItem(key).then((val) => setIsDismissed(val === 'true'));
  }, [userId, oldest?.created_at]);

  const dismiss = useCallback(() => {
    if (!userId || !oldest) return;
    const key = dismissKey(userId, oldest.created_at);
    AsyncStorage.setItem(key, 'true');
    setIsDismissed(true);
  }, [userId, oldest]);

  if (isPremium || !data) {
    return {
      expiringCount: 0,
      daysUntilOldest: null,
      isDismissed: false,
      dismiss: () => {},
      isLoading: !isPremium && isLoading,
    };
  }

  return {
    expiringCount: allExpiring.length,
    daysUntilOldest: oldest ? daysUntilPurge(oldest.created_at) : null,
    isDismissed,
    dismiss,
    isLoading,
  };
}
