import { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/context/ThemeContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen, Card, Badge, Button, Skeleton, SkeletonCard, ZodiacAvatar, NatalChartWheel } from '@components/ui';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';
import { computeNatalChart } from '@lib/astrology/natal-chart';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
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
  const { subscription, isPremium, loading: subLoading } = useSubscription(user?.id);
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const isLoading = authLoading || profileLoading || subLoading;
  const { activeColorScheme, toggleColorScheme, setColorScheme, colorScheme } = useTheme();
  const theme = useAppTheme();
  const { open: openUpgradeSheet } = useUpgradeSheet();
  const [retryingGeocode, setRetryingGeocode] = useState(false);
  const [geocodeCoolingDown, setGeocodeCoolingDown] = useState(false);
  const lastGeocodeAttempt = useRef<number>(0);
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
    ) return;

    hasComputedChart.current = true;
    const [year, month, day] = userProfile.birthDate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day, 12, 0, 0);
    const chart = computeNatalChart(
      birthDate,
      userProfile.birthTime,
      userProfile.birthLat,
      userProfile.birthLng,
    );
    supabase
      .from('users')
      .update({ natal_chart_data: chart } as never)
      .eq('id', user.id)
      .then(() => queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] }));
  }, [user, userProfile, queryClient]);

  const GEOCODE_COOLDOWN_MS = 30_000;

  const handleRetryGeocode = useCallback(async () => {
    if (!user || !userProfile?.birthLocation || !userProfile?.birthDate || !userProfile?.birthTime) return;
    if (retryingGeocode || geocodeCoolingDown) return;

    const now = Date.now();
    if (now - lastGeocodeAttempt.current < GEOCODE_COOLDOWN_MS) return;
    lastGeocodeAttempt.current = now;

    setRetryingGeocode(true);
    try {
      const coords = await geocodeLocation(userProfile.birthLocation);
      if (!coords) {
        Alert.alert('Location not found', 'Could not resolve your birth location. Please try again later.');
        return;
      }
      const timezone = await getTimezone(coords.lat, coords.lng);

      // Recompute natal chart with real coords so ASC/MC are filled in.
      const [year, month, day] = userProfile.birthDate.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day, 12, 0, 0);
      const natalChart = computeNatalChart(birthDate, userProfile.birthTime, coords.lat, coords.lng);

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
      setRetryingGeocode(false);
      setGeocodeCoolingDown(true);
      setTimeout(() => setGeocodeCoolingDown(false), GEOCODE_COOLDOWN_MS);
    }
  }, [user, userProfile, queryClient, retryingGeocode, geocodeCoolingDown]);

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
          <Text style={styles.title}>
            {userProfile?.displayName || 'Profile'}
          </Text>
          <Text style={[styles.email, { color: theme.colors.text.secondary }]}>{user?.email}</Text>
        </View>
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Appearance</Text>
        <Card variant="outlined">
          <View style={styles.themeRow}>
            <View>
              <Text style={[styles.themeTitle, { color: theme.colors.text.primary }]}>Dark Mode</Text>
              <Text style={[styles.themeSubtitle, { color: theme.colors.text.muted }]}>
                {activeColorScheme === 'dark' ? 'On' : 'Off'}
              </Text>
            </View>
            <Pressable
              style={[
                styles.toggle,
                { backgroundColor: activeColorScheme === 'dark' ? theme.colors.brand.primary : theme.colors.gray[300] }
              ]}
              onPress={toggleColorScheme}
              accessibilityRole="switch"
              accessibilityLabel="Dark mode"
              accessibilityState={{ checked: activeColorScheme === 'dark' }}
            >
              <View
                style={[
                  styles.toggleKnob,
                  { 
                    backgroundColor: theme.colors.surface.card,
                    transform: [{ translateX: activeColorScheme === 'dark' ? 24 : 2 }]
                  }
                ]}
              />
            </Pressable>
          </View>
          {colorScheme === 'auto' && (
            <Text style={[styles.autoModeText, { color: theme.colors.text.muted }]}>
              Following system preference
            </Text>
          )}
        </Card>
      </View>

      {/* Natal Chart preview — taps to full-screen */}
      <Pressable
        style={styles.section}
        onPress={() => router.push('/(tabs)/natal-chart')}
        accessibilityRole="button"
        accessibilityLabel="View your natal chart"
        accessibilityHint="Opens full natal chart"
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Natal Chart</Text>
          <Text style={[styles.sectionChevron, { color: theme.colors.brand.primary }]}>View Full →</Text>
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
              {userProfile?.birthDate ? 'Generating chart…' : 'Complete birth details to generate chart'}
            </Text>
          )}
        </Card>
      </Pressable>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary, marginBottom: 0 }]}>
            Birth Details
          </Text>
          {!userProfile?.birthDetailsEditedAt && (
            <Pressable
              onPress={() => router.push('/(tabs)/edit-birth-details')}
              accessibilityRole="button"
              accessibilityLabel="Edit birth details"
            >
              <Text style={[styles.editLink, { color: theme.colors.brand.primary }]}>Edit</Text>
            </Pressable>
          )}
        </View>
        <Card variant="outlined">
          <Text style={[styles.birthDetailText, { color: theme.colors.text.primary }]}>
            Date: {formatBirthDate(userProfile?.birthDate ?? null)}
          </Text>
          <Text style={[styles.birthDetailText, { color: theme.colors.text.primary }]}>
            Time: {formatBirthTime(userProfile?.birthTime ?? null)}
            {userProfile?.birthTimezone ? (
              <Text style={{ color: theme.colors.text.muted, fontSize: 13 }}>
                {' '}({userProfile.birthTimezone})
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
          {userProfile?.birthLocation && !userProfile?.birthLat && (
            <Pressable
              onPress={handleRetryGeocode}
              disabled={retryingGeocode || geocodeCoolingDown}
              accessibilityRole="button"
              accessibilityLabel="Resolve birth location coordinates"
              style={[
                styles.geocodeButton,
                {
                  backgroundColor:
                    retryingGeocode || geocodeCoolingDown
                      ? theme.colors.gray[300]
                      : theme.colors.brand.primary,
                },
              ]}
            >
              {retryingGeocode ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.geocodeButtonText}>
                  {geocodeCoolingDown ? 'Resolving…' : 'Complete Location & Chart'}
                </Text>
              )}
            </Pressable>
          )}
        </Card>
        {userProfile?.birthDetailsEditedAt && (
          <Text style={[styles.editedNote, { color: theme.colors.text.muted }]}>
            Birth details have already been edited once and cannot be changed again.
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <Card variant="filled">
          <Badge 
            label={isPremium ? '✨ Premium Member' : '🌙 Free Tier'}
            variant={isPremium ? 'primary' : 'default'}
            size="lg"
            style={{ marginBottom: theme.spacing.sm }}
          />
          {isPremium && subscription?.expiry_date && (
            <Text style={styles.expiryText}>
              Expires: {new Date(subscription.expiry_date).toLocaleDateString()}
            </Text>
          )}
          {!isPremium && (
            <Button
              title="Upgrade to Premium"
              variant="primary"
              onPress={openUpgradeSheet}
              style={{ marginTop: theme.spacing.sm }}
            />
          )}
        </Card>
      </View>

      <View style={[styles.section, { marginTop: 'auto' }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Support</Text>
        <Card variant="outlined">
          <Pressable
            style={styles.supportRow}
            onPress={() => router.push('/(tabs)/support')}
            accessibilityRole="button"
            accessibilityLabel="Get help or send feedback"
          >
            <Text style={[styles.supportRowLabel, { color: theme.colors.text.primary }]}>
              Get Help / Send Feedback
            </Text>
            <Text style={[styles.supportRowChevron, { color: theme.colors.text.muted }]}>›</Text>
          </Pressable>
        </Card>
      </View>

      <Button
        title="Sign Out"
        variant="destructive"
        onPress={handleSignOut}
        fullWidth
        style={{ marginTop: 16 }}
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
      <Skeleton
        width="100%"
        height={48}
        borderRadius={12}
        style={{ marginTop: 'auto' }}
      />
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
  expiryText: {
    fontSize: 13,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeSubtitle: {
    fontSize: 13,
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  autoModeText: {
    fontSize: 12,
    marginTop: 12,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editLink: {
    fontSize: 15,
    fontWeight: '600',
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
  geocodeButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  geocodeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  editedNote: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  supportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supportRowLabel: {
    fontSize: 15,
  },
  supportRowChevron: {
    fontSize: 20,
    lineHeight: 22,
  },
});
