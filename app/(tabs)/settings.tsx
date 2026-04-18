import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useTheme } from '@/context/ThemeContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Screen, Card, Badge, Button } from '@components/ui';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';

export default function SettingsScreen() {
  const { user } = useAuth();
  const { subscription, isPremium } = useSubscription(user?.id);
  const { userProfile } = useUserProfile(user?.id);
  const router = useRouter();
  const { activeColorScheme, toggleColorScheme, colorScheme } = useTheme();
  const theme = useAppTheme();
  const { open: openUpgradeSheet } = useUpgradeSheet();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'To delete your account and all associated data, please contact support.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Contact Support',
          onPress: () => router.push('/(tabs)/support'),
        },
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Settings</Text>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
          Appearance
        </Text>
        <Card variant="outlined">
          <View style={styles.row}>
            <View>
              <Text style={[styles.rowLabel, { color: theme.colors.text.primary }]}>Dark Mode</Text>
              <Text style={[styles.rowSubtitle, { color: theme.colors.text.muted }]}>
                {activeColorScheme === 'dark' ? 'On' : 'Off'}
              </Text>
            </View>
            <Pressable
              style={[
                styles.toggle,
                {
                  backgroundColor:
                    activeColorScheme === 'dark'
                      ? theme.colors.brand.primary
                      : theme.colors.gray[300],
                },
              ]}
              onPress={toggleColorScheme}
              accessibilityRole="switch"
              accessibilityLabel="Dark mode"
              accessibilityState={{ checked: activeColorScheme === 'dark' }}
            >
              <View
                style={[
                  styles.toggleKnob,
                  {
                    backgroundColor: theme.colors.surface.card,
                    transform: [{ translateX: activeColorScheme === 'dark' ? 24 : 2 }],
                  },
                ]}
              />
            </Pressable>
          </View>
          {colorScheme === 'auto' && (
            <Text style={[styles.autoModeText, { color: theme.colors.text.muted }]}>
              Following system preference
            </Text>
          )}
        </Card>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Account</Text>
        <Card variant="outlined">
          <Pressable
            style={styles.row}
            onPress={() => router.push('/(tabs)/edit-birth-details')}
            disabled={!!userProfile?.birthDetailsEditedAt}
            accessibilityRole="button"
            accessibilityLabel="Edit birth details"
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: theme.colors.text.primary }]}>
                Birth Details
              </Text>
              {userProfile?.birthDetailsEditedAt ? (
                <Text style={[styles.rowSubtitle, { color: theme.colors.text.muted }]}>
                  Already edited — cannot be changed again
                </Text>
              ) : (
                <Text style={[styles.rowSubtitle, { color: theme.colors.text.muted }]}>
                  Update birth date, time, and location
                </Text>
              )}
            </View>
            {!userProfile?.birthDetailsEditedAt && (
              <Text style={[styles.chevron, { color: theme.colors.text.muted }]}>›</Text>
            )}
          </Pressable>
        </Card>
      </View>

      {/* Subscription */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
          Subscription
        </Text>
        <Card variant="filled">
          <Badge
            label={isPremium ? '✨ Premium Member' : '🌙 Free Tier'}
            variant={isPremium ? 'primary' : 'default'}
            size="lg"
          />
          {isPremium && subscription?.expiry_date && (
            <Text style={[styles.expiryText, { color: theme.colors.text.secondary }]}>
              Expires: {new Date(subscription.expiry_date).toLocaleDateString()}
            </Text>
          )}
          {!isPremium && (
            <Button
              title="Upgrade to Premium"
              variant="primary"
              onPress={openUpgradeSheet}
              style={{ marginTop: theme.spacing.sm }}
            />
          )}
        </Card>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Support</Text>
        <Card variant="outlined">
          <Pressable
            style={styles.row}
            onPress={() => router.push('/(tabs)/support')}
            accessibilityRole="button"
            accessibilityLabel="Get help or send feedback"
          >
            <Text style={[styles.rowLabel, { color: theme.colors.text.primary }]}>
              Get Help / Send Feedback
            </Text>
            <Text style={[styles.chevron, { color: theme.colors.text.muted }]}>›</Text>
          </Pressable>
        </Card>
      </View>

      {/* Danger Zone */}
      <View style={[styles.section, { marginTop: 'auto' }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
          Danger Zone
        </Text>
        <Card
          variant="outlined"
          style={{
            marginBottom: 32,
          }}
        >
          <Pressable
            style={styles.row}
            onPress={handleDeleteAccount}
            accessibilityRole="button"
            accessibilityLabel="Delete account"
          >
            <Text style={[styles.rowLabel, { color: theme.colors.error.main }]}>
              Delete Account
            </Text>
            <Text style={[styles.chevron, { color: theme.colors.text.muted }]}>›</Text>
          </Pressable>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 13,
  },
  chevron: {
    fontSize: 20,
    lineHeight: 22,
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  autoModeText: {
    fontSize: 12,
    marginTop: 12,
    fontStyle: 'italic',
  },
  expiryText: {
    fontSize: 13,
  },
});
