import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen, Input, Button } from '@components/ui';
import { spacing } from '@theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    const { error } = await forgotPassword(email);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <Screen scroll={false} padding={false}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
          <View style={styles.header}>
            <Text style={styles.emoji} accessible={false}>✉️</Text>
            <Text style={[styles.title, { color: theme.colors.brand.primary }]}>
              Check Your Email
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              We sent a password reset link to{'\n'}
              <Text style={{ color: theme.colors.brand.primary, fontWeight: '600' }}>{email}</Text>
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary, marginTop: spacing.md }]}>
              Click the link in the email to set a new password.
            </Text>
          </View>
          <View style={styles.footer}>
            <Button
              title="Back to Sign In"
              onPress={() => router.replace('/(auth)/sign-in')}
              variant="ghost"
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} padding={false}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
        <View style={styles.header}>
          <Text style={styles.emoji} accessible={false}>🔑</Text>
          <Text style={[styles.title, { color: theme.colors.brand.primary }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Enter your email and we'll send you a link to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <Button
            title={loading ? 'Sending...' : 'Send Reset Link'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={{ marginTop: spacing.xs }}
          />
        </View>

        <View style={styles.footer}>
          <Button title="Back to Sign In" onPress={() => router.back()} variant="ghost" />
        </View>
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
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
});
