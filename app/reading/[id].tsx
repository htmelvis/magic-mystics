import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useAppTheme } from '@hooks/useAppTheme';
import { supabase } from '@lib/supabase/client';
import { AIInsightSection, CardDetail } from '@components/tarot';
import { parseAIInsight } from '@/types/ai-insight';
import type { AIInsight } from '@/types/ai-insight';
import type { DrawnCardRecord, TarotCardOrientation, TarotCardRow } from '@/types/tarot';

interface LoadedReading {
  card: TarotCardRow;
  orientation: TarotCardOrientation;
  insight: AIInsight | null;
  belongsToMe: boolean;
}

export default function ReadingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useAppTheme();
  const { user } = useAuth();
  const { isPremium } = useSubscription(user?.id);

  const [loading, setLoading] = useState(true);
  const [reading, setReading] = useState<LoadedReading | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // RLS on readings only returns the row if it belongs to the current
        // authenticated user. A null row means the reading exists but was
        // shared by someone else — we show a stranger-view CTA below.
        const { data: row, error: readingError } = await supabase
          .from('readings')
          .select('id, user_id, drawn_cards, ai_insight')
          .eq('id', id)
          .maybeSingle();

        if (readingError) throw readingError;

        if (!row) {
          if (!cancelled) setReading(null);
          return;
        }

        const drawn = (row.drawn_cards as DrawnCardRecord[])[0];
        const { data: cardRow, error: cardError } = await supabase
          .from('tarot_cards')
          .select('*')
          .eq('id', drawn.cardId)
          .single();

        if (cardError) throw cardError;

        if (cancelled) return;
        setReading({
          card: cardRow as TarotCardRow,
          orientation: drawn.orientation,
          insight: parseAIInsight(row.ai_insight),
          belongsToMe: row.user_id === user?.id,
        });
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, user?.id]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/home'))}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backText, { color: theme.colors.brand.primary }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.topBarTitle, { color: theme.colors.text.primary }]}>Reading</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.brand.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: theme.colors.error.main }]}>{error}</Text>
        </View>
      ) : !reading ? (
        <StrangerView
          onDraw={() => router.replace('/(tabs)/draw')}
          onHome={() => router.replace('/(tabs)/home')}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {reading.card.name}
          </Text>
          {reading.belongsToMe && (
            <AIInsightSection
              insight={reading.insight}
              isLoading={false}
              isPremium={isPremium}
            />
          )}
          <CardDetail card={reading.card} orientation={reading.orientation} />
        </ScrollView>
      )}
    </View>
  );
}

function StrangerView({ onDraw, onHome }: { onDraw: () => void; onHome: () => void }) {
  const theme = useAppTheme();
  return (
    <View style={styles.centered}>
      <Text style={styles.strangerIcon}>✦</Text>
      <Text style={[styles.strangerTitle, { color: theme.colors.text.primary }]}>
        This reading isn't yours
      </Text>
      <Text style={[styles.strangerBody, { color: theme.colors.text.secondary }]}>
        Pull your own daily card to see what the deck says for you today.
      </Text>
      <TouchableOpacity
        style={[styles.cta, { backgroundColor: theme.colors.brand.primary }]}
        onPress={onDraw}
        accessibilityRole="button"
        accessibilityLabel="Draw your own card"
      >
        <Text style={[styles.ctaText, { color: theme.colors.text.inverse }]}>Draw your card</Text>
      </TouchableOpacity>
      <Pressable onPress={onHome} style={styles.secondaryLink}>
        <Text style={[styles.secondaryLinkText, { color: theme.colors.brand.primary }]}>
          Back to home
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: { padding: 4 },
  backText: { fontSize: 12, fontWeight: '600' },
  topBarTitle: { fontSize: 12, fontWeight: '600', flex: 1, textAlign: 'center' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  scroll: { padding: 20, gap: 16, paddingBottom: 48 },
  title: { fontSize: 20, fontWeight: 'bold' },
  errorText: { fontSize: 14, textAlign: 'center' },
  strangerIcon: { fontSize: 40, color: '#c084fc' },
  strangerTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  strangerBody: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 12, maxWidth: 320 },
  cta: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999 },
  ctaText: { fontSize: 15, fontWeight: '700' },
  secondaryLink: { marginTop: 8 },
  secondaryLinkText: { fontSize: 14, fontWeight: '600' },
});
