import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useUserProfile } from '@hooks/useUserProfile';
import { useDailyMetaphysical } from '@hooks/useDailyMetaphysical';
import { useDailyPlanetaryAlignment } from '@hooks/useDailyPlanetaryAlignment';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen, Skeleton, SkeletonCard, ZodiacAvatarPlaceholder } from '@components/ui';
import { CosmicWeatherCard } from '@/components/home/CosmicWeatherCard';
import { PlanetaryAlignmentCard } from '@/components/path/PlanetaryAlignmentCard';
import { spacing, borderRadius } from '@theme';
import { DrawBanner } from '@/components/tarot/DrawBanner';
import { PremiumUnlockBanner } from '@/components/promo/PremiumUnlockBanner';
import { ExpandedProfile } from '@/components/profile/ExpandedProfile';

export default function HomeScreen() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { isPremium } = useSubscription(user?.id);
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);
  const { data: cosmic, isLoading: cosmicLoading } = useDailyMetaphysical();
  const { data: planetary, isLoading: planetaryLoading } = useDailyPlanetaryAlignment();
  const theme = useAppTheme();

  const isLoading = authLoading || profileLoading;
  const error = authError;

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
        </View>
      )}

      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <View style={{ marginBottom: 48 }}>
          <ExpandedProfile userProfile={userProfile} />
          <CosmicWeatherCard cosmic={cosmic} isLoading={cosmicLoading} />
          <PlanetaryAlignmentCard alignment={planetary} isLoading={planetaryLoading} />
          <DrawBanner />

          {/* Premium Promo */}
          {!isPremium && <PremiumUnlockBanner />}
        </View>
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
