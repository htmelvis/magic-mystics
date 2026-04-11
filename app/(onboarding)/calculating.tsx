import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { supabase } from '@lib/supabase/client';
import { calculateAstrologyData, ZodiacSign } from '@lib/astrology/calculate-signs';
import { computeNatalChart } from '@lib/astrology/natal-chart';
import { geocodeLocation, getTimezone } from '@lib/geocoding/geocode';
import {
  onboardingParamsSchema,
  astrologyDataSchema,
  userOnboardingUpdateSchema,
} from '@lib/validation/onboarding';
import { ZodiacAvatar } from '@components/ui';

export default function CalculatingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('Calculating your signs...');
  const [failed, setFailed] = useState(false);
  const [sunSign, setSunSign] = useState<ZodiacSign | null>(null);
  const hasRun = useRef(false);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;

    setFailed(false);
    setStatus('Calculating your signs...');

    try {
      // Validate raw params from router before any processing
      const validatedParams = onboardingParamsSchema.parse({
        displayName: params.displayName,
        birthDate: params.birthDate,
        birthTime: params.birthTime,
        birthLocation: params.birthLocation,
      });

      // Parse birth date as local noon to avoid UTC boundary issues.
      // "YYYY-MM-DD" strings passed via router params are always local calendar
      // dates — constructing at noon ensures the calendar date stays correct
      // regardless of the device timezone.
      const [year, month, day] = validatedParams.birthDate.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day, 12, 0, 0);

      // Calculate astrology signs
      setStatus('Calculating your astrological signs...');
      const rawAstrologyData = calculateAstrologyData(
        birthDate,
        validatedParams.birthTime,
        validatedParams.birthLocation
      );

      // Validate calculated signs before writing to DB
      const astrologyData = astrologyDataSchema.parse(rawAstrologyData);
      setSunSign(astrologyData.sunSign);

      // Geocode birth location and look up its IANA timezone — both non-blocking
      setStatus('Locating your birthplace...');
      const coords = await geocodeLocation(validatedParams.birthLocation);
      const timezone = coords ? await getTimezone(coords.lat, coords.lng) : null;

      // Compute natal chart (coords may be null — chart degrades gracefully, no ASC/MC)
      setStatus('Charting your sky...');
      const natalChart = computeNatalChart(
        birthDate,
        validatedParams.birthTime,
        coords?.lat ?? null,
        coords?.lng ?? null,
      );

      // Validate the full DB update payload
      const updatePayload = userOnboardingUpdateSchema.parse({
        display_name: validatedParams.displayName,
        birth_date: validatedParams.birthDate,
        birth_time: validatedParams.birthTime,
        birth_location: validatedParams.birthLocation,
        birth_lat: coords?.lat ?? null,
        birth_lng: coords?.lng ?? null,
        birth_timezone: timezone,
        sun_sign: astrologyData.sunSign,
        moon_sign: astrologyData.moonSign,
        rising_sign: astrologyData.risingSign,
        onboarding_completed: true,
      });

      // Save to database (upsert to handle case where trigger didn't create row)
      setStatus('Saving your profile...');
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email ?? '',
          display_name: updatePayload.display_name,
          birth_date: updatePayload.birth_date,
          birth_time: updatePayload.birth_time,
          birth_location: updatePayload.birth_location,
          birth_lat: updatePayload.birth_lat ?? null,
          birth_lng: updatePayload.birth_lng ?? null,
          birth_timezone: updatePayload.birth_timezone ?? null,
          sun_sign: updatePayload.sun_sign,
          moon_sign: updatePayload.moon_sign,
          rising_sign: updatePayload.rising_sign,
          natal_chart_data: natalChart,
          onboarding_completed: updatePayload.onboarding_completed,
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.warn('Error saving onboarding data:', error);
        throw error;
      }

      // Ensure user has a subscription (in case trigger didn't fire)
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingSub) {
        await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            tier: 'free',
            is_active: true,
          });
      }

      // Update cache immediately so the layout's effect fires and navigates to home.
      // This avoids a race where router.replace runs while onboardingCompleted is
      // still false in cache, causing the layout to redirect back to onboarding.
      setStatus('All set! Taking you to your dashboard...');
      queryClient.setQueryData(['onboarding', user.id], true);
    } catch (err) {
      console.warn('Error completing onboarding:', err);
      setStatus('Something went wrong.');
      setFailed(true);
    }
  }, [user, params, queryClient]);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      completeOnboarding();
    }
  }, [completeOnboarding]);

  const handleRetry = () => {
    hasRun.current = false;
    completeOnboarding();
  };

  return (
    <View style={styles.container}>
      {failed ? (
        <Text style={styles.emoji}>⚠️</Text>
      ) : sunSign ? (
        <View style={styles.avatarReveal}>
          <ZodiacAvatar sign={sunSign} size={120} />
          <Text style={styles.sunSignLabel}>Your sun is in {sunSign}</Text>
        </View>
      ) : (
        <Text style={styles.emoji}>✨🔮✨</Text>
      )}
      {!failed && <ActivityIndicator size="large" color="#8b5cf6" />}
      <Text style={styles.status} accessibilityRole="text" accessibilityLiveRegion="polite">
        {status}
      </Text>
      {failed && (
        <View style={styles.errorActions}>
          <Pressable
            style={styles.retryButton}
            onPress={handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 32,
  },
  avatarReveal: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  sunSignLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8b5cf6',
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
  errorActions: {
    marginTop: 32,
    gap: 12,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  backButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
});
