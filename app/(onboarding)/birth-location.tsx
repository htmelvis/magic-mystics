import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LocationInput } from '@components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function BirthLocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { capture } = useAnalytics();
  const theme = useAppTheme();

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
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View style={styles.content}>
        <Text style={[styles.progress, { color: theme.colors.brand.primary }]}>Step 4 of 4</Text>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Where were you born?
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
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

      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.brand.primary }]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Calculate My Signs</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, paddingTop: 16 },
  progress: { fontSize: 14, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24, marginBottom: 40 },
  button: { padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
