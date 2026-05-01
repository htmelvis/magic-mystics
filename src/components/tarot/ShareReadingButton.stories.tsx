/**
 * ShareReadingButton stories.
 *
 * ShareReadingButton calls useShareReading internally (native Share API + Supabase).
 * Stories recreate the visual layout directly to avoid the hook dependency —
 * same pattern as DrawBanner.stories.tsx.
 */

import type { StoryObj } from '@storybook/react-native';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@theme';

interface ShareButtonPreviewProps {
  isSharing?: boolean;
}

function ShareButtonPreview({ isSharing = false }: ShareButtonPreviewProps) {
  return (
    <TouchableOpacity
      disabled={isSharing}
      accessibilityRole="button"
      accessibilityLabel="Share this reading"
      accessibilityState={{ disabled: isSharing }}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surface.card,
          borderColor: theme.colors.border.main,
          opacity: isSharing ? 0.6 : 1,
        },
      ]}
    >
      {isSharing ? (
        <ActivityIndicator color={theme.colors.brand.primary} size="small" />
      ) : (
        <>
          <Text style={[styles.glyph, { color: theme.colors.brand.primary }]}>↗</Text>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Share Reading</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  glyph: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '600' },
});

export default {
  title: 'Tarot/ShareReadingButton',
};

export const Default: StoryObj = {
  render: () => (
    <View style={{ padding: 16 }}>
      <ShareButtonPreview />
    </View>
  ),
};

export const Sharing: StoryObj = {
  render: () => (
    <View style={{ padding: 16 }}>
      <ShareButtonPreview isSharing />
    </View>
  ),
};
