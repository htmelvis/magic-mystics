import { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { Screen, Input, Button } from '@components/ui';
import { theme } from '@theme';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.emoji} accessible={false}>✨🔮✨</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your mystical journey today</Text>
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
            style={{ marginTop: theme.spacing.xs }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Sign in to existing account">
              <Text style={styles.link}>Sign In</Text>
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
  form: {
    gap: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: theme.spacing.lg,
  },
  footerText: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
  },
  link: {
    ...theme.textStyles.link,
    color: theme.colors.text.link,
  },
});
