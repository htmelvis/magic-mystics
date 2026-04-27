import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOnboardingDraft } from '@lib/onboarding/OnboardingContext';
import { getNextStep, getStepIndex } from '@lib/onboarding/steps';

const MIN_DATE = new Date(1900, 0, 1);

function parseDraftDate(stored: string): Date {
  if (stored) {
    const [y, m, d] = stored.split('-').map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }
  const t = new Date();
  return new Date(2000, t.getMonth(), t.getDate());
}

export default function BirthDateScreen() {
  const router = useRouter();
  const { capture } = useAnalytics();
  const theme = useAppTheme();
  const { draft, updateDraft } = useOnboardingDraft();
  const [date, setDate] = useState(() => parseDraftDate(draft.birthDate));
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [error, setError] = useState<string | null>(null);
  const { index, total } = getStepIndex('birth-date');

  capture('screen_viewed', { screen: 'onboarding birth date' });

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
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    updateDraft({ birthDate: `${y}-${m}-${d}` });
    router.push(`/(onboarding)/${getNextStep('birth-date')}`);
  };

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      if (error) setError(validate(selectedDate));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View style={styles.content}>
        <Text style={[styles.progress, { color: theme.colors.brand.primary }]}>
          Step {index} of {total}
        </Text>
        <Text style={[styles.title, { color: theme.colors.text.primary }]} accessibilityRole="header">
          When were you born?
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          We'll use this to calculate your sun sign and other astrological placements
        </Text>

        <View style={styles.pickerContainer}>
          {Platform.OS === 'android' && !showPicker && (
            <Pressable
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.colors.brand.primaryMuted,
                  borderColor: theme.colors.brand.primary,
                },
              ]}
              onPress={() => setShowPicker(true)}
              accessibilityRole="button"
              accessibilityLabel={`Selected birth date: ${date.toLocaleDateString()}`}
              accessibilityHint="Double-tap to open date picker"
            >
              <Text style={[styles.dateButtonText, { color: theme.colors.brand.primary }]}>
                {date.toLocaleDateString()}
              </Text>
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
              textColor={theme.colors.text.primary}
            />
          )}
        </View>
        {error ? (
          <Text style={[styles.errorText, { color: theme.colors.error.main }]}>{error}</Text>
        ) : null}
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.brand.primary }]}
        onPress={handleContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue"
      >
        <Text style={styles.buttonText}>Continue</Text>
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
  pickerContainer: { alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  dateButton: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    width: '100%',
    alignItems: 'center',
  },
  dateButtonText: { fontSize: 18, fontWeight: '600' },
  errorText: { marginTop: 6, fontSize: 13, textAlign: 'center' },
  button: { padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
