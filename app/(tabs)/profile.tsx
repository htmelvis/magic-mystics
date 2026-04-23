import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  Screen,
  Card,
  Button,
  Skeleton,
  SkeletonCard,
  ZodiacAvatar,
  NatalChartWheel,
} from '@components/ui';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';
import { computeNatalChart } from '@lib/astrology/natal-chart';
import { supabase } from '@lib/supabase/client';
import { geocodeLocation, getTimezone } from '@lib/geocoding/geocode';
function formatBirthDate(birthDate: string | null): string {
  if (!birthDate) return '—';
  const d = new Date(birthDate + 'T00:00:00');
  if (isNaN(d.getTime())) return birthDate;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatBirthTime(birthTime: string | null): string {
  if (!birthTime) return '—';
  const [h, m] = birthTime.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return birthTime;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ProfileScreen() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const isLoading = authLoading || profileLoading;
  const theme = useAppTheme();
  const [geocoding, setGeocoding] = useState(false);
  const hasGeocodedRef = useRef(false);
  const hasComputedChart = useRef(false);

  // Lazy-compute natal chart on first profile view for users who onboarded before this feature
  useEffect(() => {
    if (
      hasComputedChart.current ||
      !user ||
      !userProfile ||
      userProfile.natalChartData ||
      !userProfile.birthDate ||
      !userProfile.birthTime
    )
      return;

    hasComputedChart.current = true;
    const [year, month, day] = userProfile.birthDate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day, 12, 0, 0);
    const chart = computeNatalChart(
      birthDate,
      userProfile.birthTime,
      userProfile.birthLat,
      userProfile.birthLng
    );
    supabase
      .from('users')
      .update({ natal_chart_data: chart } as never)
      .eq('id', user.id)
      .then(() => queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] }));
  }, [user, userProfile, queryClient]);

  // Auto-geocode on profile load for users whose birth_lat was never resolved
  useEffect(() => {
    if (
      hasGeocodedRef.current ||
      !user ||
      !userProfile ||
      userProfile.birthLat ||
      !userProfile.birthLocation ||
      !userProfile.birthDate ||
      !userProfile.birthTime
    )
      return;

    hasGeocodedRef.current = true;
    setGeocoding(true);

    (async () => {
      try {
        const coords = await geocodeLocation(userProfile.birthLocation!);
        if (!coords) return;

        const timezone = await getTimezone(coords.lat, coords.lng);
        const [year, month, day] = userProfile.birthDate!.split('-').map(Number);
        const birthDate = new Date(year, month - 1, day, 12, 0, 0);
        const natalChart = computeNatalChart(
          birthDate,
          userProfile.birthTime!,
          coords.lat,
          coords.lng
        );

        await supabase
          .from('users')
          .update({
            birth_lat: coords.lat,
            birth_lng: coords.lng,
            birth_timezone: timezone ?? null,
            natal_chart_data: natalChart,
          })
          .eq('id', user.id);
        await queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
      } finally {
        setGeocoding(false);
      }
    })();
  }, [user, userProfile, queryClient]);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <Screen>
        <ProfileSkeleton />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.profileHeader}>
        {userProfile?.sunSign && (
          <ZodiacAvatar sign={userProfile.sunSign as ZodiacSign} size={56} />
        )}
        <View style={styles.profileHeaderText}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>{userProfile?.displayName || 'Profile'}</Text>
          <Text style={[styles.email, { color: theme.colors.text.secondary }]}>{user?.email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="cog-outline" size={26} color={theme.colors.text.muted} />
        </TouchableOpacity>
      </View>

      {/* Tarot card associated with sun sign */}
      {userProfile?.tarotCard && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Your Tarot Card</Text>
          <Card variant="outlined">
            <Text style={[styles.tarotCardName, { color: theme.colors.brand.primaryDark }]}>
              {userProfile.tarotCard.name}
            </Text>
            {userProfile.tarotCard.associationType && (
              <Text style={[styles.tarotCardType, { color: theme.colors.brand.secondary }]}>
                {userProfile.tarotCard.associationType}
              </Text>
            )}
            {userProfile.tarotCard.associationDescription && (
              <Text style={[styles.tarotCardSummary, { color: theme.colors.text.secondary }]}>
                {userProfile.tarotCard.associationDescription}
              </Text>
            )}
          </Card>
        </View>
      )}

      {/* Natal Chart preview — taps to full-screen */}
      <Pressable
        style={styles.section}
        onPress={() => router.push('/(tabs)/natal-chart')}
        accessibilityRole="button"
        accessibilityLabel="View your natal chart"
        accessibilityHint="Opens full natal chart"
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Natal Chart</Text>
          <Text style={[styles.sectionChevron, { color: theme.colors.brand.primary }]}>
            View Full →
          </Text>
        </View>
        <Card variant="outlined">
          {userProfile?.natalChartData ? (
            <View style={styles.chartPreviewRow}>
              <NatalChartWheel
                chart={userProfile.natalChartData}
                size={120}
                showOuterPlanets={false}
              />
              <View style={styles.chartPreviewSigns}>
                <Text style={[styles.signText, { color: theme.colors.text.primary }]}>
                  ☉ {userProfile.sunSign || '—'}
                </Text>
                <Text style={[styles.signText, { color: theme.colors.text.primary }]}>
                  ☽ {userProfile.moonSign || '—'}
                </Text>
                <Text style={[styles.signText, { color: theme.colors.text.primary }]}>
                  ↑ {userProfile.risingSign || '—'}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.signText, { color: theme.colors.text.muted }]}>
              {userProfile?.birthDate
                ? 'Generating chart…'
                : 'Complete birth details to generate chart'}
            </Text>
          )}
        </Card>
      </Pressable>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Birth Details
        </Text>
        <Card variant="outlined">
          <Text style={[styles.birthDetailText, { color: theme.colors.text.primary }]}>
            {formatBirthDate(userProfile?.birthDate ?? null)}
          </Text>
          <Text style={[styles.birthDetailText, { color: theme.colors.text.primary }]}>
            Time: {formatBirthTime(userProfile?.birthTime ?? null)}
            {userProfile?.birthTimezone ? (
              <Text style={{ color: theme.colors.text.muted, fontSize: 13 }}>
                {' '}
                ({userProfile.birthTimezone})
              </Text>
            ) : null}
          </Text>
          <Text style={[styles.birthDetailText, { color: theme.colors.text.primary }]}>
            Location: {userProfile?.birthLocation || '—'}
          </Text>
          {(userProfile?.sunSign || userProfile?.moonSign || userProfile?.risingSign) && (
            <View style={styles.signsRow}>
              {userProfile.sunSign ? (
                <View style={[styles.signChip, { backgroundColor: theme.colors.surface.subtle }]}>
                  <Text style={[styles.signChipText, { color: theme.colors.text.primary }]}>
                    ☉ {userProfile.sunSign}
                  </Text>
                </View>
              ) : null}
              {userProfile.moonSign ? (
                <View style={[styles.signChip, { backgroundColor: theme.colors.surface.subtle }]}>
                  <Text style={[styles.signChipText, { color: theme.colors.text.primary }]}>
                    ☽ {userProfile.moonSign}
                  </Text>
                </View>
              ) : null}
              {userProfile.risingSign ? (
                <View style={[styles.signChip, { backgroundColor: theme.colors.surface.subtle }]}>
                  <Text style={[styles.signChipText, { color: theme.colors.text.primary }]}>
                    ↑ {userProfile.risingSign}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
          {geocoding && (
            <View style={styles.geocodingRow}>
              <ActivityIndicator size="small" color={theme.colors.brand.primary} />
              <Text style={[styles.geocodingText, { color: theme.colors.text.muted }]}>
                Resolving location…
              </Text>
            </View>
          )}
        </Card>
      </View>

      <Button
        title="Sign Out"
        variant="destructive"
        onPress={handleSignOut}
        fullWidth
        style={{ marginTop: 16, marginBottom: 56 }}
      />
    </Screen>
  );
}

function ProfileSkeleton() {
  const t = useAppTheme();
  return (
    <View style={{ paddingTop: 40, gap: t.spacing.xxl, flex: 1 }}>
      {/* Title */}
      <Skeleton width="35%" height={28} />

      {/* Account */}
      <View style={{ gap: t.spacing.sm }}>
        <Skeleton width="25%" height={18} />
        <Skeleton width="60%" height={15} />
      </View>

      {/* Zodiac Signs */}
      <View style={{ gap: t.spacing.sm }}>
        <Skeleton width="35%" height={18} />
        <View
          style={{
            backgroundColor: t.colors.surface.card,
            borderRadius: t.borderRadius.card,
            borderWidth: 1,
            borderColor: t.colors.border.main,
            padding: t.spacing.cardPadding,
            gap: t.spacing.sm,
          }}
        >
          <Skeleton width="55%" height={15} />
          <Skeleton width="50%" height={15} />
          <Skeleton width="52%" height={15} />
        </View>
      </View>

      {/* Subscription */}
      <View style={{ gap: t.spacing.sm }}>
        <Skeleton width="40%" height={18} />
        <SkeletonCard />
      </View>

      {/* Sign out button */}
      <Skeleton width="100%" height={48} borderRadius={12} style={{ marginTop: 'auto' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
    marginBottom: 32,
  },
  profileHeaderText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  email: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionChevron: {
    fontSize: 13,
    fontWeight: '600',
  },
  chartPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  chartPreviewSigns: {
    flex: 1,
    gap: 6,
  },
  signText: {
    fontSize: 15,
    marginBottom: 8,
  },
  birthDetailText: {
    fontSize: 15,
    marginBottom: 8,
  },
  signsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  signChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  signChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tarotCardName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  tarotCardType: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tarotCardSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  geocodingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  geocodingText: {
    fontSize: 13,
  },
});
