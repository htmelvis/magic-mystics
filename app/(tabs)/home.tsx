import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useUserProfile } from '@hooks/useUserProfile';
import { useDailyMetaphysical } from '@hooks/useDailyMetaphysical';
import { useJourneyStats } from '@hooks/useJourneyStats';
import { Screen, Card, Button, Badge, Skeleton, SkeletonCard } from '@components/ui';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { CosmicWeatherCard } from '@/components/home/CosmicWeatherCard';
import { theme } from '@theme';

export default function HomeScreen() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { isPremium } = useSubscription(user?.id);
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);
  const { data: cosmic, isLoading: cosmicLoading } = useDailyMetaphysical();
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useJourneyStats(user?.id);
  const router = useRouter();
  const { open: openUpgradeSheet } = useUpgradeSheet();

  const isLoading = authLoading || profileLoading;

  const error = authError || statsError;

  const handleDrawCard = () => {
    router.push('/draw');
  };

  const handlePPFSpread = () => {
    if (!isPremium) {
      openUpgradeSheet();
      return;
    }
    router.push('/ppf');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Screen>
      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            {error.message || 'Something went wrong. Please try again.'}
          </Text>
          <TouchableOpacity
            onPress={() => refetchStats()}
            style={styles.errorRetry}
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
        <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.userName}>{userProfile?.displayName || user?.email}</Text>
      {userProfile?.sunSign && (
        <Badge 
          label={`☀️ ${userProfile.sunSign} • 🌙 ${userProfile.moonSign} • ⬆️ ${userProfile.risingSign}`}
          variant="primary"
          size="md"
        />
      )}
      </View>

      {/* Cosmic Weather */}
      <CosmicWeatherCard cosmic={cosmic} isLoading={cosmicLoading} />

      {/* Main Actions */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={handleDrawCard}
          accessibilityRole="button"
          accessibilityLabel="Draw Your Daily Card"
          accessibilityHint="Discover today's tarot message"
        >
          <Text style={styles.primaryButtonIcon} accessible={false}>✨</Text>
          <Text style={styles.primaryButtonText}>Draw Your Daily Card</Text>
          <Text style={styles.primaryButtonSubtext}>Discover today's message</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, !isPremium && styles.disabledButton]}
          onPress={handlePPFSpread}
          disabled={!isPremium}
          accessibilityRole="button"
          accessibilityLabel={isPremium ? 'Past, Present, Future spread' : 'Past, Present, Future spread, Premium feature'}
          accessibilityHint={isPremium ? 'Three-card spread reading' : 'Upgrade to Premium to unlock this feature'}
          accessibilityState={{ disabled: !isPremium }}
        >
          <Text style={styles.secondaryButtonIcon} accessible={false}>🔮</Text>
          <Text style={styles.secondaryButtonText}>
            Past/Present/Future {!isPremium && '(Premium)'}
          </Text>
          <Text style={styles.secondaryButtonSubtext}>
            {isPremium ? 'Three-card spread' : 'Upgrade to unlock'}
          </Text>
        </Pressable>
      </View>

      {/* Premium Promo */}
      {!isPremium && (
        <View style={styles.promoCard}>
          <Text style={styles.promoIcon}>✨</Text>
          <Text style={styles.promoTitle}>Unlock Premium Features</Text>
          <View style={styles.promoFeatures}>
            <Text style={styles.promoFeature}>• Unlimited reading history</Text>
            <Text style={styles.promoFeature}>• Monthly Past/Present/Future spreads</Text>
            <Text style={styles.promoFeature}>• AI insights with personalized context</Text>
            <Text style={styles.promoFeature}>• Priority support</Text>
          </View>
          <View style={styles.promoFooter}>
            <Text style={styles.promoPrice}>$49/year</Text>
            <Pressable
              style={styles.upgradeButton}
              onPress={openUpgradeSheet}
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Premium for $49 per year"
            >
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Quick Stats */}
      {isPremium && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Journey</Text>
          {statsLoading ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                <Skeleton width={50} height={28} />
                <Skeleton width={60} height={12} />
              </View>
              <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                <Skeleton width={50} height={28} />
                <Skeleton width={70} height={12} />
              </View>
              <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                <Skeleton width={50} height={28} />
                <Skeleton width={72} height={12} />
              </View>
            </View>
          ) : (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats?.readings ?? '—'}</Text>
                <Text style={styles.statsLabel}>Readings</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats?.reflections ?? '—'}</Text>
                <Text style={styles.statsLabel}>Reflections</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats?.daysActive ?? '—'}</Text>
                <Text style={styles.statsLabel}>Days Active</Text>
              </View>
            </View>
          )}
        </View>
      )}
        </>
      )}
    </Screen>
  );
}

