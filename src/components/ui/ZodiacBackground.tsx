import { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Appending U+FE0E forces monochrome text-style rendering instead of the emoji variant
const VS = '︎';

const GLYPHS = [
  // Zodiac signs
  `♈${VS}`,
  `♉${VS}`,
  `♊${VS}`,
  `♋${VS}`,
  `♌${VS}`,
  `♍${VS}`,
  `♎${VS}`,
  `♏${VS}`,
  `♐${VS}`,
  `♑${VS}`,
  `♒${VS}`,
  `♓${VS}`,
  // Planets
  `☉${VS}`,
  `☿${VS}`,
  `♀${VS}`,
  `♂${VS}`,
  `♃${VS}`,
  `♅${VS}`,
  `♆${VS}`,
  `⚳${VS}`,
  `⚷${VS}`,
];

// [left%, top%, scale, rotationDeg, shimmerDelayMs]
const LAYOUT: [number, number, number, number, number][] = [
  [0.04, 0.04, 1.3, -12, 0],
  [0.7, 0.03, 1.0, 8, 700],
  [0.4, 0.09, 0.85, 3, 1500],
  [0.86, 0.15, 1.2, -6, 300],
  [0.18, 0.2, 0.95, 14, 2200],
  [0.58, 0.25, 1.25, -9, 1100],
  [0.08, 0.36, 1.05, 10, 3000],
  [0.78, 0.38, 0.8, -18, 1900],
  [0.32, 0.44, 1.15, 5, 600],
  [0.88, 0.53, 0.9, -4, 2700],
  [0.12, 0.57, 1.1, 7, 1400],
  [0.52, 0.61, 0.85, -11, 3500],
  [0.74, 0.66, 1.3, 2, 800],
  [0.24, 0.7, 1.0, -8, 2000],
  [0.62, 0.75, 0.9, 16, 400],
  [0.04, 0.8, 1.2, -5, 2900],
  [0.42, 0.83, 0.8, 9, 1700],
  [0.84, 0.81, 1.05, -13, 3200],
  [0.2, 0.89, 0.95, 4, 500],
  [0.6, 0.91, 1.15, -7, 2500],
  [0.78, 0.94, 0.85, 11, 1300],
];

const SHIMMER_DURATION = 4200;
const FADE_IN_DURATION = 1200;

// X and Y use different periods so they drift in and out of phase, creating
// Lissajous-style paths that never perfectly repeat — each glyph traces a
// unique, slowly evolving ellipse rather than a fixed loop.
function orbitParamsForIndex(i: number) {
  const rx = 6 + (i % 5) * 3;
  const ry = 4 + (i % 4) * 2;
  const tx = 9000 + (i % 6) * 1500;
  const ty = Math.round(tx * 1.3);
  return { rx, ry, tx, ty };
}

function ZodiacGlyph({
  glyph,
  left,
  top,
  scale,
  rotation,
  delay,
  index,
}: {
  glyph: string;
  left: number;
  top: number;
  scale: number;
  rotation: number;
  delay: number;
  index: number;
}) {
  // opacity starts at 0 so glyphs are invisible during their stagger delay —
  // prevents the "stationary glyph before orbit starts" flash.
  const opacity = useSharedValue(0);

  // scaleVal is initialised at the base scale so the worklet reads it directly
  // without multiplying a JS-side prop inside the UI thread worklet.
  const scaleVal = useSharedValue(scale);

  const transX = useSharedValue(0);
  const transY = useSharedValue(0);

  useEffect(() => {
    const { rx, ry, tx, ty } = orbitParamsForIndex(index);

    // Fade in from invisible to baseline, then shimmer.
    // withRepeat with reverse=true handles the turnaround natively — no
    // withSequence loop boundary that could produce a frame-level glitch.
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(0.03, { duration: FADE_IN_DURATION, easing: Easing.out(Easing.sin) }),
        withRepeat(
          withTiming(0.45, { duration: SHIMMER_DURATION, easing: Easing.inOut(Easing.sin) }),
          -1,
          true
        )
      )
    );

    scaleVal.value = withDelay(
      delay,
      withRepeat(
        withTiming(scale * 1.06, { duration: SHIMMER_DURATION, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );

    transX.value = withDelay(
      delay,
      withRepeat(withTiming(rx, { duration: tx / 1.5, easing: Easing.inOut(Easing.sin) }), -1, true)
    );

    // Quarter-period offset on Y creates an elliptical feel
    transY.value = withDelay(
      delay + tx / 4,
      withRepeat(withTiming(ry, { duration: ty / 1.5, easing: Easing.inOut(Easing.sin) }), -1, true)
    );

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(scaleVal);
      cancelAnimation(transX);
      cancelAnimation(transY);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: transX.value },
      { translateY: transY.value },
      { scale: scaleVal.value },
      { rotate: `${rotation}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[styles.glyph, { left: left * SCREEN_W, top: top * SCREEN_H }, animStyle]}
      pointerEvents="none"
    >
      <Text style={styles.glyphText}>{glyph}</Text>
    </Animated.View>
  );
}

export function ZodiacBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {GLYPHS.map((glyph, i) => {
        const [left, top, scale, rotation, delay] = LAYOUT[i];
        return (
          <ZodiacGlyph
            key={glyph}
            glyph={glyph}
            left={left}
            top={top}
            scale={scale}
            rotation={rotation}
            delay={delay}
            index={i}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  glyph: {
    position: 'absolute',
  },
  glyphText: {
    fontSize: 64,
    color: '#444444',
  },
});
