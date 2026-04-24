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
const ALPHA = 0.2;
const RAD_TO_DEG = 180 / Math.PI;
const SPRING_BACK = { damping: 20, stiffness: 300, mass: 1 };

export interface UseTiltResult {
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  isSupported: boolean;
}

export function useTilt(enabled: boolean): UseTiltResult {
  const enabledSV = useSharedValue(enabled);
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

      // Use absolute orientation so flat phone (pitch≈0, roll≈0) = flat card
      const pitchDeg = pitch * RAD_TO_DEG * SENSITIVITY;
      const rollDeg = roll * RAD_TO_DEG * SENSITIVITY;

      smoothPitch.value = smoothPitch.value + ALPHA * (pitchDeg - smoothPitch.value);
      smoothRoll.value = smoothRoll.value + ALPHA * (rollDeg - smoothRoll.value);

      tiltX.value = Math.max(-MAX_DEG, Math.min(MAX_DEG, smoothPitch.value));
      tiltY.value = Math.max(-MAX_DEG, Math.min(MAX_DEG, smoothRoll.value));
    }
  );

  return { tiltX, tiltY, isSupported: sensor.isAvailable };
}
