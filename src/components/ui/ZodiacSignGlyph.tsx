import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';

const VS = '︎';

const SIGN_GLYPHS: Record<ZodiacSign, string> = {
  Aries: `♈${VS}`,
  Taurus: `♉${VS}`,
  Gemini: `♊${VS}`,
  Cancer: `♋${VS}`,
  Leo: `♌${VS}`,
  Virgo: `♍${VS}`,
  Libra: `♎${VS}`,
  Scorpio: `♏${VS}`,
  Sagittarius: `♐${VS}`,
  Capricorn: `♑${VS}`,
  Aquarius: `♒${VS}`,
  Pisces: `♓${VS}`,
};

const REVEAL_DURATION = 700;
const BREATHE_DELAY = 900;
const BREATHE_DURATION = 2800;

interface ZodiacSignGlyphProps {
  sign: ZodiacSign | null;
  size?: number;
  color?: string;
}

export function ZodiacSignGlyph({ sign, size = 100, color = '#8b5cf6' }: ZodiacSignGlyphProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.4);
  const breathe = useSharedValue(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!sign) return;

    opacity.value = withTiming(1, {
      duration: REVEAL_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    // Slight overshoot then settle
    scale.value = withSequence(
      withTiming(1.12, { duration: REVEAL_DURATION * 0.7, easing: Easing.out(Easing.cubic) }),
      withTiming(1.0, { duration: REVEAL_DURATION * 0.3, easing: Easing.in(Easing.cubic) }),
    );

    // Gentle breathing loop kicks in after reveal settles
    breathe.value = withDelay(
      BREATHE_DELAY,
      withRepeat(
        withSequence(
          withTiming(1.06, { duration: BREATHE_DURATION, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: BREATHE_DURATION, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, [sign]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * breathe.value }],
  }));

  if (!sign) return null;

  return (
    <Animated.Text style={[styles.glyph, { fontSize: size, color }, animStyle]}>
      {SIGN_GLYPHS[sign]}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  glyph: {
    textAlign: 'center',
  },
});
