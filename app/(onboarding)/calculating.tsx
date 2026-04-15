import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { supabase } from '@lib/supabase/client';
import { calculateAstrologyData, ZodiacSign } from '@lib/astrology/calculate-signs';
import { computeNatalChart } from '@lib/astrology/natal-chart';
import {
  onboardingParamsSchema,
  astrologyDataSchema,
  userOnboardingUpdateSchema,
} from '@lib/validation/onboarding';
import { ZodiacAvatar } from '@components/ui';

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

      // Compute natal chart without coords — ASC/MC will be null.
      // The profile screen will geocode birth_location on first visit and
      // recompute the chart with coordinates to fill in ASC/MC.
      setStatus('Charting your sky...');
      const natalChart = computeNatalChart(birthDate, validatedParams.birthTime, null, null);

      // Validate the full DB update payload
      const updatePayload = userOnboardingUpdateSchema.parse({
        display_name: validatedParams.displayName,
        birth_date: validatedParams.birthDate,
        birth_time: validatedParams.birthTime,
        birth_location: validatedParams.birthLocation,
        birth_lat: null,
        birth_lng: null,
        birth_timezone: null,
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
          birth_lat: null,
          birth_lng: null,
          birth_timezone: null,
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
        birthLat: null,
        birthLng: null,
        birthTimezone: null,
        birthDetailsEditedAt: null,
        sunSign: astrologyData.sunSign,
        moonSign: astrologyData.moonSign,
        risingSign: astrologyData.risingSign,
        natalChartData: natalChart,
        tarotCard: null, // populated by tarot-reveal step
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Update onboarding cache so the layout's effect fires and navigates to home.
      // This avoids a race where router.replace runs while onboardingCompleted is
      // still false in cache, causing the layout to redirect back to onboarding.
      setStatus('Your cosmic profile is ready.');
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
      {!failed && !completed && <ActivityIndicator size="large" color="#8b5cf6" />}
      <Text style={styles.status} accessibilityRole="text" accessibilityLiveRegion="polite">
        {status}
      </Text>
      {completed && (
        <Pressable
          style={styles.beginButton}
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
  beginButton: {
    backgroundColor: '#8b5cf6',
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
