/**
 * ExpandedProfile stories.
 *
 * ExpandedProfile uses useRouter internally for avatar navigation.
 * Stories recreate the visual layout using lower-level primitives to keep
 * them router-free and deterministic — the same approach used in ProfileScreen.stories.tsx.
 */

import type { StoryObj } from '@storybook/react-native';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ZodiacAvatar, ZodiacAvatarPlaceholder } from '@components/ui';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';
import { theme } from '@theme';

interface ProfilePreviewProps {
  displayName: string;
  greeting: string;
  sunSign: ZodiacSign | null;
  moonSign: string | null;
  risingSign: string | null;
}

function ProfilePreview({
  displayName,
  greeting,
  sunSign,
  moonSign,
  risingSign,
}: ProfilePreviewProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {sunSign ? (
          <ZodiacAvatar sign={sunSign} size={64} />
        ) : (
          <ZodiacAvatarPlaceholder size={64} />
        )}
        <View style={styles.headerText}>
          <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>{greeting},</Text>
          <Text style={[styles.displayName, { color: theme.colors.text.primary }]}>
            {displayName}
          </Text>
        </View>
      </View>
      {sunSign && (
        <Pressable accessibilityRole="button">
          <Text style={{ color: theme.colors.text.secondary }}>
            ☉ {sunSign} • ☽ {moonSign ?? '—'} • ↑ {risingSign ?? '—'}
          </Text>
        </Pressable>
      )}
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
    fontSize: 24,
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default {
  title: 'Profile/ExpandedProfile',
};

export const Default: StoryObj = {
  render: () => (
    <ProfilePreview
      displayName="Edward"
      greeting="Good evening"
      sunSign="Aries"
      moonSign="Scorpio"
      risingSign="Capricorn"
    />
  ),
};

export const AllFireSigns: StoryObj = {
  render: () => (
    <ProfilePreview
      displayName="Sage"
      greeting="Good morning"
      sunSign="Leo"
      moonSign="Aries"
      risingSign="Sagittarius"
    />
  ),
};

export const AllWaterSigns: StoryObj = {
  render: () => (
    <ProfilePreview
      displayName="River"
      greeting="Good afternoon"
      sunSign="Pisces"
      moonSign="Cancer"
      risingSign="Scorpio"
    />
  ),
};

export const NoSigns: StoryObj = {
  render: () => (
    <ProfilePreview
      displayName="Edward"
      greeting="Good evening"
      sunSign={null}
      moonSign={null}
      risingSign={null}
    />
  ),
};

export const MissingMoonAndRising: StoryObj = {
  render: () => (
    <ProfilePreview
      displayName="Jordan"
      greeting="Good morning"
      sunSign="Gemini"
      moonSign={null}
      risingSign={null}
    />
  ),
};
