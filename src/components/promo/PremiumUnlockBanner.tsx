import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';

export function PremiumUnlockBanner() {
  const theme = useAppTheme();
  const { open: openUpgradeSheet } = useUpgradeSheet();

  return (
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
        <Text style={[styles.promoPrice, { color: theme.colors.brand.primary }]}>$49/year</Text>
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
  );
}

const styles = StyleSheet.create({
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
});
