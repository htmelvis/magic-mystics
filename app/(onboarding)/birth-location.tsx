import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LocationInput } from '@components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function BirthLocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { capture } = useAnalytics();

  capture('screen_viewed', { screen: 'onboarding birth location' });

  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validate = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your birth location';
    if (trimmed.length < 2) return 'Location must be at least 2 characters';
    return null;
  };

  const handleChangeValue = (value: string) => {
    setLocation(value);
    if (error) setError(validate(value));
  };

  const handleContinue = () => {
    const validationError = validate(location);
    if (validationError) {
      setError(validationError);
      return;
    }
    router.push({
      pathname: '/(onboarding)/calculating',
      params: {
        displayName: params.displayName as string,
        birthDate: params.birthDate as string,
        birthTime: params.birthTime as string,
        birthLocation: location.trim(),
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

        <LocationInput
          value={location}
          onChangeValue={handleChangeValue}
          error={error ?? undefined}
          onBlur={() => setError(validate(location))}
          hint="This helps us calculate your rising sign more accurately"
        />
      </View>

      <Pressable style={styles.button} onPress={handleContinue}>
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
