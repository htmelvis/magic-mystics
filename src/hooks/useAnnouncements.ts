import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import type { Announcement, AnnouncementTier } from '@/types/announcement';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

async function fetchActiveAnnouncements(tier: AnnouncementTier): Promise<Announcement[]> {
  const now = new Date().toISOString();
  const { data, error } = await db
    .from('announcements')
    .select('*')
    .eq('active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .in('target_tier', ['all', tier])
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Announcement[];
}

async function fetchReadIds(userId: string): Promise<string[]> {
  const { data, error } = await db
    .from('user_announcement_reads')
    .select('announcement_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map((r: { announcement_id: string }) => r.announcement_id);
}

export function useAnnouncements(userId: string | undefined, isPremium: boolean) {
  const tier: AnnouncementTier = isPremium ? 'premium' : 'free';
  const queryClient = useQueryClient();

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements', tier],
    queryFn: () => fetchActiveAnnouncements(tier),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });

  const { data: readIds = [] } = useQuery({
    queryKey: ['announcement-reads', userId],
    queryFn: () => fetchReadIds(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: markRead } = useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await db.from('user_announcement_reads').insert({
        user_id: userId!,
        announcement_id: announcementId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement-reads', userId] });
    },
  });

  const readSet = new Set(readIds);
  const unreadAnnouncements = announcements.filter(a => !readSet.has(a.id));

  return { unreadAnnouncements, markRead };
}
