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
  TouchableOpacity,
  type ScrollView as ScrollViewType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useTarotDeck } from '@hooks/useTarotDeck';
import { useInvalidateReadings } from '@hooks/useReadings';
import { useInvalidateJourneyStats } from '@hooks/useJourneyStats';
import { useReflection } from '@hooks/useReflection';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { Reflection, ReflectionSentiment } from '@hooks/useReflection';
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
import { ReflectionSheet } from '@components/history';

const POSITIONS = ['past', 'present', 'future'] as const;
const POSITION_LABELS = ['Past', 'Present', 'Future'];

type Phase = 'shuffle' | 'reading';

export default function PPFScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
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
  const [readingId, setReadingId] = useState<string | null>(null);
  const [reflectionSheetOpen, setReflectionSheetOpen] = useState(false);

  const {
    reflection,
    isSaving: isReflectionSaving,
    save: saveReflection,
  } = useReflection(readingId, user?.id ?? null);

  const handleReflectionSave = useCallback(
    async (feeling: ReflectionSentiment, alignment: ReflectionSentiment, content: string) => {
      await saveReflection({ feeling, alignment, content });
      setReflectionSheetOpen(false);
    },
    [saveReflection]
  );

  const deckOpacity = useRef(new Animated.Value(1)).current;
  const carouselOpacity = useRef(new Animated.Value(0)).current;
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollViewType>(null);
  const hasDrawn = useRef(false);

  useEffect(() => {
    if (phase !== 'reading') return;

    flipTimer.current = setTimeout(() => {
      setFlipped(prev => {
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

  const drawAndSave = useCallback(async () => {
    const results = drawSpread(cardIds, 3);

    const responses = await Promise.all(
      results.map(r => supabase.from('tarot_cards').select('*').eq('id', r.cardId).single())
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

    const { data: reading, error: insertError } = await supabase
      .from('readings')
      .insert({
        user_id: user!.id,
        spread_type: 'past-present-future',
        drawn_cards: drawnCards,
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    setCards(fetchedCards);
    setOrientations(results.map(r => r.orientation));
    setReadingId(reading.id);
    invalidateReadings(user!.id);
    invalidateJourneyStats(user!.id);
  }, [user, cardIds, invalidateReadings, invalidateJourneyStats]);

  const handleShuffleComplete = useCallback(async () => {
    if (hasDrawn.current) return;
    hasDrawn.current = true;
    setError(null);

    const fadeOut = new Promise<void>(resolve => {
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
      hasDrawn.current = false;
      setError(extractMessage(err));
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
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface.card,
            borderBottomColor: theme.colors.border.main,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backText, { color: theme.colors.brand.primary }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Past · Present · Future
        </Text>
      </View>

      {phase === 'reading' && (
        <View
          style={[
            styles.progressRow,
            {
              backgroundColor: theme.colors.surface.card,
              borderBottomColor: theme.colors.border.main,
            },
          ]}
        >
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
                  { backgroundColor: theme.colors.border.main },
                  i === activeIndex && {
                    backgroundColor: theme.colors.brand.primary,
                    transform: [{ scale: 1.3 }],
                  },
                  flipped[i] &&
                    i !== activeIndex && {
                      backgroundColor: theme.colors.brand.secondary,
                    },
                ]}
              />
              <Text
                style={[
                  styles.progressLabel,
                  { color: theme.colors.text.muted },
                  i === activeIndex && { color: theme.colors.brand.primary },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.main}>
        {(deckLoading || !cardIds.length) && !error && !deckError && (
          <ActivityIndicator color={theme.colors.brand.primary} size="large" />
        )}

        {(error ?? deckError) && (
          <View
            style={[
              styles.errorBox,
              {
                backgroundColor: theme.colors.error.light,
                borderColor: theme.colors.error.main,
              },
            ]}
          >
            <Text style={[styles.errorLabel, { color: theme.colors.error.main }]}>Error</Text>
            <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
              {error ?? (deckError as Error | null)?.message ?? 'Failed to load deck'}
            </Text>
          </View>
        )}

        {!deckLoading && !!cardIds.length && !!user && (
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.deckLayer, { opacity: deckOpacity }]}
            pointerEvents={phase === 'shuffle' ? 'auto' : 'none'}
          >
            <TarotDeck shuffleOnMount onShuffleComplete={handleShuffleComplete} />
          </Animated.View>
        )}

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
                  reflection={i === 2 ? reflection : undefined}
                  onAddReflection={i === 2 ? () => setReflectionSheetOpen(true) : undefined}
                  onEditReflection={i === 2 ? () => setReflectionSheetOpen(true) : undefined}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

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

// ── Card page ─────────────────────────────────────────────────────────────────

interface CardPageProps {
  card: TarotCardRow;
  orientation: TarotCardOrientation;
  positionLabel: string;
  isFlipped: boolean;
  isActive: boolean;
  isLast: boolean;
  screenWidth: number;
  reflection?: Reflection | null;
  onAddReflection?: () => void;
  onEditReflection?: () => void;
}

function CardPage({
  card,
  orientation,
  positionLabel,
  isFlipped,
  isActive,
  isLast,
  screenWidth,
  reflection,
  onAddReflection,
  onEditReflection,
}: CardPageProps) {
  const theme = useAppTheme();
  const detailOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isFlipped) return;
    Animated.timing(detailOpacity, {
      toValue: 1,
      duration: 400,
      delay: Math.round(ANIMATION.flip * 0.55),
      useNativeDriver: true,
    }).start();
  }, [isFlipped]); // eslint-disable-line react-hooks/exhaustive-deps

  const isReversed = orientation === 'reversed';
  const summary = isReversed ? (card.reversed_summary ?? '') : (card.upright_summary ?? '');
  const meaning = isReversed
    ? (card.reversed_meaning_long ?? '')
    : (card.upright_meaning_long ?? '');
  const keywords = isReversed ? (card.keywords_reversed ?? []) : (card.keywords_upright ?? []);
  const nextLabel = positionLabel === 'Past' ? 'Present' : 'Future';

  return (
    <ScrollView
      style={{ width: screenWidth }}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.positionLabel, { color: theme.colors.brand.primary }]}>
        {positionLabel}
      </Text>

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

      {isFlipped && (
        <Animated.View
          style={[
            styles.detailCard,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: theme.colors.border.main,
            },
            { opacity: detailOpacity },
          ]}
        >
          <View style={styles.nameRow}>
            <Text style={[styles.cardName, { color: theme.colors.text.primary }]}>{card.name}</Text>
            <Text
              style={[
                styles.orientBadge,
                {
                  color: isReversed ? theme.colors.error.main : theme.colors.brand.primary,
                },
              ]}
            >
              {isReversed ? '↓ Reversed' : '↑ Upright'}
            </Text>
          </View>

          <View style={styles.metaRow}>
            {card.arcana && (
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: theme.colors.surface.elevated,
                    borderColor: theme.colors.border.main,
                  },
                ]}
              >
                <Text style={[styles.pillText, { color: theme.colors.text.secondary }]}>
                  {card.arcana === 'Major' ? 'Major Arcana' : (card.suit ?? 'Minor Arcana')}
                  {card.number != null ? ` · ${card.number}` : ''}
                </Text>
              </View>
            )}
            {card.element && (
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: theme.colors.surface.elevated,
                    borderColor: theme.colors.border.main,
                  },
                ]}
              >
                <Text style={[styles.pillText, { color: theme.colors.text.secondary }]}>
                  {card.element}
                </Text>
              </View>
            )}
            {card.astrology_association && (
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: theme.colors.surface.elevated,
                    borderColor: theme.colors.border.main,
                  },
                ]}
              >
                <Text style={[styles.pillText, { color: theme.colors.text.secondary }]}>
                  {card.astrology_association}
                </Text>
              </View>
            )}
          </View>

          {summary.length > 0 && (
            <Text style={[styles.summary, { color: theme.colors.text.secondary }]}>{summary}</Text>
          )}

          {keywords.length > 0 && (
            <View style={styles.keywordsRow}>
              {keywords.map(kw => (
                <View
                  key={kw}
                  style={[
                    styles.keyword,
                    isReversed
                      ? {
                          backgroundColor: theme.colors.error.light,
                          borderColor: theme.colors.error.main,
                        }
                      : {
                          backgroundColor: theme.colors.brand.purple[100],
                          borderColor: theme.colors.brand.purple[200],
                        },
                  ]}
                >
                  <Text
                    style={[
                      styles.keywordText,
                      {
                        color: isReversed
                          ? theme.colors.error.main
                          : theme.colors.brand.primaryDark,
                      },
                    ]}
                  >
                    {kw}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {meaning.length > 0 && (
            <Text style={[styles.meaning, { color: theme.colors.text.secondary }]}>{meaning}</Text>
          )}

          {isActive && !isLast && (
            <Text
              style={[
                styles.swipeHint,
                {
                  color: theme.colors.text.muted,
                  borderTopColor: theme.colors.border.light,
                },
              ]}
            >
              Swipe left for {nextLabel} →
            </Text>
          )}

          {isLast && onAddReflection && onEditReflection && (
            <ReflectionSection
              reflection={reflection ?? null}
              onAdd={onAddReflection}
              onEdit={onEditReflection}
            />
          )}
        </Animated.View>
      )}
    </ScrollView>
  );
}

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
  const theme = useAppTheme();

  if (!reflection) {
    return (
      <View
        style={[
          reflectionStyles.addBox,
          {
            backgroundColor: theme.colors.surface.card,
            borderColor: theme.colors.border.main,
          },
        ]}
      >
        <Text style={reflectionStyles.addIcon}>🪞</Text>
        <Text style={[reflectionStyles.addTitle, { color: theme.colors.text.primary }]}>
          Reflect on this Spread
        </Text>
        <Text style={[reflectionStyles.addBody, { color: theme.colors.text.secondary }]}>
          How did these three cards land? Capture your thoughts while they're fresh.
        </Text>
        <TouchableOpacity
          style={[reflectionStyles.addBtn, { backgroundColor: theme.colors.brand.primary }]}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add reflection"
        >
          <Text style={[reflectionStyles.addBtnText, { color: theme.colors.text.inverse }]}>
            Add a Reflection
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        reflectionStyles.viewBox,
        {
          backgroundColor: theme.colors.brand.purple[50],
          borderColor: theme.colors.brand.purple[200],
        },
      ]}
    >
      <View style={reflectionStyles.viewHeader}>
        <Text style={[reflectionStyles.viewLabel, { color: theme.colors.brand.primaryDark }]}>
          ✦ Your Reflection
        </Text>
        <TouchableOpacity
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit reflection"
        >
          <Text style={[reflectionStyles.editLink, { color: theme.colors.brand.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          reflectionStyles.sentimentRow,
          {
            backgroundColor: theme.colors.surface.card,
            borderColor: theme.colors.brand.purple[100],
          },
        ]}
      >
        <View style={reflectionStyles.sentimentItem}>
          <Text style={[reflectionStyles.sentimentCaption, { color: theme.colors.text.muted }]}>
            Feeling
          </Text>
          <Text style={reflectionStyles.sentimentIcon}>
            {reflection.feeling ? SENTIMENT_ICON[reflection.feeling] : '—'}
          </Text>
        </View>
        <View
          style={[
            reflectionStyles.sentimentDivider,
            { backgroundColor: theme.colors.brand.purple[100] },
          ]}
        />
        <View style={reflectionStyles.sentimentItem}>
          <Text style={[reflectionStyles.sentimentCaption, { color: theme.colors.text.muted }]}>
            Alignment
          </Text>
          <Text style={reflectionStyles.sentimentIcon}>
            {reflection.alignment ? SENTIMENT_ICON[reflection.alignment] : '—'}
          </Text>
        </View>
      </View>

      {reflection.content.length > 0 && (
        <Text style={[reflectionStyles.viewContent, { color: theme.colors.text.secondary }]}>
          {reflection.content}
        </Text>
      )}
    </View>
  );
}

const reflectionStyles = StyleSheet.create({
  addBox: {
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  addIcon: { fontSize: 28, marginBottom: 4 },
  addTitle: { fontSize: 16, fontWeight: '700' },
  addBody: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 4 },
  addBtn: { marginTop: 8, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  addBtnText: { fontWeight: '700', fontSize: 15 },
  viewBox: { marginTop: 16, borderRadius: 16, padding: 20, borderWidth: 1 },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  editLink: { fontSize: 13, fontWeight: '600' },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sentimentItem: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 4 },
  sentimentDivider: { width: 1, height: 30 },
  sentimentCaption: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sentimentIcon: { fontSize: 22 },
  viewContent: { fontSize: 14, lineHeight: 21 },
});

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
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  backText: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  progressItem: { alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  progressLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  deckLayer: { alignItems: 'center', justifyContent: 'center' },
  pageContent: { padding: 24, paddingBottom: 48, alignItems: 'center' },
  positionLabel: {
    fontSize: 11,
    fontWeight: '700',
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
  card: {
    width: 240,
    height: 400,
    borderRadius: 16,
  },
  detailCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  cardName: { fontSize: 20, fontWeight: 'bold' },
  orientBadge: { fontSize: 13, fontWeight: '700' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  pill: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 10, borderWidth: 1 },
  pillText: { fontSize: 12, fontWeight: '500' },
  summary: { fontSize: 15, lineHeight: 22, fontStyle: 'italic', marginBottom: 12 },
  keywordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  keyword: { borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10, borderWidth: 1 },
  keywordText: { fontSize: 12, fontWeight: '600' },
  meaning: { fontSize: 14, lineHeight: 21 },
  swipeHint: {
    fontSize: 13,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  errorBox: { borderRadius: 12, padding: 16, borderWidth: 1, margin: 20 },
  errorLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  errorText: { fontSize: 13, fontFamily: 'monospace' },
});
