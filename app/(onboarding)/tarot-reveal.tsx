import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { supabase } from '@lib/supabase/client';
import { ZodiacSign } from '@lib/astrology/calculate-signs';
import { ZodiacAvatar } from '@components/ui';

interface TarotAssociation {
  cardName: string;
  zodiacName: string;
  description: string | null;
}

export default function TarotRevealScreen() {
  const router = useRouter();
  const { sunSign } = useLocalSearchParams<{ sunSign: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [association, setAssociation] = useState<TarotAssociation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sunSign) {
      setError('No sun sign param received');
      setLoading(false);
      return;
    }

    async function fetchAssociation() {
      try {
        const { data: zodiacData, error: zodiacError } = await supabase
          .from('zodiac_signs')
          .select('id, name')
          .ilike('name', sunSign as string)
          .single();

        if (zodiacError || !zodiacData) {
          const msg = `zodiac_signs lookup failed for "${sunSign}": ${zodiacError?.message ?? 'no row'}`;
          console.warn(msg);
          throw new Error(msg);
        }

        const { data, error: assocError } = await supabase
          .from('zodiac_tarot_associations')
          .select('description, tarot_cards!tarot_card_id(name)')
          .eq('zodiac_sign_id', zodiacData.id)
          .single();

        if (assocError || !data) {
          const msg = `zodiac_tarot_associations lookup failed for zodiac_sign_id=${zodiacData.id}: ${assocError?.message ?? 'no row'}`;
          console.warn(msg);
          throw new Error(msg);
        }

        const tarotCards = data.tarot_cards as { name: string } | null;

        setAssociation({
          cardName: tarotCards?.name ?? '',
          zodiacName: zodiacData.name,
          description: data.description,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('TarotReveal fetch error:', msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchAssociation();
  }, [sunSign]);

  const handleBeginJourney = () => {
    queryClient.setQueryData(['onboarding', user!.id], true);
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.avatarContainer}>
        <ZodiacAvatar sign={sunSign as ZodiacSign} size={100} />
      </View>

      <Text style={styles.heading}>Your Associated Card</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#8b5cf6" style={styles.loader} />
      ) : error || !association ? (
        <Text style={styles.errorText}>{error ?? 'Could not load your tarot card.'}</Text>
      ) : (
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>
            {association.cardName}{' '}
            <Text style={styles.separator}>&lt;&gt;</Text>{' '}
            {association.zodiacName}
          </Text>
          {association.description ? (
            <Text style={styles.description}>{association.description}</Text>
          ) : null}
        </View>
      )}

      <Pressable
        style={styles.beginButton}
        onPress={handleBeginJourney}
        accessibilityRole="button"
        accessibilityLabel="Begin your journey"
      >
        <Text style={styles.beginButtonText}>Begin Journey ✨</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    paddingBottom: 48,
  },
  avatarContainer: {
    marginBottom: 28,
  },
  heading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 32,
  },
  errorText: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    marginVertical: 24,
    lineHeight: 22,
  },
  cardContainer: {
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
    width: '100%',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 34,
  },
  separator: {
    color: '#8b5cf6',
    fontWeight: '400',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
  },
  beginButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  beginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
