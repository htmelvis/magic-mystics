import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen } from '@components/ui';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { ReadingHistory } from '@/components/history/ReadingHistory';
import { spacing, borderRadius } from '@theme';
import { CompactProfile } from '@/components/profile/CompactProfile';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function DrawScreen() {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.id);
  const { isPremium } = useSubscription(user?.id);
  const router = useRouter();
  const theme = useAppTheme();
  const { open: openUpgradeSheet } = useUpgradeSheet();

  const handleDrawCard = () => {
    router.push('/daily-draw');
  };

  const handlePPFSpread = () => {
    if (!isPremium) {
      openUpgradeSheet();
      return;
    }
    router.push('/ppf');
  };

  return (
    <Screen>
      <CompactProfile userProfile={userProfile} />

      <View style={styles.spreads}>
        <Pressable
          style={[
            styles.primaryCard,
            { backgroundColor: theme.colors.brand.primary, ...theme.shadows.button },
          ]}
          onPress={handleDrawCard}
          accessibilityRole="button"
          accessibilityLabel="Draw Your Daily Card"
          accessibilityHint="Pull today's tarot message"
        >
          <Text style={styles.cardIcon} accessible={false}>
            ✨
          </Text>
          <Text style={[styles.cardTitle, { color: theme.colors.text.inverse }]}>Daily Card</Text>
          <Text style={[styles.cardSubtitle, { color: theme.colors.text.inverse }]}>
            Discover today's message
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.secondaryCard,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: theme.colors.border.main,
            },
            !isPremium && styles.disabledCard,
          ]}
          onPress={handlePPFSpread}
          accessibilityRole="button"
          accessibilityLabel={isPremium ? '3-Card spread' : '3-Card spread, Premium feature'}
          accessibilityHint={
            isPremium ? 'Three-card spread reading' : 'Upgrade to Premium to unlock this feature'
          }
          accessibilityState={{ disabled: !isPremium }}
        >
          <Text style={styles.cardIcon} accessible={false}>
            🔮
          </Text>
          <Text style={[styles.secondaryCardTitle, { color: theme.colors.text.primary }]}>
            3-Card Spread{!isPremium && ' (Premium)'}
          </Text>
          <Text style={[styles.secondaryCardSubtitle, { color: theme.colors.text.secondary }]}>
            {isPremium ? 'Choose your spread type' : 'Upgrade to unlock'}
          </Text>
        </Pressable>
      </View>

      <ReadingHistory onPress={() => router.push('/(tabs)/history')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    gap: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  spreads: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  primaryCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.card,
    alignItems: 'center',
  },
  secondaryCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.card,
    alignItems: 'center',
    borderWidth: 2,
  },
  disabledCard: {
    opacity: 0.5,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  secondaryCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  secondaryCardSubtitle: {
    fontSize: 14,
  },
});
