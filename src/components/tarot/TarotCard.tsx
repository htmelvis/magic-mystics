import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { TarotCard as TarotCardType, TarotCardOrientation } from '@/types/tarot';
import { CARD, COLORS, ANIMATION } from './card-constants';
import { useAppTheme } from '@/hooks/useAppTheme';

interface TarotCardProps {
  card?: TarotCardType;
  /** true = front (card face) visible, false = back visible */
  isFlipped: boolean;
  orientation?: TarotCardOrientation;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * A single tarot card with a 3D flip animation.
 *
 * Uses React Native's built-in Animated API with useNativeDriver so the
 * rotateY transform runs off the JS thread — no Reanimated required.
 *
 * Flip mechanic:
 *   flipAnim 0→1 drives two faces via interpolation:
 *   - Back:  rotateY  0° → -90°  (vanishes at midpoint)
 *   - Front: rotateY 90° →   0°  (appears at midpoint)
 */
export function TarotCard({
  card,
  isFlipped,
  orientation = 'upright',
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
}: TarotCardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      duration: ANIMATION.flip,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isFlipped, flipAnim]);

  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-90deg', '-90deg'],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.48, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['90deg', '90deg', '0deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.52, 1],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ??
        (isFlipped && card
          ? `${card.name}, ${orientation === 'reversed' ? 'reversed' : 'upright'}`
          : 'Tarot card, face down')
      }
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !onPress }}
    >
      {/* Back face */}
      <Animated.View
        style={[
          styles.face,
          {
            opacity: backOpacity,
            transform: [{ perspective: 1200 }, { rotateY: backRotateY }],
          },
        ]}
      >
        <CardBackFace />
      </Animated.View>

      {/* Front face — absolutely on top */}
      <Animated.View
        style={[
          styles.face,
          styles.frontAbsolute,
          {
            opacity: frontOpacity,
            transform: [
              { perspective: 1200 },
              { rotateY: frontRotateY },
              ...(orientation === 'reversed' ? [{ rotate: '180deg' }] : []),
            ],
          },
        ]}
      >
        <CardFrontFace card={card} />
      </Animated.View>
    </Pressable>
  );
}

// ── Card back ────────────────────────────────────────────────────────────────

export function CardBackFace() {
  return (
    <View style={back.card}>
      <View style={back.outerBorder}>
        <View style={back.innerBorder}>
          <View style={[back.corner, back.cornerTL]} />
          <View style={[back.corner, back.cornerTR]} />
          <View style={[back.corner, back.cornerBL]} />
          <View style={[back.corner, back.cornerBR]} />
          <View style={back.medallionOuter}>
            <View style={back.medallionInner}>
              <View style={back.axisH} />
              <View style={back.axisV} />
              <View style={back.centerDot} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Card front ───────────────────────────────────────────────────────────────

function CardFrontFace({ card }: { card?: TarotCardType }) {
  const theme = useAppTheme();

  if (!card) {
    return (
      <View
        style={[
          front.card,
          { backgroundColor: theme.colors.surface.elevated, borderColor: theme.colors.border.main },
        ]}
      >
        <Text style={[front.unknown, { color: theme.colors.text.secondary }]}>?</Text>
      </View>
    );
  }

  const symbol = SUIT_SYMBOLS[card.suit] ?? '';

  return (
    <View
      style={[
        front.card,
        { backgroundColor: theme.colors.surface.elevated, borderColor: theme.colors.border.main },
      ]}
    >
      <View style={front.cornerLabel}>
        <Text style={[front.suitSymbol, { color: COLORS.front.accentGold }]}>{symbol}</Text>
        {card.number !== null && (
          <Text style={[front.cornerNumber, { color: theme.colors.text.secondary }]}>
            {card.number}
          </Text>
        )}
      </View>

      <View style={front.center}>
        <Text style={front.suitLarge}>{symbol}</Text>
        <Text style={[front.cardName, { color: theme.colors.text.primary }]}>{card.name}</Text>
      </View>

      <View style={[front.cornerLabel, front.cornerLabelBottom]}>
        <Text style={[front.suitSymbol, { color: COLORS.front.accentGold }]}>{symbol}</Text>
        {card.number !== null && (
          <Text style={[front.cornerNumber, { color: theme.colors.text.secondary }]}>
            {card.number}
          </Text>
        )}
      </View>
    </View>
  );
}

const SUIT_SYMBOLS: Record<string, string> = {
  major: '★',
  wands: '🔥',
  cups: '🌊',
  swords: '⚔',
  pentacles: '⬡',
};

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: CARD.width,
    height: CARD.height,
  },
  face: {
    width: CARD.width,
    height: CARD.height,
    borderRadius: CARD.borderRadius,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  frontAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

const back = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.back.bg,
    borderRadius: CARD.borderRadius,
    padding: 8,
  },
  outerBorder: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.back.borderOuter,
    borderRadius: 8,
    padding: 6,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.back.borderInner,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
  },
  cornerTL: {
    top: 6,
    left: 6,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: COLORS.back.ornament,
  },
  cornerTR: {
    top: 6,
    right: 6,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: COLORS.back.ornament,
  },
  cornerBL: {
    bottom: 6,
    left: 6,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: COLORS.back.ornament,
  },
  cornerBR: {
    bottom: 6,
    right: 6,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: COLORS.back.ornament,
  },
  medallionOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: COLORS.back.ornament,
    backgroundColor: COLORS.back.centerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medallionInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.back.borderInner,
    alignItems: 'center',
    justifyContent: 'center',
  },
  axisH: {
    position: 'absolute',
    width: 34,
    height: 1,
    backgroundColor: COLORS.back.borderInner,
  },
  axisV: {
    position: 'absolute',
    width: 1,
    height: 34,
    backgroundColor: COLORS.back.borderInner,
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.back.ornament,
  },
});

const front = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: CARD.borderRadius,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  cornerLabel: {
    alignItems: 'flex-start',
  },
  cornerLabelBottom: {
    alignItems: 'flex-end',
    transform: [{ rotate: '180deg' }],
  },
  suitSymbol: {
    fontSize: 14,
  },
  cornerNumber: {
    fontSize: 11,
    marginTop: 1,
  },
  center: {
    alignItems: 'center',
    gap: 8,
  },
  suitLarge: {
    fontSize: 32,
  },
  cardName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  unknown: {
    fontSize: 40,
    textAlign: 'center',
  },
});
