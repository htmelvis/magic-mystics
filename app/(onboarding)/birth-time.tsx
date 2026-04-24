import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function BirthTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { capture } = useAnalytics();
  const theme = useAppTheme();
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [error, setError] = useState<string | null>(null);
  const [timeUnknown, setTimeUnknown] = useState(false);

  capture('screen_viewed', { screen: 'onboarding birth time' });

  const validate = (value: Date): string | null => {
    if (isNaN(value.getTime())) return 'Please select a valid time';
    return null;
  };

  const handleContinue = () => {
    if (timeUnknown) {
      router.push({
        pathname: '/(onboarding)/birth-location',
        params: {
          displayName: params.displayName as string,
          birthDate: params.birthDate as string,
          birthTime: '',
          timeKnown: 'false',
        },
      });
      return;
    }

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
        timeKnown: 'true',
      },
    });
  };

  const onChange = (_event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      if (error) setError(validate(selectedTime));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View style={styles.content}>
        <Text style={[styles.progress, { color: theme.colors.brand.primary }]}>Step 3 of 4</Text>
        <Text style={[styles.title, { color: theme.colors.text.primary }]} accessibilityRole="header">
          What time were you born?
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Your birth time helps us calculate your rising sign (ascendant)
        </Text>

        {!timeUnknown && (
          <View style={styles.pickerContainer}>
            {Platform.OS === 'android' && !showPicker && (
              <Pressable
                style={[
                  styles.timeButton,
                  {
                    backgroundColor: theme.colors.brand.primaryMuted,
                    borderColor: theme.colors.brand.primary,
                  },
                ]}
                onPress={() => setShowPicker(true)}
                accessibilityRole="button"
                accessibilityLabel={`Selected birth time: ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                accessibilityHint="Double-tap to open time picker"
              >
                <Text style={[styles.timeButtonText, { color: theme.colors.brand.primary }]}>
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
                textColor={theme.colors.text.primary}
              />
            )}
          </View>
        )}

        {error && !timeUnknown ? (
          <Text style={[styles.errorText, { color: theme.colors.error.main }]}>{error}</Text>
        ) : null}

        <Pressable
          style={styles.toggleRow}
          onPress={() => {
            setTimeUnknown((v) => !v);
            setError(null);
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: timeUnknown }}
          accessibilityLabel="I don't know my birth time"
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: theme.colors.brand.primary,
                backgroundColor: timeUnknown ? theme.colors.brand.primary : 'transparent',
              },
            ]}
          >
            {timeUnknown && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.toggleLabel, { color: theme.colors.text.primary }]}>
            I don't know my birth time
          </Text>
        </Pressable>

        {timeUnknown && (
          <Text style={[styles.disclosure, { color: theme.colors.text.secondary }]}>
            We'll compute your sun and moon signs, but your rising sign needs a birth time.
          </Text>
        )}
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.brand.primary }]}
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
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, paddingTop: 16 },
  progress: { fontSize: 14, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24, marginBottom: 40 },
  pickerContainer: { alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  timeButton: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    width: '100%',
    alignItems: 'center',
  },
  timeButtonText: { fontSize: 18, fontWeight: '600' },
  errorText: { marginTop: 6, fontSize: 13, textAlign: 'center' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  toggleLabel: { fontSize: 15, fontWeight: '500' },
  disclosure: { fontSize: 14, lineHeight: 20, marginTop: 12 },
  button: { padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
