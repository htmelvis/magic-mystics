import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useTarotDeck } from '@hooks/useTarotDeck';
import { useInvalidateReadings } from '@hooks/useReadings';
import { useInvalidateJourneyStats } from '@hooks/useJourneyStats';
import { useReflection } from '@hooks/useReflection';
import type { Reflection, ReflectionSentiment } from '@hooks/useReflection';
import { supabase } from '@lib/supabase/client';
import { drawDailyCard, drawCard } from '@lib/tarot/draw';
import type { DrawnCardRecord, TarotCardOrientation, TarotCard as TarotCardType, TarotCardRow } from '@/types/tarot';
import { TarotCard, TarotDeck } from '@components/tarot';
import { ANIMATION } from '@components/tarot/card-constants';
import { ReflectionSheet } from '@components/history';

function getTodayBounds() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export default function DrawScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { cardIds, isLoading: deckLoading, error: deckError } = useTarotDeck();
  const invalidateReadings = useInvalidateReadings();
  const invalidateJourneyStats = useInvalidateJourneyStats();

  const [card, setCard] = useState<TarotCardRow | null>(null);
  const [orientation, setOrientation] = useState<TarotCardOrientation | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shuffleComplete, setShuffleComplete] = useState(false);

  const [reflectionSheetOpen, setReflectionSheetOpen] = useState(false);
  const { reflection, isSaving: isReflectionSaving, save: saveReflection } = useReflection(
    readingId,
    user?.id ?? null
  );

  const handleReflectionSave = useCallback(
    async (feeling: ReflectionSentiment, alignment: ReflectionSentiment, content: string) => {
      await saveReflection({ feeling, alignment, content });
      setReflectionSheetOpen(false);
    },
    [saveReflection]
  );

  // Deck fades out, card fades in — driven by the shuffle → draw sequence
  const deckOpacity = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // On mount: load today's existing daily reading if one exists.
  // Skipped in __DEV__ so you can draw freely during development.
  useEffect(() => {
    if (!user || deckLoading) return;

    if (__DEV__) {
      setChecking(false);
      return;
    }

    loadTodaysReading();
  }, [user, deckLoading]);

  // If an existing reading was found on load, skip the shuffle and jump straight
  // to the revealed card.
  useEffect(() => {
    if (checking) return;
    if (card) {
      deckOpacity.setValue(0);
      cardOpacity.setValue(1);
      setShuffleComplete(true);
    }
  }, [checking]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleShuffleComplete() {
    setShuffleComplete(true);
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: ANIMATION.cardFadeIn,
      useNativeDriver: true,
    }).start();
  }

  const loadTodaysReading = async () => {
    setChecking(true);
    try {
      const { start, end } = getTodayBounds();
      const { data, error: queryError } = await supabase
        .from('readings')
        .select('id, drawn_cards')
        .eq('user_id', user!.id)
        .eq('spread_type', 'daily')
        .gte('created_at', start)
        .lte('created_at', end)
        .maybeSingle();

      if (queryError) throw queryError;

      if (data) {
        // A reading exists for today — fetch full card for the detail view
        const drawn = (data.drawn_cards as DrawnCardRecord[])[0];
        const { data: cardData, error: cardError } = await supabase
          .from('tarot_cards')
          .select('*')
          .eq('id', drawn.cardId)
          .single();
        if (cardError) throw cardError;
        setCard(cardData as TarotCardRow);
        setOrientation(drawn.orientation);
        setReadingId(data.id);
      }
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setChecking(false);
    }
  };

  const handleDraw = async () => {
    if (!user || !cardIds.length) return;

    // Fade the deck out as the user initiates a draw
    Animated.timing(deckOpacity, {
      toValue: 0,
      duration: ANIMATION.deckFadeOut,
      useNativeDriver: true,
    }).start();

    setLoading(true);
    setError(null);
    setCard(null);
    setOrientation(null);
    setReadingId(null);

    try {
      // __DEV__: always random for rapid testing.
      // Production: seeded daily card (deterministic per user per day).
      const result = __DEV__
        ? drawCard(cardIds)
        : drawDailyCard(cardIds, user.id);

      // Fetch the full card first — we need name/arcana/suit for the snapshot
      const { data: cardData, error: cardError } = await supabase
        .from('tarot_cards')
        .select('*')
        .eq('id', result.cardId)
        .single();

      if (cardError) throw cardError;

      // Build the denormalized snapshot stored in drawn_cards JSONB.
      // Captures enough identity to render history without re-joining tarot_cards.
      const drawnCards: DrawnCardRecord[] = [
        {
          cardId: result.cardId,
          cardName: cardData.name,
          arcana: cardData.arcana as DrawnCardRecord['arcana'],
          suit: (cardData.suit ?? null) as DrawnCardRecord['suit'],
          orientation: result.orientation,
          position: null,
        },
      ];

      const { data: reading, error: insertError } = await supabase
        .from('readings')
        .insert({
          user_id: user.id,
          spread_type: 'daily',
          drawn_cards: drawnCards,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      setCard(cardData as TarotCardRow);
      setOrientation(result.orientation);
      setReadingId(reading.id);
      invalidateReadings(user.id);
      invalidateJourneyStats(user.id);
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isReady = !deckLoading && !checking;
  const isFlipped = !!card && !loading && !checking;
  const canDraw = isReady && !loading && !card && !deckError && shuffleComplete;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Daily Draw</Text>
        {__DEV__ && <Text style={styles.devBadge}>DEV</Text>}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.stage}>
          {!isReady ? (
            <ActivityIndicator color="#8b5cf6" size="large" />
          ) : (
            <>
              {/* Deck layer — shuffles on mount, fades out when draw is initiated */}
              <Animated.View style={[styles.stageLayer, { opacity: deckOpacity }]} pointerEvents={shuffleComplete ? 'none' : 'auto'}>
                <TarotDeck
                  shuffleOnMount
                  onShuffleComplete={handleShuffleComplete}
                  onDraw={handleDraw}
                />
              </Animated.View>

              {/* Card layer — fades in after shuffle, flips after draw completes */}
              <Animated.View style={[styles.stageLayer, { opacity: cardOpacity }]} pointerEvents={shuffleComplete ? 'auto' : 'none'}>
                <View>
                  <TarotCard
                    card={card ? toTarotCard(card) : undefined}
                    isFlipped={isFlipped}
                    orientation={orientation ?? 'upright'}
                    onPress={canDraw ? handleDraw : undefined}
                    style={[styles.card, canDraw && styles.cardTappable]}
                    accessibilityLabel={
                      isFlipped && card
                        ? `${card.name}, ${orientation === 'reversed' ? 'reversed' : 'upright'}`
                        : 'Tarot card, face down'
                    }
                    accessibilityHint={
                      canDraw ? 'Double-tap to draw your daily card' : undefined
                    }
                  />
                  {loading && (
                    <View style={styles.cardLoadingOverlay}>
                      <ActivityIndicator color="#c9a84c" />
                    </View>
                  )}
                </View>
              </Animated.View>
            </>
          )}
        </View>

        {canDraw && (
          <Text style={styles.tapHint} accessibilityElementsHidden>
            Tap to draw your card
          </Text>
        )}

        {deckError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorLabel}>Failed to load deck</Text>
            <Text style={styles.errorText}>{(deckError as Error).message}</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorLabel}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {card && orientation && (
          <CardDetail card={card} orientation={orientation} />
        )}

        {readingId && card && (
          <ReflectionSection
            reflection={reflection}
            onAdd={() => setReflectionSheetOpen(true)}
            onEdit={() => setReflectionSheetOpen(true)}
          />
        )}
      </ScrollView>

      <ReflectionSheet
        visible={reflectionSheetOpen}
        initialFeeling={reflection?.feeling ?? null}
        initialAlignment={reflection?.alignment ?? null}
        initialContent={reflection?.content ?? ''}
        isSaving={isReflectionSaving}
        onSave={handleReflectionSave}
        onClose={() => setReflectionSheetOpen(false)}
      />
    </View>
  );
}

