import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function BirthLocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [location, setLocation] = useState('');

  const handleContinue = () => {
    router.push({
      pathname: '/(onboarding)/calculating',
      params: {
        displayName: params.displayName as string,
        birthDate: params.birthDate as string,
        birthTime: params.birthTime as string,
        birthLocation: location,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>Step 4 of 4</Text>
        <Text style={styles.title}>Where were you born?</Text>
        <Text style={styles.subtitle}>
          Enter your city and country to refine your astrological chart
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Los Angeles, USA"
          placeholderTextColor="#9ca3af"
          value={location}
          onChangeText={setLocation}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <Text style={styles.hint}>This helps us calculate your rising sign more accurately</Text>
      </View>

      <Pressable
        style={[styles.button, !location && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!location}
      >
        <Text style={styles.buttonText}>Calculate My Signs</Text>
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
  hint: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
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
