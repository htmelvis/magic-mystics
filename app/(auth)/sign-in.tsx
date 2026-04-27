import { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen, Input, Button } from '@components/ui';
import { spacing } from '@theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <Screen scroll={false} padding={false}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
        <View style={styles.header}>
          <Text style={styles.emoji} accessible={false}>
            🔮
          </Text>
          <Text style={[styles.title, { color: theme.colors.brand.primary }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Sign in to continue your mystical journey
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
            returnKeyType="next"
            editable={!loading}
            testID="email"
          />

          <Input
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            editable={!loading}
            testID="password"
          />

          <Button
            title={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleSignIn}
            loading={loading}
            fullWidth
            style={{ marginTop: spacing.xs }}
          />

          <Link href="/(auth)/forgot-password" asChild>
            <Pressable
              style={styles.forgotPassword}
              accessibilityRole="link"
              accessibilityLabel="Forgot password? Click here to reset"
            >
              <Text style={[styles.forgotPasswordText, { color: theme.colors.text.secondary }]}>
                Forgot password? Click here to reset
              </Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
            Don't have an account?{' '}
          </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Sign up for a new account">
              <Text style={[styles.link, { color: theme.colors.text.link }]}>Sign Up</Text>
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
  forgotPassword: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