// ── Card detail panel ─────────────────────────────────────────────────────────

function CardDetail({
  card,
  orientation,
}: {
  card: TarotCardRow;
  orientation: TarotCardOrientation;
}) {
  const isReversed = orientation === 'reversed';

  const summary = isReversed ? (card.reversed_summary ?? '') : (card.upright_summary ?? '');
  const meaning = isReversed ? (card.reversed_meaning_long ?? '') : (card.upright_meaning_long ?? '');
  const keywords = isReversed ? (card.keywords_reversed ?? []) : (card.keywords_upright ?? []);

  const { element, astrology_association: astrology, arcana, suit, number } = card;

  return (
    <View style={styles.resultBox}>
      {/* Orientation + meta row */}
      <View style={detailStyles.metaRow}>
        <Text style={[detailStyles.orientText, isReversed && detailStyles.orientReversed]}>
          {isReversed ? '↓ Reversed' : '↑ Upright'}
        </Text>
        {arcana && (
          <View style={detailStyles.pill}>
            <Text style={detailStyles.pillText}>
              {arcana === 'Major' ? 'Major Arcana' : (suit ?? 'Minor Arcana')}
              {number != null ? ` · ${number}` : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Element / astrology */}
      {(element || astrology) && (
        <View style={detailStyles.metaRow}>
          {element && (
            <View style={detailStyles.pill}>
              <Text style={detailStyles.pillText}>{element}</Text>
            </View>
          )}
          {astrology && (
            <View style={detailStyles.pill}>
              <Text style={detailStyles.pillText}>{astrology}</Text>
            </View>
          )}
        </View>
      )}

      {/* Summary */}
      {summary.length > 0 && (
        <Text style={detailStyles.summary}>{summary}</Text>
      )}

      {/* Keywords */}
      {keywords.length > 0 && (
        <View style={detailStyles.keywordsRow}>
          {keywords.map(kw => (
            <View key={kw} style={[detailStyles.keyword, isReversed && detailStyles.keywordReversed]}>
              <Text style={[detailStyles.keywordText, isReversed && detailStyles.keywordTextReversed]}>
                {kw}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Long meaning */}
      {meaning.length > 0 && (
        <Text style={detailStyles.meaning}>{meaning}</Text>
      )}
    </View>
  );
}

const detailStyles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  orientText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  orientReversed: { color: '#dc2626' },
  pill: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pillText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  summary: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  keyword: {
    backgroundColor: '#ede9fe',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  keywordReversed: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  keywordText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '600',
  },
  keywordTextReversed: { color: '#dc2626' },
  meaning: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 21,
  },
});

// ── Reflection section ────────────────────────────────────────────────────────

const SENTIMENT_ICON: Record<string, string> = {
  positive: '👍',
  neutral: '😐',
  negative: '👎',
};

function ReflectionSection({
  reflection,
  onAdd,
  onEdit,
}: {
  reflection: Reflection | null;
  onAdd: () => void;
  onEdit: () => void;
}) {
  if (!reflection) {
    return (
      <View style={reflectionStyles.addBox}>
        <Text style={reflectionStyles.addIcon}>🪞</Text>
        <Text style={reflectionStyles.addTitle}>Add a Reflection</Text>
        <Text style={reflectionStyles.addBody}>
          How did this reading land with you? Capture your thoughts while they're fresh.
        </Text>
        <TouchableOpacity
          style={reflectionStyles.addBtn}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add reflection"
        >
          <Text style={reflectionStyles.addBtnText}>Reflect on this Reading</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={reflectionStyles.viewBox}>
      <View style={reflectionStyles.viewHeader}>
        <Text style={reflectionStyles.viewLabel}>✦ Your Reflection</Text>
        <TouchableOpacity
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit reflection"
        >
          <Text style={reflectionStyles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={reflectionStyles.sentimentRow}>
        <View style={reflectionStyles.sentimentItem}>
          <Text style={reflectionStyles.sentimentCaption}>Feeling</Text>
          <Text style={reflectionStyles.sentimentIcon}>
            {reflection.feeling ? SENTIMENT_ICON[reflection.feeling] : '—'}
          </Text>
        </View>
        <View style={reflectionStyles.sentimentDivider} />
        <View style={reflectionStyles.sentimentItem}>
          <Text style={reflectionStyles.sentimentCaption}>Alignment</Text>
          <Text style={reflectionStyles.sentimentIcon}>
            {reflection.alignment ? SENTIMENT_ICON[reflection.alignment] : '—'}
          </Text>
        </View>
      </View>

      {reflection.content.length > 0 && (
        <Text style={reflectionStyles.viewContent}>{reflection.content}</Text>
      )}
    </View>
  );
}

const reflectionStyles = StyleSheet.create({
  addBox: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 8,
  },
  addIcon: { fontSize: 28, marginBottom: 4 },
  addTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  addBody: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  addBtn: {
    marginTop: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  viewBox: {
    marginTop: 16,
    backgroundColor: '#f5f3ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7c3aed',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  editLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ede9fe',
    overflow: 'hidden',
  },
  sentimentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  sentimentDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ede9fe',
  },
  sentimentCaption: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sentimentIcon: { fontSize: 22 },
  viewContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 21,
  },
});

/** Maps a raw Supabase tarot_cards row to the TarotCard display type. */
function toTarotCard(raw: TarotCardRow): TarotCardType {
  return {
    id: String(raw.id),
    name: raw.name,
    suit: (raw.suit ?? 'major') as TarotCardType['suit'],
    number: raw.number,
    imageUrl: raw.image_url ?? '',
    keywords: { upright: [], reversed: [] },
    meaning: { upright: '', reversed: '' },
  };
}

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return JSON.stringify(err);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  devBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  drawButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  drawButtonDisabled: {
    opacity: 0.5,
  },
  drawIcon: {
    fontSize: 28,
  },
  drawButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 20,
  },
  errorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 0,
  },
  stage: {
    height: 340,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  stageLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTappable: {
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.4,
  },
  cardLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 5, 32, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    fontSize: 13,
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
});
