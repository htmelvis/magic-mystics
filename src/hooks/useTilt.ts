import { useEffect } from 'react';
import {
  useAnimatedReaction,
  useAnimatedSensor,
  useSharedValue,
  withSpring,
  SensorType,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

const MAX_DEG = 15;
const SENSITIVITY = 0.5;
const ALPHA = 0.2;       // fast low-pass for output smoothing
const NEUTRAL_ALPHA = 0.01; // slow neutral drift — ~1.7s time constant at 60fps
const RAD_TO_DEG = 180 / Math.PI;
const SPRING_BACK = { damping: 20, stiffness: 300, mass: 1 };

export interface UseTiltResult {
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  isSupported: boolean;
}

export function useTilt(enabled: boolean): UseTiltResult {
  const enabledSV = useSharedValue(enabled);

  // Neutral calibrated on first reading, then slowly drifts toward current orientation.
  // This means any stable held position (upright, flat, angled) eventually becomes "flat card".
  const hasNeutral = useSharedValue(false);
  const neutralPitch = useSharedValue(0);
  const neutralRoll = useSharedValue(0);

  const smoothPitch = useSharedValue(0);
  const smoothRoll = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  const sensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 'auto',
    adjustToInterfaceOrientation: true,
  });

  useEffect(() => {
    enabledSV.value = enabled;
  }, [enabled, enabledSV]);

  useAnimatedReaction(
    () => enabledSV.value,
    (isEnabled) => {
      if (!isEnabled) {
        hasNeutral.value = false;
        tiltX.value = withSpring(0, SPRING_BACK);
        tiltY.value = withSpring(0, SPRING_BACK);
        smoothPitch.value = 0;
        smoothRoll.value = 0;
      }
    }
  );

  useAnimatedReaction(
    () => sensor.sensor.value,
    (data) => {
      if (!enabledSV.value) return;

      const { pitch, roll } = data;

      // Capture initial neutral instantly on first reading
      if (!hasNeutral.value) {
        neutralPitch.value = pitch;
        neutralRoll.value = roll;
        hasNeutral.value = true;
        return;
      }

      // Slowly drift neutral — any stable held angle becomes "flat" after ~2-3s
      neutralPitch.value += NEUTRAL_ALPHA * (pitch - neutralPitch.value);
      neutralRoll.value += NEUTRAL_ALPHA * (roll - neutralRoll.value);

      const deltaPitch = (pitch - neutralPitch.value) * RAD_TO_DEG * SENSITIVITY;
      const deltaRoll = (roll - neutralRoll.value) * RAD_TO_DEG * SENSITIVITY;

      smoothPitch.value += ALPHA * (deltaPitch - smoothPitch.value);
      smoothRoll.value += ALPHA * (deltaRoll - smoothRoll.value);

      tiltX.value = Math.max(-MAX_DEG, Math.min(MAX_DEG, smoothPitch.value));
      tiltY.value = Math.max(-MAX_DEG, Math.min(MAX_DEG, smoothRoll.value));
    }
  );

  return { tiltX, tiltY, isSupported: sensor.isAvailable };
}
