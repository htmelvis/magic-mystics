import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Screen, Card, Badge, Button } from '@components/ui';
import { theme } from '@theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { subscription, isPremium } = useSubscription(user?.id);
  const { userProfile } = useUserProfile(user?.id);
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zodiac Signs</Text>
        <Card variant="outlined">
          <Text style={styles.signText}>☀️ Sun: {userProfile?.sunSign || '—'}</Text>
          <Text style={styles.signText}>🌙 Moon: {userProfile?.moonSign || '—'}</Text>
          <Text style={styles.signText}>⬆️ Rising: {userProfile?.risingSign || '—'}</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <Card variant="filled">
          <Badge 
            label={isPremium ? '✨ Premium Member' : '🌙 Free Tier'}
            variant={isPremium ? 'primary' : 'default'}
            size="lg"
            style={{ marginBottom: theme.spacing.sm }}
          />
          {isPremium && subscription?.expiry_date && (
            <Text style={styles.expiryText}>
              Expires: {new Date(subscription.expiry_date).toLocaleDateString()}
            </Text>
          )}
          {!isPremium && (
            <Button 
              title="Upgrade to Premium"
              variant="primary"
              onPress={() => console.warn('Upgrade pressed')}
              style={{ marginTop: theme.spacing.sm }}
            />
          )}
        </Card>
      </View>

      <Button 
        title="Sign Out"
        variant="destructive"
        onPress={handleSignOut}
        fullWidth
        style={{ marginTop: 'auto' }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.textStyles.h1,
    marginTop: theme.spacing.xxxl,
    marginBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    ...theme.textStyles.h3,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.secondary,
  },
  email: {
    ...theme.textStyles.body,
    color: theme.colors.text.primary,
  },
  signText: {
    ...theme.textStyles.body,
    marginBottom: theme.spacing.xs,
  },
  expiryText: {
    ...theme.textStyles.bodySmall,
    color: theme.colors.text.secondary,
  },
});
