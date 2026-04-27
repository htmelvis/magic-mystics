import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TarotCard } from './TarotCard';
import type { TarotCardProps } from './TarotCard';
import { useTilt } from '@hooks/useTilt';
import { ANIMATION, CARD } from './card-constants';

const MAX_DEG = 15;
const SHIMMER_FADE_IN_DURATION = 400;
const SHIMMER_FADE_OUT_DURATION = 200;

interface TiltCardProps extends TarotCardProps {
  tiltEnabled: boolean;
}

export function TiltCard({ tiltEnabled, isFlipped, style, ...rest }: TiltCardProps) {
  const { tiltX, tiltY } = useTilt(tiltEnabled && isFlipped);

  const tiltEnabledSV = useSharedValue(tiltEnabled && isFlipped);
  const shimmerOpacity = useSharedValue(0);

  useEffect(() => {
    tiltEnabledSV.value = tiltEnabled && isFlipped;
  }, [tiltEnabled, isFlipped, tiltEnabledSV]);

  // Fade shimmer in after the flip animation completes, fade out immediately on disable
  useAnimatedReaction(
    () => tiltEnabledSV.value,
    (enabled) => {
      if (enabled) {
        shimmerOpacity.value = withDelay(ANIMATION.flip, withTiming(1, { duration: SHIMMER_FADE_IN_DURATION }));
      } else {
        shimmerOpacity.value = withTiming(0, { duration: SHIMMER_FADE_OUT_DURATION });
      }
    }
  );

  const tiltStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateX: `${tiltX.value}deg` },
      { rotateY: `${tiltY.value}deg` },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -(tiltY.value / MAX_DEG) * (CARD.width * 0.4) },
      { translateY: -(tiltX.value / MAX_DEG) * (CARD.height * 0.4) },
    ],
    opacity: shimmerOpacity.value,
  }));

  return (
    <Animated.View style={[{ width: CARD.width, height: CARD.height }, tiltStyle, style]}>
      <TarotCard isFlipped={isFlipped} style={style} {...rest} />
      {/* Clipping container separate from the 3D transform view — avoids Android flattening */}
      <View
        style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: CARD.borderRadius }]}
        pointerEvents="none"
      >
        <Animated.View style={[styles.shimmer, shimmerStyle]} pointerEvents="none">
          <LinearGradient
            colors={[
              'transparent',
              'rgba(201,168,76,0.22)',
              'rgba(255,255,255,0.12)',
              'transparent',
            ]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shimmer: {
    position: 'absolute',
    width: CARD.width * 2,
    height: CARD.height * 2,
    top: -(CARD.height * 0.5),
    left: -(CARD.width * 0.5),
  },
});
