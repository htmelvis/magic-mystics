import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import type { UserProfile } from '@/types/user';

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

  if (error) throw error;

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    birthDate: data.birth_date,
    birthTime: data.birth_time,
    birthLocation: data.birth_location,
    birthLat: data.birth_lat ?? null,
    birthLng: data.birth_lng ?? null,
    birthDetailsEditedAt: data.birth_details_edited_at ?? null,
    sunSign: data.sun_sign,
    moonSign: data.moon_sign,
    risingSign: data.rising_sign,
    onboardingCompleted: data.onboarding_completed,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
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
