import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';

export function DrawBanner() {
  const theme = useAppTheme();
  const router = useRouter();
  return (
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
        accessibilityLabel="Begin a tarot reading"
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
  );
}

const styles = StyleSheet.create({
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
});
