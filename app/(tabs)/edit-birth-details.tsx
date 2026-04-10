import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen } from '@components/ui';
import { supabase } from '@lib/supabase/client';
import { calculateAstrologyData } from '@lib/astrology/calculate-signs';
import { geocodeLocation } from '@lib/geocoding/geocode';

const MIN_DATE = new Date(1900, 0, 1);

function parseBirthDate(birthDate: string | null): Date {
  if (!birthDate) return new Date();
  const d = new Date(birthDate + 'T00:00:00');
  return isNaN(d.getTime()) ? new Date() : d;
}

function parseBirthTime(birthTime: string | null): Date {
  const base = new Date();
  if (!birthTime) return base;
  const [h, m] = birthTime.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return base;
  base.setHours(h, m, 0, 0);
  return base;
}

function formatTimeLabel(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function EditBirthDetailsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.id);
  const queryClient = useQueryClient();
  const theme = useAppTheme();

  const [date, setDate] = useState(() => parseBirthDate(userProfile?.birthDate ?? null));
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [time, setTime] = useState(() => parseBirthTime(userProfile?.birthTime ?? null));
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios');
  const [location, setLocation] = useState(userProfile?.birthLocation ?? '');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const validateLocation = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your birth location';
    if (trimmed.length < 2) return 'Location must be at least 2 characters';
    return null;
  };

  const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) setDate(selected);
  };

  const handleTimeChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selected) setTime(selected);
  };

  const handleSave = useCallback(async () => {
    if (!user) return;

    const locError = validateLocation(location);
    if (locError) {
      setLocationError(locError);
      return;
    }

    if (date > new Date() || date < MIN_DATE) {
      Alert.alert('Invalid date', 'Birth date must be between January 1, 1900 and today.');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const birthTime = `${hours}:${minutes}`;
      const birthLocation = location.trim();
      const formattedDate = date.toISOString().split('T')[0];

      const astrologyData = calculateAstrologyData(date, birthTime, birthLocation);
      const coords = await geocodeLocation(birthLocation);

      const { error } = await supabase
        .from('users')
        .update({
          birth_date: formattedDate,
          birth_time: birthTime,
          birth_location: birthLocation,
          birth_lat: coords?.lat ?? null,
          birth_lng: coords?.lng ?? null,
          sun_sign: astrologyData.sunSign,
          moon_sign: astrologyData.moonSign,
          rising_sign: astrologyData.risingSign,
          birth_details_edited_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
      router.back();
    } catch {
      setSaveError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [user, date, time, location, queryClient, router]);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={styles.cancelButton}
          >
            <Text style={[styles.cancelText, { color: theme.colors.brand.primary }]}>Cancel</Text>
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Edit Birth Details
          </Text>
        </View>

        <View
          style={[
            styles.warningBanner,
            {
              backgroundColor: theme.colors.brand.primary + '18',
              borderColor: theme.colors.brand.primary + '40',
            },
          ]}
        >
          <Text style={[styles.warningText, { color: theme.colors.text.secondary }]}>
            You can only edit your birth details once. This cannot be undone.
          </Text>
        </View>

        {/* Birth Date */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Birth Date</Text>
          {Platform.OS === 'android' && !showDatePicker && (
            <Pressable
              style={[
                styles.pickerButton,
                {
                  backgroundColor: theme.colors.surface.card,
                  borderColor: theme.colors.border.main,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
              accessibilityRole="button"
              accessibilityLabel={`Birth date: ${date.toLocaleDateString()}`}
            >
              <Text style={[styles.pickerButtonText, { color: theme.colors.text.primary }]}>
                {date.toLocaleDateString()}
              </Text>
            </Pressable>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={MIN_DATE}
            />
          )}
        </View>

        {/* Birth Time */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Birth Time</Text>
          {Platform.OS === 'android' && !showTimePicker && (
            <Pressable
              style={[
                styles.pickerButton,
                {
                  backgroundColor: theme.colors.surface.card,
                  borderColor: theme.colors.border.main,
                },
              ]}
              onPress={() => setShowTimePicker(true)}
              accessibilityRole="button"
              accessibilityLabel={`Birth time: ${formatTimeLabel(time)}`}
            >
              <Text style={[styles.pickerButtonText, { color: theme.colors.text.primary }]}>
                {formatTimeLabel(time)}
              </Text>
            </Pressable>
          )}
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Birth Location */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
            Birth Location
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface.card,
                borderColor: locationError ? '#dc2626' : theme.colors.border.main,
                color: theme.colors.text.primary,
              },
            ]}
            placeholder="e.g. Los Angeles, USA"
            placeholderTextColor={theme.colors.text.muted}
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (locationError) setLocationError(validateLocation(text));
            }}
            onBlur={() => setLocationError(validateLocation(location))}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={200}
            returnKeyType="done"
          />
          {locationError && <Text style={styles.errorText}>{locationError}</Text>}
        </View>

        {saveError && <Text style={[styles.errorText, { textAlign: 'center' }]}>{saveError}</Text>}

        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.brand.primary, opacity: saving ? 0.7 : 1 },
          ]}
          onPress={handleSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Save changes"
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 8,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  warningBanner: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  pickerButton: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
  },
  saveButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
