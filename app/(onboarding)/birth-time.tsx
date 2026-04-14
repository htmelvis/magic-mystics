import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function BirthTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { capture } = useAnalytics();
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [error, setError] = useState<string | null>(null);

  capture('screen_viewed', { screen: 'onboarding birth time' });

  const validate = (value: Date): string | null => {
    if (isNaN(value.getTime())) return 'Please select a valid time';
    return null;
  };

  const handleContinue = () => {
    const validationError = validate(time);
    if (validationError) {
      setError(validationError);
      return;
    }

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const birthTime = `${hours}:${minutes}`;

    router.push({
      pathname: '/(onboarding)/birth-location',
      params: {
        displayName: params.displayName as string,
        birthDate: params.birthDate as string,
        birthTime,
      },
    });
  };

  const onChange = (_event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
      if (error) setError(validate(selectedTime));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>Step 3 of 4</Text>
        <Text style={styles.title} accessibilityRole="header">
          What time were you born?
        </Text>
        <Text style={styles.subtitle}>
          Your birth time helps us calculate your rising sign (ascendant)
        </Text>

        <View style={styles.pickerContainer}>
          {Platform.OS === 'android' && !showPicker && (
            <Pressable
              style={styles.timeButton}
              onPress={() => setShowPicker(true)}
              accessibilityRole="button"
              accessibilityLabel={`Selected birth time: ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              accessibilityHint="Double-tap to open time picker"
            >
              <Text style={styles.timeButtonText}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Pressable>
          )}
          {showPicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />
          )}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.hint}>Don't know your exact birth time? That's okay!</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={handleContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        accessibilityHint="Proceeds to birth location selection"
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
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  timeButton: {
    backgroundColor: '#f3e8ff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    width: '100%',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 18,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#dc2626',
    textAlign: 'center',
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
