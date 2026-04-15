import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { Screen } from '@components/ui';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { theme } from '@theme';

export default function DrawScreen() {
  const { user } = useAuth();
  const { isPremium } = useSubscription(user?.id);
  const router = useRouter();
  const { open: openUpgradeSheet } = useUpgradeSheet();

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

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Draw</Text>
        <Text style={styles.subtitle}>Choose a spread to begin your reading</Text>
      </View>

      <View style={styles.spreads}>
        <Pressable
          style={styles.primaryCard}
          onPress={handleDrawCard}
          accessibilityRole="button"
          accessibilityLabel="Draw Your Daily Card"
          accessibilityHint="Discover today's tarot message"
        >
          <Text style={styles.cardIcon} accessible={false}>✨</Text>
          <Text style={styles.cardTitle}>Daily Card</Text>
          <Text style={styles.cardSubtitle}>Discover today's message</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryCard, !isPremium && styles.disabledCard]}
          onPress={handlePPFSpread}
          accessibilityRole="button"
          accessibilityLabel={isPremium ? 'Past, Present, Future spread' : 'Past, Present, Future spread, Premium feature'}
          accessibilityHint={isPremium ? 'Three-card spread reading' : 'Upgrade to Premium to unlock this feature'}
          accessibilityState={{ disabled: !isPremium }}
        >
          <Text style={styles.cardIcon} accessible={false}>🔮</Text>
          <Text style={styles.secondaryCardTitle}>
            Past / Present / Future{!isPremium && ' (Premium)'}
          </Text>
          <Text style={styles.secondaryCardSubtitle}>
            {isPremium ? 'Three-card spread' : 'Upgrade to unlock'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.historyRow}
        onPress={() => router.push('/(tabs)/history')}
        accessibilityRole="button"
        accessibilityLabel="View reading history"
      >
        <Text style={styles.historyRowLabel}>Reading History</Text>
        <Text style={styles.historyRowChevron}>›</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.textStyles.h1,
  },
  subtitle: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
  },
  spreads: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  primaryCard: {
    backgroundColor: theme.colors.brand.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.card,
    alignItems: 'center',
    ...theme.shadows.button,
  },
  secondaryCard: {
    backgroundColor: theme.colors.surface.card,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border.main,
  },
  disabledCard: {
    opacity: 0.5,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xxs,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.text.inverse,
  },
  secondaryCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  secondaryCardSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.card,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  historyRowLabel: {
    ...theme.textStyles.body,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  historyRowChevron: {
    fontSize: 20,
    lineHeight: 22,
    color: theme.colors.text.muted,
  },
});
