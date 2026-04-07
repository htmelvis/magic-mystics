import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useUserProfile } from '@hooks/useUserProfile';
import { useDailyMetaphysical } from '@hooks/useDailyMetaphysical';
import { useJourneyStats } from '@hooks/useJourneyStats';
import { Screen, Card, Button, Badge } from '@components/ui';
import { CosmicWeatherCard } from '@/components/home/CosmicWeatherCard';
import { theme } from '@theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isPremium } = useSubscription(user?.id);
  const { userProfile } = useUserProfile(user?.id);
  const { data: cosmic, isLoading: cosmicLoading } = useDailyMetaphysical();
  const { data: stats } = useJourneyStats(user?.id);
  const router = useRouter();

  const handleDrawCard = () => {
    router.push('/draw');
  };

  const handlePPFSpread = () => {
    if (!isPremium) {
      console.warn('Premium feature - upgrade to access PPF spread');
      return;
    }
    // TODO: Implement PPF spread logic
    console.warn('PPF spread functionality coming soon!');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Screen>
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
        <Pressable style={styles.primaryButton} onPress={handleDrawCard}>
          <Text style={styles.primaryButtonIcon}>✨</Text>
          <Text style={styles.primaryButtonText}>Draw Your Daily Card</Text>
          <Text style={styles.primaryButtonSubtext}>Discover today's message</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, !isPremium && styles.disabledButton]}
          onPress={handlePPFSpread}
          disabled={!isPremium}
        >
          <Text style={styles.secondaryButtonIcon}>🔮</Text>
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
            <Pressable style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Quick Stats */}
      {isPremium && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Journey</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats?.readings ?? '—'}</Text>
              <Text style={styles.statLabel}>Readings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats?.reflections ?? '—'}</Text>
              <Text style={styles.statLabel}>Reflections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats?.daysActive ?? '—'}</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
          </View>
        </View>
      )}
    </Screen>
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
    color: theme.colors.brand.primaryMuted,
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
  statLabel: {
    ...theme.textStyles.bodySmall,
    color: theme.colors.text.secondary,
  },
});
