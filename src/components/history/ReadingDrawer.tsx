import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  findNodeHandle,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ReadingRow } from '@hooks/useReadings';
import { useReflection } from '@hooks/useReflection';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { supabase } from '@lib/supabase/client';
import { DrawerCardSection } from './DrawerCardSection';
import { AIInsightSection } from '@components/tarot';
import { parseAIInsight } from '@/types/ai-insight';
import { spacing, borderRadius } from '@theme';
import { useAppTheme } from '@/hooks/useAppTheme';

const SENTIMENT_ICON: Record<string, string> = {
  positive: '👍',
  neutral: '😐',
  negative: '👎',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ReadingDrawerProps {
  reading: ReadingRow | null;
  onClose: () => void;
}

export function ReadingDrawer({ reading, onClose }: ReadingDrawerProps) {
  const { user } = useAuth();
  const { isPremium } = useSubscription(user?.id);
  const theme = useAppTheme();

  const [isVisible, setIsVisible] = useState(false);

  const slideY = useRef(new Animated.Value(900)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const dismissRef = useRef<() => void>(() => {});
  const sheetRef = useRef<View>(null);

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 900, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => {
      setIsVisible(false);
      onClose();
    });
  }, [onClose, slideY, backdropOpacity]);

  useEffect(() => {
    dismissRef.current = dismiss;
  });

  useEffect(() => {
    if (!reading) return;
    slideY.setValue(900);
    backdropOpacity.setValue(0);
    setIsVisible(true);
  }, [reading, slideY, backdropOpacity]);

  const handleShow = useCallback(() => {
    Animated.parallel([
      Animated.spring(slideY, {
        toValue: 0,
        damping: 50,
        stiffness: 380,
        mass: 1,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      const node = findNodeHandle(sheetRef.current);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    });
  }, [slideY, backdropOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) slideY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 110 || gs.vy > 0.7) {
          dismissRef.current();
        } else {
          Animated.spring(slideY, {
            toValue: 0,
            damping: 50,
            stiffness: 380,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const { reflection } = useReflection(reading?.id ?? null, user?.id ?? null);

  const [cardDetails, setCardDetails] = useState<Record<number, Record<string, unknown>>>({});
  useEffect(() => {
    if (!reading) return;
    setCardDetails({});
    const ids = reading.drawn_cards.map((c) => c.cardId);
    supabase
      .from('tarot_cards')
      .select('*')
      .in('id', ids)
      .then(({ data }) => {
        if (!data) return;
        const map: Record<number, Record<string, unknown>> = {};
        data.forEach((row) => { map[row.id] = row; });
        setCardDetails(map);
      });
  }, [reading]);

  if (!isVisible && !reading) return null;

  const isDaily = reading?.spread_type === 'daily';
  const cards = reading?.drawn_cards ?? [];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onShow={handleShow}
      onRequestClose={() => dismissRef.current()}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => dismissRef.current()}
          accessibilityRole="button"
          accessibilityLabel="Close drawer"
        >
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <Animated.View
          ref={sheetRef}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface.card,
              transform: [{ translateY: slideY }],
              ...theme.shadows.xl,
            },
          ]}
          accessibilityViewIsModal
          accessibilityRole="none"
        >
          {/* Drag handle */}
          <View
            {...panResponder.panHandlers}
            style={styles.handleZone}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Drag handle, swipe down to close"
            accessibilityHint="Swipe down to dismiss this drawer"
            hitSlop={{ top: 12, bottom: 12 }}
          >
            <View style={[styles.handle, { backgroundColor: theme.colors.border.default }]} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Header row */}
            {reading && (
              <View style={styles.sheetHeader}>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: isDaily
                        ? theme.colors.brand.purple[50]
                        : theme.colors.brand.cosmic.sky,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      {
                        color: isDaily
                          ? theme.colors.brand.purple[600]
                          : theme.colors.brand.cosmic.ocean,
                      },
                    ]}
                  >
                    {isDaily ? 'Daily Draw' : '3-Card Spread'}
                  </Text>
                </View>
                <Text style={[styles.sheetDate, { color: theme.colors.text.muted }]}>
                  {formatDate(reading.created_at)} · {formatTime(reading.created_at)}
                </Text>
              </View>
            )}

            {/* Cards */}
            {cards.map((card, i) => (
              <DrawerCardSection
                key={i}
                card={card}
                cardDetail={cardDetails[card.cardId] ?? null}
                showPosition={!isDaily}
                divider={i < cards.length - 1 || !!reading?.ai_insight || !!reflection}
              />
            ))}

            {/* AI insight */}
            <AIInsightSection
              insight={parseAIInsight(reading?.ai_insight ?? null)}
              isLoading={false}
              isPremium={isPremium || !!reading?.ai_insight}
            />

            {/* Reflection (read-only) */}
            {reflection && (
              <View
                style={[
                  styles.reflectionBox,
                  {
                    backgroundColor: theme.colors.brand.purple[50],
                    borderColor: theme.colors.brand.purple[200],
                  },
                ]}
              >
                <Text style={[styles.reflectionLabel, { color: theme.colors.brand.primaryDark }]}>
                  ✦ Your Reflection
                </Text>
                <View
                  style={[
                    styles.sentimentRow,
                    {
                      backgroundColor: theme.colors.surface.card,
                      borderColor: theme.colors.brand.purple[100],
                    },
                  ]}
                >
                  <View style={styles.sentimentItem}>
                    <Text style={[styles.sentimentCaption, { color: theme.colors.text.muted }]}>
                      Feeling
                    </Text>
                    <Text style={styles.sentimentIcon}>
                      {reflection.feeling ? SENTIMENT_ICON[reflection.feeling] : '—'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sentimentDivider,
                      { backgroundColor: theme.colors.brand.purple[100] },
                    ]}
                  />
                  <View style={styles.sentimentItem}>
                    <Text style={[styles.sentimentCaption, { color: theme.colors.text.muted }]}>
                      Alignment
                    </Text>
                    <Text style={styles.sentimentIcon}>
                      {reflection.alignment ? SENTIMENT_ICON[reflection.alignment] : '—'}
                    </Text>
                  </View>
                </View>
                {reflection.content.length > 0 && (
                  <Text style={[styles.reflectionContent, { color: theme.colors.text.secondary }]}>
                    {reflection.content}
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  sheet: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: '85%',
    overflow: 'hidden',
  },
  handleZone: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  scroll: { flexGrow: 0 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 44,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  typeBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  typeBadgeText: { fontSize: 12, fontWeight: '700' },
  sheetDate: { fontSize: 14, fontWeight: '500' },
  reflectionBox: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  reflectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  sentimentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: 4,
  },
  sentimentDivider: {
    width: 1,
    height: 30,
  },
  sentimentCaption: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sentimentIcon: { fontSize: 22 },
  reflectionContent: {
    fontSize: 14,
    lineHeight: 21,
  },
});
