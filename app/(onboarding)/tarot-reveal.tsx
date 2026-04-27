import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { supabase } from '@lib/supabase/client';
import { ZodiacSign } from '@lib/astrology/calculate-signs';
import { ZodiacAvatar } from '@components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAppTheme } from '@/hooks/useAppTheme';

interface TarotAssociation {
  cardId: number;
  cardName: string;
  zodiacName: string;
  associationType: string | null;
  description: string | null;
}

export default function TarotRevealScreen() {
  const router = useRouter();
  const { capture } = useAnalytics();
  const { sunSign } = useLocalSearchParams<{ sunSign: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [association, setAssociation] = useState<TarotAssociation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useAppTheme();

  capture('screen_viewed', { screen: 'onboarding tarot reveal' });

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
          .select(
            'description, association_type, tarot_card_id, tarot_cards!tarot_card_id(id, name)'
          )
          .eq('zodiac_sign_id', zodiacData.id)
          .single();

        if (assocError || !data) {
          const msg = `zodiac_tarot_associations lookup failed for zodiac_sign_id=${zodiacData.id}: ${assocError?.message ?? 'no row'}`;
          console.warn(msg);
          throw new Error(msg);
        }

        const tarotCards = data.tarot_cards as { id: number; name: string } | null;

        setAssociation({
          cardId: tarotCards?.id ?? data.tarot_card_id,
          cardName: tarotCards?.name ?? '',
          zodiacName: zodiacData.name,
          associationType: data.association_type ?? null,
          description: data.description,
        });

        // Persist tarot card fields to the user row so the profile page reads
        // everything from the existing user query — no extra round trip needed.
        if (user && (tarotCards?.id ?? data.tarot_card_id)) {
          supabase
            .from('users')
            .update({ tarot_card_id: tarotCards?.id ?? data.tarot_card_id })
            .eq('id', user.id)
            .then(() => queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] }));
        }
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.surface.background },
      ]}
      style={{ backgroundColor: theme.colors.surface.background }}
      bounces={false}
    >
      <View style={styles.avatarContainer}>
        <ZodiacAvatar sign={sunSign as ZodiacSign} size={100} />
      </View>

      <Text style={[styles.heading, { color: theme.colors.brand.primary }]}>
        Your Associated Card
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.brand.primary} style={styles.loader} />
      ) : error || !association ? (
        <Text style={[styles.errorText, { color: theme.colors.text.muted }]}>
          {error ?? 'Could not load your tarot card.'}
        </Text>
      ) : (
        <View style={styles.cardContainer}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
            {association.cardName}{' '}
            <Text style={[styles.separator, { color: theme.colors.brand.primary }]}>&lt;&gt;</Text>{' '}
            {association.zodiacName}
          </Text>
          {association.associationType ? (
            <Text style={[styles.associationType, { color: theme.colors.brand.primary }]}>
              {association.associationType}
            </Text>
          ) : null}
          {association.description ? (
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
              {association.description}
            </Text>
          ) : null}
        </View>
      )}

      <Pressable
        style={[styles.beginButton, { backgroundColor: theme.colors.brand.primary }]}
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
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 32,
  },
  errorText: {
    fontSize: 15,
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
    textAlign: 'center',
    lineHeight: 34,
  },
  separator: {
    fontWeight: '400',
  },
  associationType: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
  },
  beginButton: {
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
