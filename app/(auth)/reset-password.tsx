import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen, Input, Button } from '@components/ui';
import { spacing } from '@theme';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Your password has been updated.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);
    }
  };

  return (
    <Screen scroll={false} padding={false}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
        <View style={styles.header}>
          <Text style={styles.emoji} accessible={false}>
            🔐
          </Text>
          <Text style={[styles.title, { color: theme.colors.brand.primary }]}>New Password</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Choose a strong password for your account.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="New Password"
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />

          <Button
            title={loading ? 'Updating...' : 'Update Password'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={{ marginTop: spacing.xs }}
          />
        </View>

        <View style={styles.footer} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
});
