import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ReadingRow } from '@hooks/useReadings';
import { supabase } from '@lib/supabase/client';
import { DrawerCardSection } from './DrawerCardSection';
import { theme } from '@theme';

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
  // Keep the modal mounted through the close animation.
  // isVisible drives Modal.visible; reading is kept until the sheet is gone.
  const [isVisible, setIsVisible] = useState(false);

  const slideY = useRef(new Animated.Value(900)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Stable ref so PanResponder never captures a stale dismiss.
  const dismissRef = useRef<() => void>(() => {});

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideY, {
        toValue: 900,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onClose();
    });
  }, [onClose, slideY, backdropOpacity]);

  // Keep dismissRef current so PanResponder always calls the latest version.
  useEffect(() => {
    dismissRef.current = dismiss;
  });

  // Show the modal when a reading is selected.
  // Animation starts in onShow once native views are actually mounted.
  useEffect(() => {
    if (!reading) return;
    slideY.setValue(900);
    backdropOpacity.setValue(0);
    setIsVisible(true);
  }, [reading, slideY, backdropOpacity]);

  // Called by Modal after its content is mounted on the native side —
  // the only safe place to start a useNativeDriver animation.
  const handleShow = useCallback(() => {
    Animated.parallel([
      Animated.spring(slideY, {
        toValue: 0,
        damping: 50,
        stiffness: 380,
        mass: 1,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideY, backdropOpacity]);

  // Drag-to-dismiss — onStartShouldSetPanResponder:true so the handle zone
  // claims the gesture immediately instead of racing other views.
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

  // Fetch full tarot_cards rows for all cards in this reading.
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
        {/* Backdrop — covers only the area above the sheet */}
        <Pressable style={StyleSheet.absoluteFill} onPress={() => dismissRef.current()}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        {/* The sheet */}
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideY }] }]}
        >
          {/* Drag handle — full-width touch target */}
          <View {...panResponder.panHandlers} style={styles.handleZone}>
            <View style={styles.handle} />
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
                <View style={[styles.typeBadge, !isDaily && styles.typeBadgePPF]}>
                  <Text
                    style={[styles.typeBadgeText, !isDaily && styles.typeBadgeTextPPF]}
                  >
                    {isDaily ? 'Daily Draw' : '3-Card Spread'}
                  </Text>
                </View>
                <Text style={styles.sheetDate}>
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
                divider={i < cards.length - 1 || !!reading?.ai_insight}
              />
            ))}

            {/* AI insight */}
            {reading?.ai_insight && (
              <View style={styles.insightBox}>
                <Text style={styles.insightLabel}>✦ AI Insight</Text>
                <Text style={styles.insightBody}>{reading.ai_insight}</Text>
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
    backgroundColor: theme.colors.surface.card,
    borderTopLeftRadius: theme.radius['2xl'],
    borderTopRightRadius: theme.radius['2xl'],
    maxHeight: '85%',
    ...theme.shadows.xl,
    overflow: 'hidden',
  },
  handleZone: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: theme.colors.border.default,
    borderRadius: 2,
  },
  scroll: { flexGrow: 0 },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 44,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  typeBadge: {
    backgroundColor: theme.colors.brand.purple[50],
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  typeBadgePPF: { backgroundColor: theme.colors.brand.cosmic.sky },
  typeBadgeText: { 
    fontSize: theme.typography.fontSize.xs, 
    fontWeight: '700', 
    color: theme.colors.brand.purple[600] 
  },
  typeBadgeTextPPF: { color: theme.colors.brand.cosmic.ocean },
  sheetDate: { 
    fontSize: theme.typography.fontSize.sm, 
    color: theme.colors.text.muted, 
    fontWeight: '500' 
  },
  insightBox: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.tarot.insight.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.tarot.insight.border,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.tarot.insight.text,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  insightBody: { 
    fontSize: theme.typography.fontSize.base, 
    color: theme.colors.tarot.insight.text, 
    lineHeight: 23 
  },
});
