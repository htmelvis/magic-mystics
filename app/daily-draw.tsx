import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
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
import { drawDailyCard, drawCard } from '@lib/tarot/draw';
import { getTodayBounds } from '@lib/tarot/date';
import type {
  DrawnCardRecord,
  TarotCardOrientation,
  TarotCard as TarotCardType,
  TarotCardRow,
} from '@/types/tarot';
import { TiltCard, TarotDeck, AIInsightSection } from '@components/tarot';
import { ANIMATION } from '@components/tarot/card-constants';
import { ReflectionSheet } from '@components/history';
import { useGenerateInsight } from '@hooks/useGenerateInsight';
import { useSubscription } from '@hooks/useSubscription';
import type { AIInsight } from '@/types/ai-insight';

export default function DrawScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
  const { cardIds, isLoading: deckLoading, error: deckError } = useTarotDeck();
  const invalidateReadings = useInvalidateReadings();
  const invalidateJourneyStats = useInvalidateJourneyStats();
  const { isPremium } = useSubscription(user?.id);
  const { mutate: generateInsight, isPending: isGeneratingInsight } = useGenerateInsight(user?.id);

  const [card, setCard] = useState<TarotCardRow | null>(null);
  const [orientation, setOrientation] = useState<TarotCardOrientation | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shuffleComplete, setShuffleComplete] = useState(false);
  const [insight, setInsight] = useState<AIInsight | null>(null);

  const [reflectionSheetOpen, setReflectionSheetOpen] = useState(false);
  const {
    reflection,
    isSaving: isReflectionSaving,
    save: saveReflection,
  } = useReflection(readingId, user?.id ?? null);

  const handleReflectionSave = useCallback(
    async (feeling: ReflectionSentiment, alignment: ReflectionSentiment, content: string) => {
      await saveReflection({ feeling, alignment, content });
      // sheet self-closes (free) or advances to step 4 (premium) — no explicit close here
    },
    [saveReflection]
  );

  const handleAddToJournal = useCallback(
    (reflectionContent: string) => {
      const shortDate = new Date().toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
      router.push({
        pathname: '/journal-entry',
        params: {
          seedTitle: card ? `${card.name} - ${shortDate}` : shortDate,
          seedReflection: reflectionContent,
          ...(readingId ? { readingId } : {}),
        },
      });
    },
    [router, readingId, card]
  );

  const deckOpacity = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!user || deckLoading) return;
    if (__DEV__) {
      setChecking(false);
      return;
    }
    loadTodaysReading();
  }, [user, deckLoading]);

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
    setInsight(null);

    try {
      const result = __DEV__ ? drawCard(cardIds) : drawDailyCard(cardIds, user.id);

      const { data: cardData, error: cardError } = await supabase
        .from('tarot_cards')
        .select('*')
        .eq('id', result.cardId)
        .single();

      if (cardError) throw cardError;

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
        .insert({ user_id: user.id, spread_type: 'daily', drawn_cards: drawnCards })
        .select('id')
        .single();

      if (insertError) throw insertError;

      setCard(cardData as TarotCardRow);
      setOrientation(result.orientation);
      setReadingId(reading.id);
      invalidateReadings(user.id);
      invalidateJourneyStats(user.id);
      if (isPremium) {
        generateInsight(reading.id, { onSuccess: setInsight });
      }
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
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      <View
        style={[
          styles.header,
          {
            // backgroundColor: theme.colors.surface.card,
            // borderBottomColor: theme.colors.border.main,
            zIndex: 99,
          },
        ]}
      >
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/draw'))}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backText, { color: theme.colors.brand.primary }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.topBarTitle, { color: theme.colors.text.primary }]}>Daily Card</Text>
        {__DEV__ && <Text style={styles.devBadge}>DEV</Text>}
      </View>

      <View style={{ flex: 1 }}>
        {/* Card stage pinned behind scroll content */}
        <View style={styles.pinnedStage}>
          {!isReady ? (
            <ActivityIndicator color={theme.colors.brand.primary} size="large" />
          ) : (
            <>
              <Animated.View
                style={[styles.stageLayer, { opacity: deckOpacity }]}
                pointerEvents={shuffleComplete ? 'none' : 'auto'}
              >
                <TarotDeck
                  shuffleOnMount
                  onShuffleComplete={handleShuffleComplete}
                  onDraw={handleDraw}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.stageLayer,
                  { opacity: cardOpacity, transform: [{ translateY: -28 }] },
                ]}
                pointerEvents={shuffleComplete ? 'auto' : 'none'}
              >
                <View>
                  <TiltCard
                    card={card ? toTarotCard(card) : undefined}
                    isFlipped={isFlipped}
                    tiltEnabled={isFlipped}
                    orientation={orientation ?? 'upright'}
                    onPress={canDraw ? handleDraw : undefined}
                    style={[
                      styles.card,
                      canDraw && { shadowColor: theme.colors.brand.primary, shadowOpacity: 0.4 },
                    ]}
                    accessibilityLabel={
                      isFlipped && card
                        ? `${card.name}, ${orientation === 'reversed' ? 'reversed' : 'upright'}`
                        : 'Tarot card, face down'
                    }
                    accessibilityHint={canDraw ? 'Double-tap to draw your daily card' : undefined}
                  />
                  {loading && (
                    <View style={styles.cardLoadingOverlay}>
                      <ActivityIndicator color={theme.colors.brand.accent} />
                    </View>
                  )}
                </View>
              </Animated.View>
            </>
          )}
          {/* {canDraw && (
            <Text
              style={[styles.tapHint, { color: theme.colors.text.muted }]}
              accessibilityElementsHidden
            >
              Tap to draw your card
            </Text>
          )} */}
        </View>

        <ScrollView
          style={[StyleSheet.absoluteFill, styles.scroll]}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={isFlipped}
          pointerEvents={isFlipped ? 'auto' : 'none'}
        >
          <View style={styles.cardSpacer} />

          {(deckError || error || (card && orientation)) && (
            <View
              style={[styles.contentSheet, { backgroundColor: theme.colors.surface.background }]}
            >
              {deckError && (
                <View
                  style={[
                    styles.errorBox,
                    {
                      backgroundColor: theme.colors.error.light,
                      borderColor: theme.colors.error.main,
                    },
                  ]}
                >
                  <Text style={[styles.errorLabel, { color: theme.colors.error.main }]}>
                    Failed to load deck
                  </Text>
                  <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
                    {(deckError as Error).message}
                  </Text>
                </View>
              )}

              {error && (
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
                    {error}
                  </Text>
                </View>
              )}

              {card && (
                <Text style={[styles.title, { color: theme.colors.text.primary }]}>
                  {card.name}
                </Text>
              )}

              {card && (
                <AIInsightSection
                  insight={insight}
                  isLoading={isGeneratingInsight}
                  isPremium={isPremium}
                />
              )}

              {card && orientation && <CardDetail card={card} orientation={orientation} />}
              {readingId && card && (
                <ReflectionSection
                  reflection={reflection}
                  onAdd={() => setReflectionSheetOpen(true)}
                  onEdit={() => setReflectionSheetOpen(true)}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <ReflectionSheet
        visible={reflectionSheetOpen}
        initialFeeling={reflection?.feeling ?? null}
        initialAlignment={reflection?.alignment ?? null}
        initialContent={reflection?.content ?? ''}
        isSaving={isReflectionSaving}
        onSave={handleReflectionSave}
        onClose={() => setReflectionSheetOpen(false)}
        onAddToJournal={isPremium ? handleAddToJournal : undefined}
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
  const theme = useAppTheme();
  const isReversed = orientation === 'reversed';

  const summary = isReversed ? (card.reversed_summary ?? '') : (card.upright_summary ?? '');
  const meaning = isReversed
    ? (card.reversed_meaning_long ?? '')
    : (card.upright_meaning_long ?? '');
  const keywords = isReversed ? (card.keywords_reversed ?? []) : (card.keywords_upright ?? []);
  const { element, astrology_association: astrology, arcana, suit, number, name } = card;

  return (
    <View
      style={[
        styles.resultBox,
        { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.main },
      ]}
    >
      <View style={detailStyles.metaRow}>
        {arcana && (
          <Text style={[detailStyles.arcanaText, { color: theme.colors.text.primary }]}>
            {arcana === 'Major'
              ? name
              : `${number != null ? `${number} of ` : ''}${suit ?? 'Minor Arcana'}`}
          </Text>
        )}
        <Text
          style={[detailStyles.orientText, { color: isReversed ? theme.colors.brand.primary : '' }]}
        >
          {isReversed ? '↓ Reversed' : null}
        </Text>
      </View>
      <View style={detailStyles.metaRow}></View>

      {(element || astrology) && (
        <View style={detailStyles.metaRow}>
          {element && (
            <View
              style={[
                detailStyles.pill,
                {
                  backgroundColor: theme.colors.surface.elevated,
                  borderColor: theme.colors.border.main,
                },
              ]}
            >
              <Text style={[detailStyles.pillText, { color: theme.colors.text.secondary }]}>
                {element}
              </Text>
            </View>
          )}
          {astrology && (
            <View
              style={[
                detailStyles.pill,
                {
                  backgroundColor: theme.colors.surface.elevated,
                  borderColor: theme.colors.border.main,
                },
              ]}
            >
              <Text style={[detailStyles.pillText, { color: theme.colors.text.secondary }]}>
                {astrology}
              </Text>
            </View>
          )}
        </View>
      )}

      {summary.length > 0 && (
        <Text style={[detailStyles.summary, { color: theme.colors.text.secondary }]}>
          {summary}
        </Text>
      )}

      {/* {keywords.length > 0 && (
        <View style={detailStyles.keywordsRow}>
          {keywords.map(kw => (
            <View
              key={kw}
              style={[
                detailStyles.keyword,
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
                  detailStyles.keywordText,
                  {
                    color: isReversed ? theme.colors.error.main : theme.colors.brand.primaryDark,
                  },
                ]}
              >
                {kw}
              </Text>
            </View>
          ))}
        </View>
      )} */}

      {meaning.length > 0 && (
        <Text style={[detailStyles.meaning, { color: theme.colors.text.secondary }]}>
          {meaning}
        </Text>
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
    marginBottom: 8,
  },
  orientText: { fontSize: 11, fontWeight: '400' },
  arcanaText: { fontSize: 14, fontWeight: '700' },
  pill: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  pillText: { fontSize: 12, fontWeight: '500' },
  summary: { fontSize: 12, lineHeight: 22, fontStyle: 'italic', marginBottom: 12 },
  keywordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  keyword: { borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10, borderWidth: 1 },
  keywordText: { fontSize: 12, fontWeight: '600' },
  meaning: { fontSize: 16, lineHeight: 23 },
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
          Add a Reflection
        </Text>
        <Text style={[reflectionStyles.addBody, { color: theme.colors.text.secondary }]}>
          How did this reading land with you? Capture your thoughts while they're fresh.
        </Text>
        <TouchableOpacity
          style={[reflectionStyles.addBtn, { backgroundColor: theme.colors.brand.primary }]}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add reflection"
        >
          <Text style={[reflectionStyles.addBtnText, { color: theme.colors.text.inverse }]}>
            Reflect on this Reading
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
  viewLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
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
  backText: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  topBarTitle: { fontSize: 12, fontWeight: '600', flex: 1, textAlign: 'center' },
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
  scroll: { backgroundColor: 'transparent' },
  scrollContent: { flexGrow: 1 },
  pinnedStage: {
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSpacer: { height: 344 },
  contentSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 12,
    paddingTop: 0,
    marginTop: 20,
    paddingBottom: 48,
    gap: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -6 },
    // shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    minHeight: 200,
  },
  errorBox: { borderRadius: 12, padding: 16, borderWidth: 1 },
  errorLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  errorText: { fontSize: 13, fontFamily: 'monospace' },
  resultBox: { borderRadius: 16, padding: 20, borderWidth: 1, gap: 0 },
  stageLayer: {
    ...StyleSheet.absoluteFillObject,
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
  cardLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 5, 32, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: { fontSize: 13, letterSpacing: 0.5, marginTop: 8 },
});
