import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LocationInput } from '@components/ui';
import { getTimezone, type LocationSuggestion } from '@lib/geocoding/geocode';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOnboardingDraft } from '@lib/onboarding/OnboardingContext';
import { getNextStep, getStepIndex } from '@lib/onboarding/steps';

export default function BirthLocationScreen() {
  const router = useRouter();
  const { capture } = useAnalytics();
  const theme = useAppTheme();
  const { draft, updateDraft } = useOnboardingDraft();

  capture('screen_viewed', { screen: 'onboarding birth location' });

  const [location, setLocation] = useState(draft.locationApproximate ? '' : draft.birthLocation);
  const [selected, setSelected] = useState<LocationSuggestion | null>(
    !draft.locationApproximate && draft.birthLat !== null && draft.birthLng !== null
      ? {
          displayName: draft.birthLocation,
          shortName: draft.birthLocation,
          lat: draft.birthLat,
          lng: draft.birthLng,
        }
      : null
  );
  const [skipped, setSkipped] = useState(draft.locationApproximate);
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const { index, total } = getStepIndex('birth-location');

  const handleChangeValue = (value: string) => {
    setLocation(value);
    setSelected(null);
    if (error) setError(null);
  };

  const handleConfirmed = (suggestion: LocationSuggestion) => {
    setSelected(suggestion);
    setError(null);
  };

  const toggleSkipped = () => {
    setSkipped(v => {
      const next = !v;
      if (next) {
        setSelected(null);
        setError(null);
      }
      return next;
    });
  };

  const canContinue = !resolving && (skipped || selected !== null);

  const handleContinue = async () => {
    if (!canContinue) {
      setError('Please pick a location from the suggestions, or check the box below to skip.');
      return;
    }

    if (skipped) {
      updateDraft({
        birthLocation: 'Not specified',
        birthLat: null,
        birthLng: null,
        birthTimezone: null,
        locationApproximate: true,
      });
      router.push(`/(onboarding)/${getNextStep('birth-location')}`);
      return;
    }

    // Resolve the IANA timezone before advancing so the time picker can show it
    // and so birth_time + birth_timezone are paired at point of capture.
    // Network failure is non-fatal — falls back to null and the time step shows
    // the same "approximate rising sign" warning as the skipped path.
    setResolving(true);
    const tz = await getTimezone(selected!.lat, selected!.lng);
    setResolving(false);

    updateDraft({
      birthLocation: selected!.displayName,
      birthLat: selected!.lat,
      birthLng: selected!.lng,
      birthTimezone: tz,
      locationApproximate: false,
    });
    router.push(`/(onboarding)/${getNextStep('birth-location')}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View style={styles.content}>
        <Text style={[styles.progress, { color: theme.colors.brand.primary }]}>
          Step {index} of {total}
        </Text>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Where were you born?
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Search below and pick your birthplace. If you'd rather not share a city, you can select
          just your state or country.
        </Text>

        <LocationInput
          value={location}
          onChangeValue={handleChangeValue}
          onConfirmed={handleConfirmed}
          error={error ?? undefined}
          editable={!skipped}
          hint={
            selected
              ? `Selected: ${selected.displayName}`
              : 'This helps us calculate your rising sign more accurately'
          }
        />

        <Pressable
          style={styles.toggleRow}
          onPress={toggleSkipped}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: skipped }}
          accessibilityLabel="I'd rather not provide my birthplace"
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: theme.colors.brand.primary,
                backgroundColor: skipped ? theme.colors.brand.primary : 'transparent',
              },
            ]}
          >
            {skipped && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.toggleLabel, { color: theme.colors.text.primary }]}>
            I'd rather not provide my birthplace
          </Text>
        </Pressable>

        {skipped && (
          <View
            style={[
              styles.disclosureBanner,
              {
                backgroundColor: theme.colors.brand.primary + '18',
                borderColor: theme.colors.brand.primary + '40',
              },
            ]}
          >
            <Text style={[styles.disclosureText, { color: theme.colors.text.secondary }]}>
              Your sun and moon signs will still be accurate. Without a birthplace, we can't compute
              your rising sign or house placements.
            </Text>
          </View>
        )}
      </View>

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.brand.primary,
            opacity: canContinue ? 1 : 0.5,
          },
        ]}
        onPress={handleContinue}
        disabled={!canContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        accessibilityState={{ disabled: !canContinue, busy: resolving }}
      >
        {resolving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, paddingTop: 16 },
  progress: { fontSize: 14, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
  toggleLabel: { fontSize: 15, fontWeight: '500', flex: 1 },
  disclosureBanner: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },
  disclosureText: { fontSize: 14, lineHeight: 20 },
  button: { padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
