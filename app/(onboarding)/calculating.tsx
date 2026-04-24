import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { supabase } from '@lib/supabase/client';
import {
  calculateSunSign,
  calculateMoonSign,
  longitudeToSign,
  ZodiacSign,
} from '@lib/astrology/calculate-signs';
import { computeNatalChart } from '@lib/astrology/natal-chart';
import {
  onboardingParamsSchema,
  userOnboardingUpdateSchema,
} from '@lib/validation/onboarding';
import { getTimezone } from '@lib/geocoding/geocode';
import { ZodiacAvatar } from '@components/ui';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function CalculatingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('Calculating your signs...');
  const [failed, setFailed] = useState(false);
  const [sunSign, setSunSign] = useState<ZodiacSign | null>(null);
  const [completed, setCompleted] = useState(false);
  const hasRun = useRef(false);
  const theme = useAppTheme();

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
        birthLat: params.birthLat,
        birthLng: params.birthLng,
        timeKnown: params.timeKnown,
        locationApproximate: params.locationApproximate,
      });

      // Parse birth date as local noon to avoid UTC boundary issues.
      // "YYYY-MM-DD" strings passed via router params are always local calendar
      // dates — constructing at noon ensures the calendar date stays correct
      // regardless of the device timezone.
      const [year, month, day] = validatedParams.birthDate.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day, 12, 0, 0);

      // Calculate sun and moon signs — always available; rising is derived below from ASC.
      setStatus('Calculating your astrological signs...');
      const sunSignValue = calculateSunSign(birthDate);
      const moonSignValue = calculateMoonSign(birthDate);
      setSunSign(sunSignValue);

      // Coordinates come from the autocomplete selection; no geocode round-trip needed.
      const parsedLat =
        validatedParams.birthLat && validatedParams.birthLat.length > 0
          ? parseFloat(validatedParams.birthLat)
          : NaN;
      const parsedLng =
        validatedParams.birthLng && validatedParams.birthLng.length > 0
          ? parseFloat(validatedParams.birthLng)
          : NaN;
      const birthLat = Number.isFinite(parsedLat) ? parsedLat : null;
      const birthLng = Number.isFinite(parsedLng) ? parsedLng : null;

      let birthTimezone: string | null = null;
      let tzLookupFailed = false;
      if (birthLat !== null && birthLng !== null) {
        setStatus('Locating your birthplace...');
        birthTimezone = await getTimezone(birthLat, birthLng);
        if (!birthTimezone) tzLookupFailed = true;
      }

      // Compute natal chart. When the user skipped birth time, fall back to local
      // noon for planet positions — ASC won't be used (locked out via canDeriveAsc).
      setStatus('Charting your sky...');
      const timeForChart = validatedParams.birthTime || '12:00';
      const natalChart = computeNatalChart(
        birthDate,
        timeForChart,
        birthLat,
        birthLng,
        birthTimezone,
      );

      const canDeriveAsc =
        validatedParams.timeKnown !== 'false' &&
        validatedParams.locationApproximate !== 'true' &&
        natalChart.ascendant !== null;
      const risingSignValue: ZodiacSign | null = canDeriveAsc
        ? longitudeToSign(natalChart.ascendant!)
        : null;

      const storedBirthTime = validatedParams.birthTime || null;

      // Validate the full DB update payload
      const updatePayload = userOnboardingUpdateSchema.parse({
        display_name: validatedParams.displayName,
        birth_date: validatedParams.birthDate,
        birth_time: storedBirthTime,
        birth_location: validatedParams.birthLocation,
        birth_lat: birthLat,
        birth_lng: birthLng,
        birth_timezone: birthTimezone,
        sun_sign: sunSignValue,
        moon_sign: moonSignValue,
        rising_sign: risingSignValue,
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
          birth_lat: birthLat,
          birth_lng: birthLng,
          birth_timezone: birthTimezone,
          sun_sign: updatePayload.sun_sign,
          moon_sign: updatePayload.moon_sign,
          rising_sign: updatePayload.rising_sign,
          natal_chart_data: natalChart,
          onboarding_completed: updatePayload.onboarding_completed,
        }, {
          onConflict: 'id'
        });

      if (tzLookupFailed) {
        // Non-fatal — sun/moon stored accurately; rising derivation used device-local
        // offset fallback. Surface to the user so they understand any slight drift.
        setStatus("We couldn't confirm your timezone; rising sign may be approximate.");
      }

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

      // Pre-populate the userProfile cache so the home screen renders the avatar
      // instantly without a second Supabase round-trip after navigation.
      queryClient.setQueryData(['userProfile', user.id], {
        id: user.id,
        email: user.email ?? '',
        displayName: updatePayload.display_name,
        avatarUrl: null,
        birthDate: updatePayload.birth_date,
        birthTime: updatePayload.birth_time,
        birthLocation: updatePayload.birth_location,
        birthLat,
        birthLng,
        birthTimezone,
        birthDetailsEditedAt: null,
        sunSign: sunSignValue,
        moonSign: moonSignValue,
        risingSign: risingSignValue,
        natalChartData: natalChart,
        tarotCard: null, // populated by tarot-reveal step
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Update onboarding cache so the layout's effect fires and navigates to home.
      // This avoids a race where router.replace runs while onboardingCompleted is
      // still false in cache, causing the layout to redirect back to onboarding.
      if (!tzLookupFailed) setStatus('Your cosmic profile is ready.');
      setCompleted(true);
    } catch (err) {
      console.warn('Error completing onboarding:', err);
      setStatus('Something went wrong.');
      setFailed(true);
    }
  }, [user, params, queryClient]);

  useEffect(() => {
    // Wait for auth to resolve before attempting — user is null during the
    // initial render and would cause a silent early return, setting hasRun
    // before the real work could run.
    if (authLoading || !user) return;
    if (!hasRun.current) {
      hasRun.current = true;
      completeOnboarding();
    }
  }, [completeOnboarding, authLoading, user]);

  const handleRetry = () => {
    hasRun.current = false;
    completeOnboarding();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      {failed ? (
        <Text style={styles.emoji}>⚠️</Text>
      ) : sunSign ? (
        <View style={styles.avatarReveal}>
          <ZodiacAvatar sign={sunSign} size={120} />
          <Text style={[styles.sunSignLabel, { color: theme.colors.brand.primary }]}>
            Your sun is in {sunSign}
          </Text>
        </View>
      ) : (
        <Text style={styles.emoji}>✨🔮✨</Text>
      )}
      {!failed && !completed && <ActivityIndicator size="large" color={theme.colors.brand.primary} />}
      <Text
        style={[styles.status, { color: theme.colors.text.secondary }]}
        accessibilityRole="text"
        accessibilityLiveRegion="polite"
      >
        {status}
      </Text>
      {completed && (
        <Pressable
          style={[styles.beginButton, { backgroundColor: theme.colors.brand.primary }]}
          onPress={() => {
            router.replace({
              pathname: '/(onboarding)/tarot-reveal',
              params: { sunSign: sunSign! },
            });
          }}
          accessibilityRole="button"
          accessibilityLabel="See your tarot card"
        >
          <Text style={styles.beginButtonText}>Continue ✨</Text>
        </Pressable>
      )}
      {failed && (
        <View style={styles.errorActions}>
          <Pressable
            style={[styles.retryButton, { backgroundColor: theme.colors.brand.primary }]}
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
            <Text style={[styles.backButtonText, { color: theme.colors.brand.primary }]}>
              Go Back
            </Text>
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
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
  },
  errorActions: {
    marginTop: 32,
    gap: 12,
    alignItems: 'center',
  },
  beginButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 32,
    alignItems: 'center',
  },
  beginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  retryButton: {
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
    fontSize: 16,
    fontWeight: '600',
  },
});
