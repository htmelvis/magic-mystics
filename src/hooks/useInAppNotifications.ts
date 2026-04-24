import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useToast } from '@/context/ToastContext';
import { useDailyCardStatus } from '@hooks/useDailyCardStatus';
import { useAnnouncements } from '@hooks/useAnnouncements';

const DAILY_CARD_COOLDOWN_KEY = 'toast:daily-card:lastShown';
const DAILY_CARD_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours
const INITIAL_DELAY_MS = 3000;

async function isCooldownExpired(key: string, cooldownMs: number): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return true;
    return Date.now() - Number(raw) > cooldownMs;
  } catch {
    return true;
  }
}

async function stampCooldown(key: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, String(Date.now()));
  } catch {
    // non-critical
  }
}

export function useInAppNotifications(userId: string | undefined, isPremium: boolean) {
  const { showToast, dismissToast } = useToast();
  const router = useRouter();
  const { data: dailyStatus } = useDailyCardStatus(userId);
  const { unreadAnnouncements, markRead } = useAnnouncements(userId, isPremium);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAnnouncementsRef = useRef<Set<string>>(new Set());

  // Daily card CTA — only fires once the query has settled (dailyStatus !== undefined)
  // so we never show the toast based on the loading/undefined state.
  useEffect(() => {
    if (!userId || dailyStatus === undefined || dailyStatus.hasDrawnToday) return;

    isCooldownExpired(DAILY_CARD_COOLDOWN_KEY, DAILY_CARD_COOLDOWN_MS).then((expired) => {
      if (!expired) return;

      timerRef.current = setTimeout(() => {
        showToast({
          id: 'daily-card',
          type: 'cta',
          title: 'Draw your daily card',
          message: "Today's cosmic message is waiting.",
          actionLabel: 'Draw Now',
          onAction: () => router.push('/daily-draw'),
        });
        stampCooldown(DAILY_CARD_COOLDOWN_KEY);
      }, INITIAL_DELAY_MS);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [userId, dailyStatus]);

  // Dismiss the daily card toast mid-session if the user draws their card
  useEffect(() => {
    if (dailyStatus?.hasDrawnToday) dismissToast('daily-card');
  }, [dailyStatus]);

  // Supabase-driven announcements — queue unread ones, mark read on dismiss
  useEffect(() => {
    if (!userId) return;

    unreadAnnouncements.forEach((a) => {
      if (shownAnnouncementsRef.current.has(a.id)) return;
      shownAnnouncementsRef.current.add(a.id);

      showToast({
        id: a.id,
        type: a.type,
        title: a.title,
        message: a.message ?? undefined,
        actionLabel: a.action_label ?? undefined,
        onAction: a.action_route ? () => router.push(a.action_route as never) : undefined,
        autoDismissMs: 8000,
      });

      // Mark read so it won't reappear on the next query refresh
      markRead(a.id);
    });
  }, [userId, unreadAnnouncements.length]);
}
