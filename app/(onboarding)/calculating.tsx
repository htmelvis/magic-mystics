import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { supabase } from '@lib/supabase/client';
import { calculateAstrologyData } from '@lib/astrology/calculate-signs';
import {
  onboardingParamsSchema,
  astrologyDataSchema,
  userOnboardingUpdateSchema,
} from '@lib/validation/onboarding';

export default function CalculatingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState('Calculating your signs...');
  const hasRun = useRef(false);

  useEffect(() => {
    const completeOnboarding = async () => {
      if (!user || hasRun.current) return;
      hasRun.current = true;

      try {
        // Validate raw params from router before any processing
        const validatedParams = onboardingParamsSchema.parse({
          displayName: params.displayName,
          birthDate: params.birthDate,
          birthTime: params.birthTime,
          birthLocation: params.birthLocation,
        });

        const birthDate = new Date(validatedParams.birthDate);

        // Calculate astrology signs
        setStatus('Calculating your astrological signs...');
        const rawAstrologyData = calculateAstrologyData(
          birthDate,
          validatedParams.birthTime,
          validatedParams.birthLocation
        );

        // Validate calculated signs before writing to DB
        const astrologyData = astrologyDataSchema.parse(rawAstrologyData);

        // Format date for database (YYYY-MM-DD)
        const formattedDate = birthDate.toISOString().split('T')[0];

        // Validate the full DB update payload
        const updatePayload = userOnboardingUpdateSchema.parse({
          display_name: validatedParams.displayName,
          birth_date: formattedDate,
          birth_time: validatedParams.birthTime,
          birth_location: validatedParams.birthLocation,
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
            sun_sign: updatePayload.sun_sign,
            moon_sign: updatePayload.moon_sign,
            rising_sign: updatePayload.rising_sign,
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

        // Navigate to home
        setStatus('All set! Taking you to your dashboard...');
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1500);
      } catch (error) {
        console.warn('Error completing onboarding:', error);
        setStatus('Something went wrong. Please try again.');
        setTimeout(() => {
          router.back();
        }, 2000);
      }
    };

    completeOnboarding();
  }, [user, params, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✨🔮✨</Text>
      <ActivityIndicator size="large" color="#8b5cf6" />
      <Text style={styles.status}>{status}</Text>
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
  status: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
});
