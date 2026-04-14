import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAnalytics } from '@/hooks/useAnalytics';


export default function NameScreen() {
  const router = useRouter();
  const { capture } = useAnalytics();
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
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>Step 1 of 4</Text>
        <Text style={styles.title}>What should we call you?</Text>
        <Text style={styles.subtitle}>This is how your name will appear throughout the app</Text>

        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Your name"
          placeholderTextColor="#9ca3af"
          value={displayName}
          onChangeText={text => {
            setDisplayName(text);
            if (error) setError(validate(text));
          }}
          onBlur={() => setError(validate(displayName))}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <Pressable style={styles.button} onPress={handleContinue}>
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
    color: '#8b5cf6',
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#dc2626',
  },
  button: {
    backgroundColor: '#8b5cf6',
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
