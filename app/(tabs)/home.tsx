import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useUserProfile } from '@hooks/useUserProfile';
import { useDailyMetaphysical } from '@hooks/useDailyMetaphysical';
import { useJourneyStats } from '@hooks/useJourneyStats';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  Screen,
  Card,
  Button,
  Badge,
  Skeleton,
  SkeletonCard,
  ZodiacAvatar,
  ZodiacAvatarPlaceholder,
} from '@components/ui';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { CosmicWeatherCard } from '@/components/home/CosmicWeatherCard';
import { SignsSheet } from '@/components/home/SignsSheet';
import { spacing, borderRadius } from '@theme';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';

export default function HomeScreen() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { isPremium } = useSubscription(user?.id);
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);
  const { data: cosmic, isLoading: cosmicLoading } = useDailyMetaphysical();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useJourneyStats(user?.id);
  const router = useRouter();
  const theme = useAppTheme();
  const { open: openUpgradeSheet } = useUpgradeSheet();
  const [signsSheetVisible, setSignsSheetVisible] = useState(false);

  const isLoading = authLoading || profileLoading;
  const error = authError || statsError;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Screen>
      {error && (
        <View
          style={[
            styles.errorBanner,
            {
              backgroundColor: theme.colors.error.light,
              borderColor: theme.colors.error.main,
            },
          ]}
        >
          <Text style={[styles.errorText, { color: theme.colors.error.dark }]}>
            {error.message || 'Something went wrong. Please try again.'}
          </Text>
          <TouchableOpacity
            onPress={() => refetchStats()}
            style={[styles.errorRetry, { backgroundColor: theme.colors.error.main }]}
            accessibilityRole="button"
            accessibilityLabel="Retry loading"
          >
            <Text style={styles.errorRetryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <View style={{ marginBottom: 48 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Pressable
                onPress={() => router.push('/(tabs)/profile')}
                accessibilityRole="button"
                accessibilityLabel="Go to your profile"
              >
                {userProfile?.sunSign ? (
                  <ZodiacAvatar sign={userProfile.sunSign as ZodiacSign} size={48} />
                ) : (
                  <ZodiacAvatarPlaceholder size={48} />
                )}
              </Pressable>
              <View style={styles.headerText}>
                <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>
                  {getGreeting()},&nbsp;
                  <Text style={{ color: theme.colors.text.primary }}>
                    {userProfile?.displayName || user?.email}
                  </Text>
                </Text>

                {userProfile?.sunSign && (
                  <Pressable
                    onPress={() => setSignsSheetVisible(true)}
                    accessibilityRole="button"
                    accessibilityLabel={`Your signs: Sun ${userProfile.sunSign}, Moon ${userProfile.moonSign ?? 'unknown'}, Rising ${userProfile.risingSign ?? 'unknown'}. Tap to learn more.`}
                    accessibilityHint="Opens a guide explaining your sun, moon, and rising signs"
                  >
                    <Badge
                      label={`☀️ ${userProfile.sunSign} • 🌙 ${userProfile.moonSign ?? '—'} • ⬆️ ${userProfile.risingSign ?? '—'}`}
                      variant="outline"
                      size="md"
                    />
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          {/* Cosmic Weather */}
          <CosmicWeatherCard cosmic={cosmic} isLoading={cosmicLoading} />

          {/* Draw Now */}
          <View
            style={[
              styles.drawNowCard,
              {
                backgroundColor: theme.colors.surface.card,
                borderColor: theme.colors.border.main,
                borderWidth: 1,
                borderRadius: borderRadius.card,
              },
            ]}
          >
            <Pressable
              style={[styles.drawNowCardButton]}
              onPress={() => router.push('/(tabs)/draw')}
              accessibilityRole="button"
              accessibilityLabel="Go to Draw"
              accessibilityHint="Opens the Draw tab to start a reading"
            >
              <Text style={styles.drawNowIcon} accessible={false}>
                ✨
              </Text>
              <View style={styles.drawNowText}>
                <Text style={[styles.drawNowTitle, { color: theme.colors.text.primary }]}>
                  Ready for your reading?
                </Text>
                <Text style={[styles.drawNowSubtitle, { color: theme.colors.text.secondary }]}>
                  Daily card, spreads, and more
                </Text>
              </View>
              <Text style={[styles.drawNowChevron, { color: theme.colors.text.primary }]}>›</Text>
            </Pressable>
          </View>

          {/* Premium Promo */}
          {!isPremium && (
            <View
              style={[
                styles.promoCard,
                {
                  backgroundColor: theme.colors.surface.card,
                  borderColor: theme.colors.brand.primary,
                },
              ]}
            >
              <Text style={styles.promoIcon}>✨</Text>
              <Text style={[styles.promoTitle, { color: theme.colors.brand.primary }]}>
                Unlock Premium Features
              </Text>
              <View style={styles.promoFeatures}>
                <Text style={[styles.promoFeature, { color: theme.colors.text.secondary }]}>
                  • Unlimited reading history
                </Text>
                <Text style={[styles.promoFeature, { color: theme.colors.text.secondary }]}>
                  • Monthly Past/Present/Future spreads
                </Text>
                <Text style={[styles.promoFeature, { color: theme.colors.text.secondary }]}>
                  • AI insights with personalized context
                </Text>
                <Text style={[styles.promoFeature, { color: theme.colors.text.secondary }]}>
                  • Priority support
                </Text>
              </View>
              <View style={[styles.promoFooter, { borderTopColor: theme.colors.border.main }]}>
                <Text style={[styles.promoPrice, { color: theme.colors.brand.primary }]}>
                  $49/year
                </Text>
                <Pressable
                  style={[styles.upgradeButton, { backgroundColor: theme.colors.brand.primary }]}
                  onPress={openUpgradeSheet}
                  accessibilityRole="button"
                  accessibilityLabel="Upgrade to Premium for $49 per year"
                >
                  <Text style={[styles.upgradeButtonText, { color: theme.colors.text.inverse }]}>
                    Upgrade Now
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Quick Stats */}
          {isPremium && (
            <View
              style={[
                styles.statsCard,
                {
                  backgroundColor: theme.colors.surface.card,
                  borderColor: theme.colors.border.main,
                },
              ]}
            >
              <Text style={[styles.statsTitle, { color: theme.colors.text.primary }]}>
                Your Journey
              </Text>
              {statsLoading ? (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <View style={{ alignItems: 'center', gap: spacing.xs }}>
                    <Skeleton width={50} height={28} />
                    <Skeleton width={60} height={12} />
                  </View>
                  <View style={{ alignItems: 'center', gap: spacing.xs }}>
                    <Skeleton width={50} height={28} />
                    <Skeleton width={70} height={12} />
                  </View>
                  <View style={{ alignItems: 'center', gap: spacing.xs }}>
                    <Skeleton width={50} height={28} />
                    <Skeleton width={72} height={12} />
                  </View>
                </View>
              ) : (
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.brand.primary }]}>
                      {stats?.readings ?? '—'}
                    </Text>
                    <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                      Readings
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.brand.primary }]}>
                      {stats?.reflections ?? '—'}
                    </Text>
                    <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                      Reflections
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.brand.primary }]}>
                      {stats?.daysActive ?? '—'}
                    </Text>
                    <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                      Days Active
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {userProfile?.sunSign && (
        <SignsSheet
          isVisible={signsSheetVisible}
          onClose={() => setSignsSheetVisible(false)}
          sunSign={userProfile.sunSign as ZodiacSign}
          moonSign={(userProfile.moonSign ?? userProfile.sunSign) as ZodiacSign}
          risingSign={(userProfile.risingSign ?? userProfile.sunSign) as ZodiacSign}
        />
      )}
    </Screen>
  );
}

function HomeSkeleton() {
  const theme = useAppTheme();
  return (
    <View style={{ marginTop: spacing.lg, gap: spacing.xl }}>
      <View style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <ZodiacAvatarPlaceholder size={48} />
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Skeleton width="40%" height={14} />
            <Skeleton width="65%" height={24} />
          </View>
        </View>
        <Skeleton width="80%" height={24} borderRadius={12} />
      </View>

      <View
        style={{
          backgroundColor: theme.colors.brand.cosmic.deepSpace,
          borderRadius: borderRadius.xxl,
          padding: spacing.lg,
          gap: spacing.sm,
        }}
      >
        <Skeleton width="45%" height={11} borderRadius={4} />
        <Skeleton width="80%" height={22} borderRadius={6} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} />
      </View>

      <View style={{ gap: spacing.md }}>
        <Skeleton width="100%" height={100} borderRadius={borderRadius.card} />
        <Skeleton width="100%" height={100} borderRadius={borderRadius.card} />
      </View>

      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  drawNowCard: {
    marginBottom: spacing.xl,
  },
  drawNowCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.card,
    gap: spacing.md,
  },
  drawNowIcon: {
    fontSize: 32,
  },
  drawNowText: {
    flex: 1,
  },
  drawNowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  drawNowSubtitle: {
    fontSize: 14,
    opacity: 0.85,
  },
  drawNowChevron: {
    fontSize: 24,
    lineHeight: 26,
    opacity: 0.7,
  },
  promoCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.card,
    borderWidth: 2,
    marginBottom: spacing.xl,
  },
  promoIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  promoFeatures: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  promoFeature: {
    fontSize: 15,
  },
  promoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  promoPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  upgradeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  statsCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.card,
    borderWidth: 1,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 13,
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  errorRetry: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  errorRetryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
