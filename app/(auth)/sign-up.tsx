import { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen, Input, Button } from '@components/ui';
import { spacing } from '@theme';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email to verify your account!');
      router.replace('/(onboarding)/welcome');
    }
  };

  return (
    <Screen scroll={false} padding={false}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
        <View style={styles.header}>
          <Text style={styles.emoji} accessible={false}>
            ✨🔮✨
          </Text>
          <Text style={[styles.title, { color: theme.colors.brand.primary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Start your mystical journey today
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

          <Input
            label="Password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            hint="Password must be at least 6 characters"
          />

          <Button
            title={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignUp}
            loading={loading}
            fullWidth
            style={{ marginTop: spacing.xs }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
            Already have an account?{' '}
          </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Sign in to existing account">
              <Text style={[styles.link, { color: theme.colors.text.link }]}>Sign In</Text>
            </Pressable>
          </Link>
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
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: spacing.lg,
  },
  footerText: {
    fontSize: 16,
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
