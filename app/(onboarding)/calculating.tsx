import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
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
import { onboardingParamsSchema, userOnboardingUpdateSchema } from '@lib/validation/onboarding';
import { useOnboardingDraft } from '@lib/onboarding/OnboardingContext';
import { ZodiacSignGlyph } from '@components/ui';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function CalculatingScreen() {
  const router = useRouter();
  const { draft, resetDraft } = useOnboardingDraft();
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
      // Validate the draft via the existing schema (still string-shaped so the
      // contract is unchanged for callers/tests).
      const validatedParams = onboardingParamsSchema.parse({
        displayName: draft.displayName,
        birthDate: draft.birthDate,
        birthTime: draft.birthTime,
        birthLocation: draft.birthLocation,
        birthLat: draft.birthLat !== null ? String(draft.birthLat) : undefined,
        birthLng: draft.birthLng !== null ? String(draft.birthLng) : undefined,
        timeKnown: draft.timeKnown ? 'true' : 'false',
        locationApproximate: draft.locationApproximate ? 'true' : 'false',
      });

      // Parse birth date as local noon to avoid UTC boundary issues.
      const [year, month, day] = validatedParams.birthDate.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day, 12, 0, 0);

      setStatus('Calculating your astrological signs...');
      const sunSignValue = calculateSunSign(birthDate);
      const moonSignValue = calculateMoonSign(birthDate);
      setSunSign(sunSignValue);

      const birthLat = draft.birthLat;
      const birthLng = draft.birthLng;
      // Timezone was resolved on the location step; null when the user opted out
      // or when the lookup failed (the time step already surfaced the warning).
      const birthTimezone = draft.birthTimezone;

      // Compute natal chart. When the user skipped birth time, fall back to local
      // noon for planet positions — ASC won't be used (locked out via canDeriveAsc).
      setStatus('Charting your sky...');
      const timeForChart = validatedParams.birthTime || '12:00';
      const natalChart = computeNatalChart(
        birthDate,
        timeForChart,
        birthLat,
        birthLng,
        birthTimezone
      );

      const canDeriveAsc =
        validatedParams.timeKnown !== 'false' &&
        validatedParams.locationApproximate !== 'true' &&
        natalChart.ascendant !== null;
      const risingSignValue: ZodiacSign | null = canDeriveAsc
        ? longitudeToSign(natalChart.ascendant!)
        : null;

      const storedBirthTime = validatedParams.birthTime || null;

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

      setStatus('Saving your profile...');
      const { error } = await supabase.from('users').upsert(
        {
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
        },
        {
          onConflict: 'id',
        }
      );

      if (error) {
        console.warn('Error saving onboarding data:', error);
        throw error;
      }

      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingSub) {
        await supabase.from('subscriptions').insert({
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
        tarotCard: null,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setStatus('Your cosmic profile is ready.');
      setCompleted(true);
      resetDraft();
    } catch (err) {
      console.warn('Error completing onboarding:', err);
      setStatus('Something went wrong.');
      setFailed(true);
    }
  }, [user, draft, queryClient, resetDraft]);

  useEffect(() => {
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
          <ZodiacSignGlyph sign={sunSign} size={120} color={theme.colors.brand.primary} />
          <Text style={[styles.sunSignLabel, { color: theme.colors.brand.primary }]}>
            Your sun is in {sunSign}
          </Text>
        </View>
      ) : (
        <Text style={styles.emoji}>✨🔮✨</Text>
      )}
      {!failed && !completed && (
        <ActivityIndicator size="large" color={theme.colors.brand.primary} />
      )}
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
