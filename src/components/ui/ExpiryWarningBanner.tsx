import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';
import type { ReadingExpiryState } from '@hooks/useReadingExpiry';

interface ExpiryWarningBannerProps {
  expiry: ReadingExpiryState;
  onUpgradePress: () => void;
}

/**
 * Dismissible banner shown when a free-tier user has readings within 7 days
 * of the 30-day deletion cutoff. Renders nothing when there is nothing to warn about.
 */
export function ExpiryWarningBanner({ expiry, onUpgradePress }: ExpiryWarningBannerProps) {
  const theme = useAppTheme();

  if (expiry.expiringCount === 0 || expiry.isDismissed) return null;

  const { expiringCount, daysUntilOldest } = expiry;
  const readingWord = expiringCount === 1 ? 'reading' : 'readings';
  const urgency = daysUntilOldest !== null && daysUntilOldest <= 2;
  const dayLabel =
    daysUntilOldest === null
      ? 'soon'
      : daysUntilOldest === 0
        ? 'today'
        : daysUntilOldest === 1
          ? 'tomorrow'
          : `in ${daysUntilOldest} days`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: urgency
            ? theme.colors.warning.light
            : theme.colors.brand.purple[50],
          borderColor: urgency ? theme.colors.warning.main : theme.colors.brand.purple[200],
        },
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.icon}>{urgency ? '⚠️' : '🕯️'}</Text>

        <View style={styles.body}>
          <Text
            style={[
              styles.title,
              {
                color: urgency
                  ? theme.colors.warning.dark
                  : theme.colors.brand.purple[700],
              },
            ]}
          >
            {expiringCount} {readingWord} will be removed {dayLabel}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.muted }]}>
            Free accounts keep 30 days of history.
          </Text>
        </View>

        <Pressable
          onPress={expiry.dismiss}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Dismiss expiry warning"
        >
          <Text style={[styles.close, { color: theme.colors.text.muted }]}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.upgradeButton,
            { backgroundColor: theme.colors.brand.primary },
            pressed && styles.upgradeButtonPressed,
          ]}
          onPress={onUpgradePress}
          accessibilityRole="button"
          accessibilityLabel="Upgrade to Premium to keep your full history"
        >
          <Text style={[styles.upgradeButtonText, { color: theme.colors.text.inverse }]}>
            Upgrade to keep forever
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 1,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
  },
  close: {
    fontSize: 13,
    lineHeight: 20,
  },
  actions: {
    paddingLeft: 24,
  },
  upgradeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  upgradeButtonPressed: { opacity: 0.8 },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
