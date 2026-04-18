import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Input } from '@components/ui';


export default function NameScreen() {
  const router = useRouter();
  const { capture } = useAnalytics();
  const theme = useAppTheme();
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validate = (value: string): string | null => {
    if (!value.trim()) return 'Please enter your name';
    return null;
  };

  capture('screen_viewed', { screen: 'onboarding name' });
  const handleContinue = () => {
    const validationError = validate(displayName);
    if (validationError) {
      setError(validationError);
      return;
    }
    router.push({
      pathname: '/(onboarding)/birth-date',
      params: { displayName: displayName.trim() },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View style={styles.content}>
        <Text style={[styles.progress, { color: theme.colors.brand.primary }]}>Step 1 of 4</Text>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          What should we call you?
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          This is how your name will appear throughout the app
        </Text>

        <Input
          placeholder="Your name"
          value={displayName}
          onChangeText={(text) => {
            setDisplayName(text);
            if (error) setError(validate(text));
          }}
          onBlur={() => setError(validate(displayName))}
          error={error ?? undefined}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.brand.primary }]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  progress: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
