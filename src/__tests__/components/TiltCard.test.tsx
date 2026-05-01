import React from 'react';
import { render } from '@testing-library/react-native';
import { TiltCard } from '@components/tarot/TiltCard';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@hooks/useTilt', () => ({
  useTilt: () => ({
    tiltX: { value: 0 },
    tiltY: { value: 0 },
  }),
}));

jest.mock('react-native-reanimated', () => {
  const RNR = require('react-native-reanimated/mock');
  return RNR;
});

describe('TiltCard', () => {
  it('renders without error when tilt disabled and card is face-down', () => {
    expect(() => render(<TiltCard tiltEnabled={false} isFlipped={false} />)).not.toThrow();
  });

  it('renders without error when tilt enabled and card is flipped', () => {
    expect(() => render(<TiltCard tiltEnabled isFlipped />)).not.toThrow();
  });

  it('renders without error when tilt enabled but card not yet flipped', () => {
    expect(() => render(<TiltCard tiltEnabled isFlipped={false} />)).not.toThrow();
  });

  it('renders without error when tilt disabled but card is flipped', () => {
    expect(() => render(<TiltCard tiltEnabled={false} isFlipped />)).not.toThrow();
  });
});
