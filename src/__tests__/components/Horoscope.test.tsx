import React from 'react';
import { render } from '@testing-library/react-native';
import { Horoscope } from '@components/astrology/Horoscope';
import type { DailyMetaphysical } from '@hooks/useDailyMetaphysical';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@components/ui/Skeleton', () => ({
  Skeleton: () => null,
}));

const FULL_DATA: DailyMetaphysical = {
  date: '2026-04-29',
  moon_phase: 'Full Moon',
  retrograde_planets: ['Mercury', 'Venus'],
  lucky_numbers: [1, 7, 21],
  lucky_colors: ['indigo', 'gold'],
  energy_theme: 'Abundance & Clarity',
  advice: 'Lean into the light today.',
  moon_sign: { name: 'Pisces', symbol: '♓', element: 'water' },
};

describe('Horoscope', () => {
  describe('loading state', () => {
    it('renders without error and hides content', () => {
      const { queryByText } = render(<Horoscope cosmic={null} isLoading />);
      expect(queryByText('DAILY CELESTIAL INSIGHT')).toBeNull();
    });
  });

  describe('null data, not loading', () => {
    it('renders nothing', () => {
      const { toJSON } = render(<Horoscope cosmic={null} isLoading={false} />);
      expect(toJSON()).toBeNull();
    });
  });

  describe('with full data', () => {
    it('shows the "DAILY CELESTIAL INSIGHT" label', () => {
      const { getByText } = render(<Horoscope cosmic={FULL_DATA} isLoading={false} />);
      expect(getByText('DAILY CELESTIAL INSIGHT')).toBeTruthy();
    });

    it('shows the energy theme', () => {
      const { getByText } = render(<Horoscope cosmic={FULL_DATA} isLoading={false} />);
      expect(getByText('Abundance & Clarity')).toBeTruthy();
    });

    it('shows the advice text', () => {
      const { getByText } = render(<Horoscope cosmic={FULL_DATA} isLoading={false} />);
      expect(getByText('Lean into the light today.')).toBeTruthy();
    });

    it('shows the moon phase with emoji', () => {
      const { getByText } = render(<Horoscope cosmic={FULL_DATA} isLoading={false} />);
      expect(getByText(/Full Moon/)).toBeTruthy();
    });

    it('shows the moon sign pill', () => {
      const { getByText } = render(<Horoscope cosmic={FULL_DATA} isLoading={false} />);
      expect(getByText('♓ Pisces')).toBeTruthy();
    });

    it('shows retrograde planets with ℞ symbol', () => {
      const { getByText } = render(<Horoscope cosmic={FULL_DATA} isLoading={false} />);
      expect(getByText(/Mercury ℞/)).toBeTruthy();
      expect(getByText(/Venus ℞/)).toBeTruthy();
    });
  });

  describe('unknown moon phase', () => {
    it('falls back to 🌙 for an unrecognised phase', () => {
      const data = { ...FULL_DATA, moon_phase: 'Blood Moon' };
      const { getByText } = render(<Horoscope cosmic={data} isLoading={false} />);
      expect(getByText(/🌙/)).toBeTruthy();
    });
  });

  describe('optional fields absent', () => {
    const MINIMAL: DailyMetaphysical = {
      date: '2026-04-29',
      moon_phase: 'New Moon',
      retrograde_planets: null,
      lucky_numbers: null,
      lucky_colors: null,
      energy_theme: null,
      advice: null,
      moon_sign: null,
    };

    it('renders without error', () => {
      expect(() => render(<Horoscope cosmic={MINIMAL} isLoading={false} />)).not.toThrow();
    });

    it('does not show the retrograde pill', () => {
      const { queryByText } = render(<Horoscope cosmic={MINIMAL} isLoading={false} />);
      expect(queryByText(/℞/)).toBeNull();
    });

    it('still shows the moon phase', () => {
      const { getByText } = render(<Horoscope cosmic={MINIMAL} isLoading={false} />);
      expect(getByText(/New Moon/)).toBeTruthy();
    });
  });
});
