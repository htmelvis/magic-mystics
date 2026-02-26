import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function NameScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');

  const handleContinue = () => {
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
        <Text style={styles.subtitle}>
          This is how your name will appear throughout the app
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#9ca3af"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={displayName.trim() ? handleContinue : undefined}
        />
      </View>

      <Pressable
        style={[styles.button, !displayName.trim() && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!displayName.trim()}
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
    paddingTop: 60,
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
  button: {
    backgroundColor: '#8b5cf6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
