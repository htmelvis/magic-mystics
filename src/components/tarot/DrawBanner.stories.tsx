/**
 * DrawBanner stories.
 *
 * DrawBanner uses useRouter internally. Stories recreate the visual layout
 * directly using lower-level primitives — same pattern as CompactProfile.stories.tsx.
 */

import type { StoryObj } from '@storybook/react-native';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme, borderRadius, spacing } from '@theme';

function DrawBannerPreview() {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface.card,
          borderColor: theme.colors.border.main,
        },
      ]}
    >
      <Pressable
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Begin a tarot reading"
        accessibilityHint="Opens the Draw tab to start a reading"
      >
        <Text style={styles.icon} accessible={false}>
          ✨
        </Text>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Ready for your reading?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Daily card, spreads, and more
          </Text>
        </View>
        <Text style={[styles.chevron, { color: theme.colors.text.primary }]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderRadius: borderRadius.card,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.card,
    gap: spacing.md,
  },
  icon: { fontSize: 32 },
  textBlock: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, opacity: 0.85 },
  chevron: { fontSize: 24, lineHeight: 26, opacity: 0.7 },
});

export default {
  title: 'Tarot/DrawBanner',
};

export const Default: StoryObj = {
  render: () => (
    <View style={{ padding: 16 }}>
      <DrawBannerPreview />
    </View>
  ),
};
