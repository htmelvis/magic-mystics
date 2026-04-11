import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  type ScrollView as ScrollViewType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useTarotDeck } from '@hooks/useTarotDeck';
import { useInvalidateReadings } from '@hooks/useReadings';
import { useInvalidateJourneyStats } from '@hooks/useJourneyStats';
import { supabase } from '@lib/supabase/client';
import { drawSpread } from '@lib/tarot/draw';
import type {
  DrawnCardRecord,
  TarotCardOrientation,
  TarotCard as TarotCardType,
  TarotCardRow,
} from '@/types/tarot';
import { TarotCard, TarotDeck } from '@components/tarot';
import { ANIMATION } from '@components/tarot/card-constants';

const POSITIONS = ['past', 'present', 'future'] as const;
const POSITION_LABELS = ['Past', 'Present', 'Future'];

type Phase = 'shuffle' | 'reading';

export default function PPFScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const { cardIds, isLoading: deckLoading, error: deckError } = useTarotDeck();
  const invalidateReadings = useInvalidateReadings();
  const invalidateJourneyStats = useInvalidateJourneyStats();

  const [phase, setPhase] = useState<Phase>('shuffle');
  const [cards, setCards] = useState<TarotCardRow[]>([]);
  const [orientations, setOrientations] = useState<TarotCardOrientation[]>([]);
  const [flipped, setFlipped] = useState([false, false, false]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const deckOpacity = useRef(new Animated.Value(1)).current;
  const carouselOpacity = useRef(new Animated.Value(0)).current;
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollViewType>(null);

  // Auto-flip the active card after arriving on it (reading phase only)
  useEffect(() => {
    if (phase !== 'reading') return;

    flipTimer.current = setTimeout(() => {
      setFlipped((prev) => {
        if (prev[activeIndex]) return prev;
        const next = [...prev];
        next[activeIndex] = true;
        return next;
      });
    }, 600);

    return () => {
      if (flipTimer.current) clearTimeout(flipTimer.current);
    };
  }, [activeIndex, phase]);

  // Fetches card data, saves the reading, and updates local state.
  // Does not drive any phase transitions — the caller owns that.
  const drawAndSave = useCallback(async () => {
    const results = drawSpread(cardIds, 3);

    const responses = await Promise.all(
      results.map((r) =>
        supabase.from('tarot_cards').select('*').eq('id', r.cardId).single()
      )
    );

    const fetchedCards: TarotCardRow[] = responses.map(({ data, error: e }) => {
      if (e) throw e;
      return data as TarotCardRow;
    });

    const drawnCards: DrawnCardRecord[] = results.map((r, i) => ({
      cardId: r.cardId as number,
      cardName: fetchedCards[i].name,
      arcana: fetchedCards[i].arcana as DrawnCardRecord['arcana'],
      suit: (fetchedCards[i].suit ?? null) as DrawnCardRecord['suit'],
      orientation: r.orientation,
      position: POSITIONS[i],
    }));

    const { error: insertError } = await supabase.from('readings').insert({
      user_id: user!.id,
      spread_type: 'past-present-future',
      drawn_cards: drawnCards,
    });

    if (insertError) throw insertError;

    setCards(fetchedCards);
    setOrientations(results.map((r) => r.orientation));
    invalidateReadings(user!.id);
    invalidateJourneyStats(user!.id);
  }, [user, cardIds, invalidateReadings, invalidateJourneyStats]);

  // Called once by TarotDeck's animation sequence — never by a reactive effect.
  // Fades the deck out and draws cards in parallel so the network round-trip
  // is hidden behind the ~300ms fade animation.
  const handleShuffleComplete = useCallback(async () => {
    setError(null);

    const fadeOut = new Promise<void>((resolve) => {
      Animated.timing(deckOpacity, {
        toValue: 0,
        duration: ANIMATION.deckFadeOut,
        useNativeDriver: true,
      }).start(() => resolve());
    });

    try {
      await Promise.all([fadeOut, drawAndSave()]);
      setPhase('reading');
      Animated.timing(carouselOpacity, {
        toValue: 1,
        duration: ANIMATION.cardFadeIn,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError(extractMessage(err));
      // Fade the deck back in so the error is visible and the user can retry
      Animated.timing(deckOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [drawAndSave, deckOpacity, carouselOpacity]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

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
        <Text style={styles.title}>Past · Present · Future</Text>
      </View>

      {/* Progress indicator — only shown during the reading phase */}
      {phase === 'reading' && (
        <View style={styles.progressRow}>
          {POSITION_LABELS.map((label, i) => (
            <Pressable
              key={i}
              style={styles.progressItem}
              onPress={() => {
                scrollRef.current?.scrollTo({ x: i * screenWidth, animated: true });
                setActiveIndex(i);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Go to ${label} card`}
              accessibilityState={{ selected: i === activeIndex }}
            >
              <View
                style={[
                  styles.dot,
                  i === activeIndex && styles.dotActive,
                  flipped[i] && i !== activeIndex && styles.dotRevealed,
                ]}
              />
              <Text
                style={[
                  styles.progressLabel,
                  i === activeIndex && styles.progressLabelActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.main}>
        {/* Deck not ready yet */}
        {(deckLoading || !cardIds.length) && !error && !deckError && (
          <ActivityIndicator color="#8b5cf6" size="large" />
        )}

        {/* Errors */}
        {(error ?? deckError) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorLabel}>Error</Text>
            <Text style={styles.errorText}>
              {error ?? (deckError as Error | null)?.message ?? 'Failed to load deck'}
            </Text>
          </View>
        )}

        {/* Deck shuffle layer — rendered once deck is ready, fades out after draw */}
        {!deckLoading && !!cardIds.length && (
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.deckLayer, { opacity: deckOpacity }]}
            pointerEvents={phase === 'shuffle' ? 'auto' : 'none'}
          >
            <TarotDeck shuffleOnMount onShuffleComplete={handleShuffleComplete} />
          </Animated.View>
        )}

        {/* Card carousel — fades in after deck fades out */}
        {phase === 'reading' && (
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: carouselOpacity }]}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScrollEnd}
              scrollEventThrottle={16}
              decelerationRate="fast"
            >
              {cards.map((card, i) => (
                <CardPage
                  key={i}
                  card={card}
                  orientation={orientations[i]}
                  positionLabel={POSITION_LABELS[i]}
                  isFlipped={flipped[i]}
                  isActive={i === activeIndex}
                  isLast={i === 2}
                  screenWidth={screenWidth}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

// ── Card page ─────────────────────────────────────────────────────────────────

interface CardPageProps {
  card: TarotCardRow;
  orientation: TarotCardOrientation;
  positionLabel: string;
  isFlipped: boolean;
  isActive: boolean;
  isLast: boolean;
  screenWidth: number;
}

function CardPage({
  card,
  orientation,
  positionLabel,
  isFlipped,
  isActive,
  isLast,
  screenWidth,
}: CardPageProps) {
  const detailOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isFlipped) return;
    Animated.timing(detailOpacity, {
      toValue: 1,
      duration: 400,
      // Start fading in as the card hits the midpoint of its flip
      delay: Math.round(ANIMATION.flip * 0.55),
      useNativeDriver: true,
    }).start();
  }, [isFlipped]); // eslint-disable-line react-hooks/exhaustive-deps

  const isReversed = orientation === 'reversed';
  const summary = isReversed ? (card.reversed_summary ?? '') : (card.upright_summary ?? '');
  const meaning = isReversed ? (card.reversed_meaning_long ?? '') : (card.upright_meaning_long ?? '');
  const keywords = isReversed ? (card.keywords_reversed ?? []) : (card.keywords_upright ?? []);

  const nextLabel = positionLabel === 'Past' ? 'Present' : 'Future';

  return (
    <ScrollView
      style={{ width: screenWidth }}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Position label */}
      <Text style={styles.positionLabel}>{positionLabel}</Text>

      {/* Card */}
      <View style={styles.cardContainer}>
        <TarotCard
          card={toTarotCard(card)}
          isFlipped={isFlipped}
          orientation={orientation}
          style={styles.card}
          accessibilityLabel={
            isFlipped
              ? `${card.name}, ${orientation}, ${positionLabel}`
              : `${positionLabel} card, face down`
          }
        />
      </View>

      {/* Revealed content fades in after the flip */}
      {isFlipped && (
        <Animated.View style={[styles.detailCard, { opacity: detailOpacity }]}>
          {/* Card name + orientation badge */}
          <View style={styles.nameRow}>
            <Text style={styles.cardName}>{card.name}</Text>
            <Text style={[styles.orientBadge, isReversed && styles.orientBadgeReversed]}>
              {isReversed ? '↓ Reversed' : '↑ Upright'}
            </Text>
          </View>

          {/* Meta pills */}
          <View style={styles.metaRow}>
            {card.arcana && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  {card.arcana === 'Major'
                    ? 'Major Arcana'
                    : (card.suit ?? 'Minor Arcana')}
                  {card.number != null ? ` · ${card.number}` : ''}
                </Text>
              </View>
            )}
            {card.element && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>{card.element}</Text>
              </View>
            )}
            {card.astrology_association && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>{card.astrology_association}</Text>
              </View>
            )}
          </View>

          {/* Summary */}
          {summary.length > 0 && <Text style={styles.summary}>{summary}</Text>}

          {/* Keywords */}
          {keywords.length > 0 && (
            <View style={styles.keywordsRow}>
              {keywords.map((kw) => (
                <View key={kw} style={[styles.keyword, isReversed && styles.keywordReversed]}>
                  <Text style={[styles.keywordText, isReversed && styles.keywordTextReversed]}>
                    {kw}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Long meaning */}
          {meaning.length > 0 && <Text style={styles.meaning}>{meaning}</Text>}

          {/* Swipe hint — only on the active, non-last card once it's revealed */}
          {isActive && !isLast && (
            <Text style={styles.swipeHint}>Swipe left for {nextLabel} →</Text>
          )}
        </Animated.View>
      )}
    </ScrollView>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Styles ────────────────────────────────────────────────────────────────────

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
  backButton: { padding: 4 },
  backText: {
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressItem: {
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  dotActive: {
    backgroundColor: '#8b5cf6',
    transform: [{ scale: 1.3 }],
  },
  dotRevealed: {
    backgroundColor: '#c4b5fd',
  },
  progressLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressLabelActive: {
    color: '#8b5cf6',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckLayer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Per-page layout (vertical scroll within each horizontal page)
  pageContent: {
    padding: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  positionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8b5cf6',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 20,
    marginTop: 8,
  },
  cardContainer: {
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {},
  // Detail card below the flipped card
  detailCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  orientBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  orientBadgeReversed: {
    color: '#dc2626',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
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
  keywordTextReversed: {
    color: '#dc2626',
  },
  meaning: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 21,
  },
  swipeHint: {
    fontSize: 13,
    color: '#9ca3af',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fca5a5',
    margin: 20,
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
});
