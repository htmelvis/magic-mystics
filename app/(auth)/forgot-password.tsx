import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { Screen, Input, Button } from '@components/ui';
import { theme } from '@theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();
  const router = useRouter();

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
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.emoji} accessible={false}>✉️</Text>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We sent a password reset link to{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            <Text style={[styles.subtitle, { marginTop: theme.spacing.md }]}>
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.emoji} accessible={false}>🔑</Text>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
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
            style={{ marginTop: theme.spacing.xs }}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Back to Sign In"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface.card,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.textStyles.display,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    color: theme.colors.brand.primary,
  },
  subtitle: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  emailHighlight: {
    color: theme.colors.brand.primary,
    fontWeight: '600',
  },
  form: {
    gap: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.lg,
  },
});
