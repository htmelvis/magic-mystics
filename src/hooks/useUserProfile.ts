import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import type { UserProfile } from '@/types/user';

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .select('*, tarot_cards!tarot_card_id(id, name, upright_summary)')
    .eq('id', userId)
    .single();

  if (error) throw error;

  const d = data as any;
  const tc = d.tarot_cards as { id: number; name: string; upright_summary: string | null } | null;

  return {
    id: d.id,
    email: d.email,
    displayName: d.display_name,
    avatarUrl: d.avatar_url,
    birthDate: d.birth_date,
    birthTime: d.birth_time,
    birthLocation: d.birth_location,
    birthLat: d.birth_lat ?? null,
    birthLng: d.birth_lng ?? null,
    birthTimezone: d.birth_timezone ?? null,
    birthDetailsEditedAt: d.birth_details_edited_at ?? null,
    sunSign: d.sun_sign,
    moonSign: d.moon_sign,
    risingSign: d.rising_sign,
    natalChartData:
      (d.natal_chart_data as import('@lib/astrology/natal-chart').StoredNatalChart | null) ?? null,
    tarotCard: tc
      ? {
          id: tc.id,
          name: tc.name,
          uprightSummary: tc.upright_summary ?? null,
          associationType: d.tarot_association_type ?? null,
          associationDescription: d.tarot_association_description ?? null,
        }
      : null,
    onboardingCompleted: d.onboarding_completed,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

export function useUserProfile(userId: string | null | undefined) {
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });

  return { userProfile: userProfile ?? null, loading: isLoading };
}
