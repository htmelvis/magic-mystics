import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme';
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
    <View style={[styles.container, urgency && styles.containerUrgent]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{urgency ? '⚠️' : '🕯️'}</Text>

        <View style={styles.body}>
          <Text style={[styles.title, urgency && styles.titleUrgent]}>
            {expiringCount} {readingWord} will be removed {dayLabel}
          </Text>
          <Text style={styles.subtitle}>
            Free accounts keep 30 days of history.
          </Text>
        </View>

        <Pressable
          onPress={expiry.dismiss}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Dismiss expiry warning"
        >
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.upgradeButton, pressed && styles.upgradeButtonPressed]}
          onPress={onUpgradePress}
          accessibilityRole="button"
          accessibilityLabel="Upgrade to Premium to keep your full history"
        >
          <Text style={styles.upgradeButtonText}>Upgrade to keep forever</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.brand.purple[50],
    borderWidth: 1,
    borderColor: theme.colors.brand.purple[200],
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  containerUrgent: {
    backgroundColor: theme.colors.warning.light,
    borderColor: theme.colors.warning.main,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
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
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.brand.purple[700],
  },
  titleUrgent: {
    color: theme.colors.warning.dark,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
  },
  close: {
    fontSize: 13,
    color: theme.colors.text.muted,
    lineHeight: 20,
  },
  actions: {
    paddingLeft: 24, // align with body text (icon width + gap)
  },
  upgradeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.sm,
  },
  upgradeButtonPressed: {
    opacity: 0.8,
  },
  upgradeButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.text.inverse,
    letterSpacing: 0.2,
  },
});
