import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { CardBackFace } from './TarotCard';
import {
  CARD,
  COLORS,
  ANIMATION,
  VISIBLE_DECK_SIZE,
  FAN_TARGETS,
  STACK_OFFSETS,
} from './card-constants';

interface TarotDeckProps {
  /** How many cards are left in the deck — shown as a label */
  cardCount?: number;
  /** Automatically trigger a shuffle after mount (with a short delay for nav transitions) */
  shuffleOnMount?: boolean;
  /** Called when the shuffle animation fully completes */
  onShuffleComplete?: () => void;
  onShuffle?: () => void;
  onDraw?: () => void;
}

/**
 * A stacked deck of face-down cards with a fan-out shuffle animation.
 *
 * Uses a single Animated.Value (phase 0→1→0) shared across all cards.
 * Each card interpolates its own translateX/Y and rotation from phase,
 * so the whole animation is driven by one Animated.timing sequence.
 */
export function TarotDeck({
  cardCount,
  shuffleOnMount,
  onShuffleComplete,
  onShuffle,
  onDraw,
}: TarotDeckProps) {
  const phase = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!shuffleOnMount) return;
    // Delay lets the navigation transition finish before the cards start moving
    const timer = setTimeout(() => handleShuffle(), 350);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleShuffle() {
    if (isAnimating.current) return;
    isAnimating.current = true;
    onShuffle?.();

    Animated.sequence([
      Animated.timing(phase, {
        toValue: 1,
        duration: ANIMATION.shuffleFan,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(phase, {
        toValue: 0,
        duration: ANIMATION.shuffleReturn,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isAnimating.current = false;
      onShuffleComplete?.();
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.deckArea}>
        {Array.from({ length: VISIBLE_DECK_SIZE }, (_, i) => (
          <DeckCard
            key={i}
            index={i}
            phase={phase}
            onPress={i === VISIBLE_DECK_SIZE - 1 ? onDraw : undefined}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <Pressable
          style={styles.button}
          onPress={handleShuffle}
          accessibilityRole="button"
          accessibilityLabel="Shuffle the deck"
        >
          <Text style={styles.buttonText}>Shuffle</Text>
        </Pressable>

        {onDraw && (
          <Pressable
            style={[styles.button, styles.drawButton]}
            onPress={onDraw}
            accessibilityRole="button"
            accessibilityLabel="Draw a card"
          >
            <Text style={styles.buttonText}>Draw</Text>
          </Pressable>
        )}
      </View>

      {cardCount !== undefined && (
        <Text style={styles.countLabel}>{cardCount} cards remaining</Text>
      )}
    </View>
  );
}

// ── Individual deck card ──────────────────────────────────────────────────────

interface DeckCardProps {
  index: number;
  phase: Animated.Value;
  onPress?: () => void;
}

function DeckCard({ index, phase, onPress }: DeckCardProps) {
  const stack = STACK_OFFSETS[index];
  const fan = FAN_TARGETS[index];

  const translateX = phase.interpolate({
    inputRange: [0, 1],
    outputRange: [stack.x, fan.x],
  });
  const translateY = phase.interpolate({
    inputRange: [0, 1],
    outputRange: [stack.y, fan.y],
  });
  const rotate = phase.interpolate({
    inputRange: [0, 1],
    outputRange: [`${stack.rotate}deg`, `${fan.rotate}deg`],
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { zIndex: index, transform: [{ translateX }, { translateY }, { rotate }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        style={styles.cardPressable}
        accessibilityRole="button"
        accessibilityLabel={`Deck card ${index + 1}`}
        accessibilityHint={onPress ? 'Double-tap to draw this card' : undefined}
      >
        <CardBackFace />
      </Pressable>
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 32,
  },
  deckArea: {
    width: CARD.width,
    height: CARD.height,
    marginHorizontal: 160,
  },
  cardWrapper: {
    position: 'absolute',
    width: CARD.width,
    height: CARD.height,
  },
  cardPressable: {
    width: CARD.width,
    height: CARD.height,
    borderRadius: CARD.borderRadius,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.back.borderOuter,
    backgroundColor: 'rgba(201, 168, 76, 0.08)',
  },
  drawButton: {
    backgroundColor: 'rgba(201, 168, 76, 0.18)',
  },
  buttonText: {
    color: COLORS.back.borderOuter,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  countLabel: {
    color: COLORS.front.textMuted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
