import { useState } from 'react';
import { useRouter } from 'expo-router';

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { spacing } from '@theme';
import { Badge, ZodiacAvatar, ZodiacAvatarPlaceholder } from '@components/ui';
import { ZodiacSign } from '@/lib/astrology/calculate-signs';
import { UserProfile } from '@/types/user';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SignsSheet } from './SignsSheet';
import { getGreeting } from './profile-personalization';

export function ExpandedProfile({ userProfile }: { userProfile: UserProfile | null }) {
  const { sunSign, moonSign, risingSign, displayName } = userProfile || {};
  const router = useRouter();
  const theme = useAppTheme();
  const [signsSheetVisible, setSignsSheetVisible] = useState(false);

  if (!userProfile) return null;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable
          onPress={() => router.push('/(tabs)/profile')}
          accessibilityRole="button"
          accessibilityLabel="Go to your profile"
        >
          {sunSign ? (
            <ZodiacAvatar sign={sunSign as ZodiacSign} size={64} />
          ) : (
            <ZodiacAvatarPlaceholder size={64} />
          )}
        </Pressable>

        <View style={styles.headerText}>
          <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>
            {getGreeting()},
          </Text>
          <Text style={[styles.displayName, { color: theme.colors.text.primary }]}>
            {displayName}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: spacing.sm,
          marginTop: spacing.sm,
        }}
      >
        {userProfile?.sunSign && (
          <Pressable
            onPress={() => setSignsSheetVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={`Your signs: Sun ${sunSign}, Moon ${moonSign ?? 'unknown'}, Rising ${risingSign ?? 'unknown'}. Tap to learn more.`}
            accessibilityHint="Opens a guide explaining your sun, moon, and rising signs"
          >
            <Text style={{ color: theme.colors.text.secondary }}>
              ☉ {sunSign} • ☽ {moonSign ?? '—'} • ↑ {risingSign ?? '—'}
            </Text>
          </Pressable>
        )}
      </View>

      {sunSign && (
        <SignsSheet
          isVisible={signsSheetVisible}
          onClose={() => setSignsSheetVisible(false)}
          sunSign={sunSign as ZodiacSign}
          moonSign={(moonSign ?? sunSign) as ZodiacSign}
          risingSign={(risingSign ?? sunSign) as ZodiacSign}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  greeting: {
    fontSize: 24,
    marginBottom: 0,
    lineHeight: 0,
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 0,
  },
  headerText: {
    flex: 1,
  },
});
