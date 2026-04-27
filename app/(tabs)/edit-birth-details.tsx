import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
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
import type { User } from '@supabase/supabase-js';
import { useAuth } from '@hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen, LocationInput } from '@components/ui';
import { supabase } from '@lib/supabase/client';
import {
  calculateMoonSign,
  calculateSunSign,
  longitudeToSign,
} from '@lib/astrology/calculate-signs';
import { computeNatalChart } from '@lib/astrology/natal-chart';
import { getTimezone } from '@lib/geocoding/geocode';
import type { LocationSuggestion } from '@lib/geocoding/geocode';
import type { UserProfile } from '@/types/user';

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
  const theme = useAppTheme();
  const { user, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);

  const settled = !authLoading && !profileLoading;
  const missing = settled && (!user || !userProfile);

  useEffect(() => {
    if (missing) router.back();
  }, [missing, router]);

  if (!settled || !user || !userProfile) {
    return (
      <Screen>
        <View style={styles.loadingCenter}>
          <ActivityIndicator color={theme.colors.brand.primary} size="large" />
        </View>
      </Screen>
    );
  }

  return <EditBirthDetailsForm user={user} userProfile={userProfile} />;
}

function EditBirthDetailsForm({ user, userProfile }: { user: User; userProfile: UserProfile }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useAppTheme();

  const originalLocation = userProfile.birthLocation ?? '';
  const [date, setDate] = useState(() => parseBirthDate(userProfile.birthDate));
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [time, setTime] = useState(() => parseBirthTime(userProfile.birthTime));
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === 'ios');
  const [location, setLocation] = useState(originalLocation);
  const [selectedSuggestion, setSelectedSuggestion] = useState<LocationSuggestion | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const validateLocation = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your birth location';
    if (trimmed.length < 2) return 'Location must be at least 2 characters';
    return null;
  };

  const handleLocationChangeValue = (value: string) => {
    setLocation(value);
    setSelectedSuggestion(null);
    if (locationError) setLocationError(validateLocation(value));
  };

  const handleLocationConfirmed = (suggestion: LocationSuggestion) => {
    setSelectedSuggestion(suggestion);
    setLocationError(null);
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
    const locError = validateLocation(location);
    if (locError) {
      setLocationError(locError);
      return;
    }

    if (date > new Date() || date < MIN_DATE) {
      Alert.alert('Invalid date', 'Birth date must be between January 1, 1900 and today.');
      return;
    }

    const locationUnchanged = location.trim() === originalLocation.trim();
    if (!locationUnchanged && !selectedSuggestion) {
      Alert.alert(
        'Pick a location',
        'Please select your birthplace from the suggestions so we can update your chart accurately.'
      );
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const birthTime = `${hours}:${minutes}`;

      // Use local date components — avoids UTC boundary issues from toISOString()
      const y = date.getFullYear();
      const mon = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${y}-${mon}-${d}`;

      // Reconstruct birth date at local noon for accurate sign calculation
      const birthDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);

      // Pick coords: either the freshly selected suggestion or the stored values
      // (when the user didn't touch the location field).
      const birthLat = selectedSuggestion?.lat ?? userProfile.birthLat ?? null;
      const birthLng = selectedSuggestion?.lng ?? userProfile.birthLng ?? null;
      const birthLocation = selectedSuggestion?.displayName ?? location.trim();

      const timezone =
        birthLat !== null && birthLng !== null ? await getTimezone(birthLat, birthLng) : null;

      const natalChart = computeNatalChart(birthDate, birthTime, birthLat, birthLng, timezone);
      const risingSign =
        natalChart.ascendant !== null ? longitudeToSign(natalChart.ascendant) : null;

      const { error } = await supabase
        .from('users')
        .update({
          birth_date: formattedDate,
          birth_time: birthTime,
          birth_location: birthLocation,
          birth_lat: birthLat,
          birth_lng: birthLng,
          birth_timezone: timezone,
          sun_sign: calculateSunSign(birthDate),
          moon_sign: calculateMoonSign(birthDate),
          rising_sign: risingSign,
          natal_chart_data: natalChart,
          birth_details_edited_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        if (error.message?.includes('BIRTH_DETAILS_LOCKED')) {
          await queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
          Alert.alert(
            'Already edited',
            'Your birth details have already been updated once and cannot be changed again.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return;
        }
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
      router.back();
    } catch {
      setSaveError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [
    user,
    userProfile,
    date,
    time,
    location,
    selectedSuggestion,
    originalLocation,
    queryClient,
    router,
  ]);

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
        <LocationInput
          label="Birth Location"
          value={location}
          onChangeValue={handleLocationChangeValue}
          onConfirmed={handleLocationConfirmed}
          error={locationError ?? undefined}
          onBlur={() => setLocationError(validateLocation(location))}
        />

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
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
