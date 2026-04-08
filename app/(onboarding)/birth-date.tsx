import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const MIN_DATE = new Date(1900, 0, 1);

export default function BirthDateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [error, setError] = useState<string | null>(null);

  const validate = (value: Date): string | null => {
    if (isNaN(value.getTime())) return 'Please select a valid date';
    if (value > new Date()) return 'Birth date cannot be in the future';
    if (value < MIN_DATE) return 'Birth date must be after January 1, 1900';
    return null;
  };

  const handleContinue = () => {
    const validationError = validate(date);
    if (validationError) {
      setError(validationError);
      return;
    }
    router.push({
      pathname: '/(onboarding)/birth-time',
      params: { displayName: params.displayName as string, birthDate: date.toISOString() },
    });
  };

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      if (error) setError(validate(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>Step 2 of 4</Text>
        <Text style={styles.title} accessibilityRole="header">When were you born?</Text>
        <Text style={styles.subtitle}>
          We'll use this to calculate your sun sign and other astrological placements
        </Text>

        <View style={styles.pickerContainer}>
          {Platform.OS === 'android' && !showPicker && (
            <Pressable
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
              accessibilityRole="button"
              accessibilityLabel={`Selected birth date: ${date.toLocaleDateString()}`}
              accessibilityHint="Double-tap to open date picker"
            >
              <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
            </Pressable>
          )}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <Pressable
        style={styles.button}
        onPress={handleContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        accessibilityHint="Proceeds to birth time selection"
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
  dateButton: {
    backgroundColor: '#f3e8ff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    width: '100%',
    alignItems: 'center',
  },
  dateButtonText: {
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