/** Full-page skeleton shown while auth + profile data loads. */
function HomeSkeleton() {
  return (
    <View style={{ marginTop: theme.spacing.lg, gap: theme.spacing.xl }}>
      {/* Header skeleton */}
      <View style={{ gap: theme.spacing.sm }}>
        <Skeleton width="40%" height={16} />
        <Skeleton width="65%" height={28} />
        <Skeleton width="80%" height={24} borderRadius={12} />
      </View>

      {/* Cosmic card skeleton */}
      <View
        style={{
          backgroundColor: theme.colors.brand.cosmic.deepSpace,
          borderRadius: theme.borderRadius.xxl,
          padding: theme.spacing.lg,
          gap: theme.spacing.sm,
        }}
      >
        <Skeleton width="45%" height={11} borderRadius={4} />
        <Skeleton width="80%" height={22} borderRadius={6} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} />
      </View>

      {/* Action button skeletons */}
      <View style={{ gap: theme.spacing.md }}>
        <Skeleton
          width="100%"
          height={100}
          borderRadius={theme.borderRadius.card}
        />
        <Skeleton
          width="100%"
          height={100}
          borderRadius={theme.borderRadius.card}
        />
      </View>

      {/* Stats / promo skeleton */}
      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  greeting: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xxs,
  },
  userName: {
    ...theme.textStyles.h1,
    marginBottom: theme.spacing.sm,
  },
  actionsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: theme.colors.brand.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.card,
    alignItems: 'center',
    ...theme.shadows.button,
  },
  primaryButtonIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  primaryButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xxs,
  },
  primaryButtonSubtext: {
    color: theme.colors.text.inverse,
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface.card,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border.main,
  },
  secondaryButtonIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  secondaryButtonText: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.xxs,
  },
  secondaryButtonSubtext: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  promoCard: {
    backgroundColor: theme.colors.surface.card,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.card,
    borderWidth: 2,
    borderColor: theme.colors.brand.primary,
    marginBottom: theme.spacing.xl,
  },
  promoIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  promoTitle: {
    ...theme.textStyles.h2,
    marginBottom: theme.spacing.md,
    color: theme.colors.brand.primary,
    textAlign: 'center',
  },
  promoFeatures: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  promoFeature: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
  },
  promoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.main,
  },
  promoPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.brand.primary,
  },
  upgradeButton: {
    backgroundColor: theme.colors.brand.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  upgradeButtonText: {
    color: theme.colors.text.inverse,
    ...theme.textStyles.button,
  },
  statsCard: {
    backgroundColor: theme.colors.surface.card,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  statsTitle: {
    ...theme.textStyles.h3,
    marginBottom: theme.spacing.lg,
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
    color: theme.colors.brand.primary,
    marginBottom: theme.spacing.xxs,
  },
  statsLabel: {
    ...theme.textStyles.bodySmall,
    color: theme.colors.text.secondary,
  },
  errorBanner: {
    backgroundColor: theme.colors.error.light,
    borderWidth: 1,
    borderColor: theme.colors.error.main,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error.dark,
    fontSize: 14,
    flex: 1,
  },
  errorRetry: {
    backgroundColor: theme.colors.error.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  errorRetryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
