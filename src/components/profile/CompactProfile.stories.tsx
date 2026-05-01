/**
 * CompactProfile stories.
 *
 * CompactProfile uses useRouter internally. Stories recreate the visual
 * layout directly using lower-level primitives — same pattern as ExpandedProfile.stories.tsx.
 */

import type { StoryObj } from '@storybook/react-native';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ZodiacAvatar, ZodiacAvatarPlaceholder, Badge } from '@components/ui';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';
import { theme } from '@theme';

interface CompactProfilePreviewProps {
  displayName: string;
  greeting: string;
  sunSign: ZodiacSign | null;
  moonSign: string | null;
  risingSign: string | null;
}

function CompactProfilePreview({
  displayName,
  greeting,
  sunSign,
  moonSign,
  risingSign,
}: CompactProfilePreviewProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {sunSign ? (
          <ZodiacAvatar sign={sunSign} size={48} />
        ) : (
          <ZodiacAvatarPlaceholder size={48} />
        )}
        <View style={styles.headerText}>
          <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>
            {greeting}, <Text style={{ color: theme.colors.text.primary }}>{displayName}</Text>
          </Text>
          {sunSign && (
            <Pressable accessibilityRole="button">
              <Badge
                label={`☉ ${sunSign} • ☽ ${moonSign ?? '—'} • ↑ ${risingSign ?? '—'}`}
                variant="outline"
                size="md"
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    marginBottom: 32,
    gap: 8,
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default {
  title: 'Profile/CompactProfile',
};

export const Default: StoryObj = {
  render: () => (
    <CompactProfilePreview
      displayName="Edward"
      greeting="Good evening"
      sunSign="Aries"
      moonSign="Scorpio"
      risingSign="Capricorn"
    />
  ),
};

export const EarthSigns: StoryObj = {
  render: () => (
    <CompactProfilePreview
      displayName="Alex"
      greeting="Good morning"
      sunSign="Taurus"
      moonSign="Virgo"
      risingSign="Capricorn"
    />
  ),
};

export const NoSigns: StoryObj = {
  render: () => (
    <CompactProfilePreview
      displayName="Jordan"
      greeting="Good afternoon"
      sunSign={null}
      moonSign={null}
      risingSign={null}
    />
  ),
};
