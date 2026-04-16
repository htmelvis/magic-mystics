import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen } from '@components/ui';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { spacing, borderRadius } from '@theme';

export default function DrawScreen() {
  const { user } = useAuth();
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Read your cards </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Choose a spread to begin your reading
        </Text>
      </View>

      <View style={styles.spreads}>
        <Pressable
          style={[
            styles.primaryCard,
            { backgroundColor: theme.colors.brand.primary, ...theme.shadows.button },
          ]}
          onPress={handleDrawCard}
          accessibilityRole="button"
          accessibilityLabel="Draw Your Daily Card"
          accessibilityHint="Discover today's tarot message"
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
          accessibilityLabel={
            isPremium
              ? 'Past, Present, Future spread'
              : 'Past, Present, Future spread, Premium feature'
          }
          accessibilityHint={
            isPremium ? 'Three-card spread reading' : 'Upgrade to Premium to unlock this feature'
          }
          accessibilityState={{ disabled: !isPremium }}
        >
          <Text style={styles.cardIcon} accessible={false}>
            🔮
          </Text>
          <Text style={[styles.secondaryCardTitle, { color: theme.colors.text.primary }]}>
            Past / Present / Future{!isPremium && ' (Premium)'}
          </Text>
          <Text style={[styles.secondaryCardSubtitle, { color: theme.colors.text.secondary }]}>
            {isPremium ? 'Three-card spread' : 'Upgrade to unlock'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          styles.historyRow,
          {
            backgroundColor: theme.colors.surface.card,
            borderColor: theme.colors.border.main,
          },
        ]}
        onPress={() => router.push('/(tabs)/history')}
        accessibilityRole="button"
        accessibilityLabel="View reading history"
      >
        <Text style={[styles.historyRowLabel, { color: theme.colors.text.primary }]}>
          Reading History
        </Text>
        <Text style={[styles.historyRowChevron, { color: theme.colors.text.muted }]}>›</Text>
      </Pressable>
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
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
  },
  historyRowLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyRowChevron: {
    fontSize: 20,
    lineHeight: 22,
  },
});
