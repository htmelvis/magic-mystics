import React from 'react';
import { render } from '@testing-library/react-native';
import { CosmicWeatherCard } from '@components/home/CosmicWeatherCard';
import type { DailyMetaphysical } from '@hooks/useDailyMetaphysical';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Skeleton uses react-native-reanimated; mock it to keep tests fast
jest.mock('@components/ui/Skeleton', () => ({
  Skeleton: () => null,
}));

const FULL_DATA: DailyMetaphysical = {
  date: '2026-04-11',
  moon_phase: 'Full Moon',
  retrograde_planets: ['Mercury', 'Saturn'],
  lucky_numbers: [3, 7, 12, 28, 33],
  lucky_colors: ['violet', 'gold'],
  energy_theme: 'Clarity & Inner Vision',
  advice: 'Trust your intuition today.',
  moon_sign: { name: 'Scorpio', symbol: '♏', element: 'water' },
};

describe('CosmicWeatherCard', () => {
  describe('loading state', () => {
    it('renders loading skeleton and not the card content', () => {
      const { queryByText } = render(
        <CosmicWeatherCard cosmic={null} isLoading />
      );
      expect(queryByText('Full Moon')).toBeNull();
      expect(queryByText('Cosmic Weather')).toBeNull();
    });
  });

  describe('null data, not loading', () => {
    it('renders nothing', () => {
      const { toJSON } = render(
        <CosmicWeatherCard cosmic={null} isLoading={false} />
      );
      expect(toJSON()).toBeNull();
    });
  });

  describe('with full data', () => {
    it('shows the "Cosmic Weather" label', () => {
      const { getByText } = render(
        <CosmicWeatherCard cosmic={FULL_DATA} isLoading={false} />
      );
      expect(getByText('Cosmic Weather')).toBeTruthy();
    });

    it('shows the moon phase', () => {
      const { getByText } = render(
        <CosmicWeatherCard cosmic={FULL_DATA} isLoading={false} />
      );
      expect(getByText(/Full Moon/)).toBeTruthy();
    });

    it('shows the energy theme', () => {
      const { getByText } = render(
        <CosmicWeatherCard cosmic={FULL_DATA} isLoading={false} />
      );
      expect(getByText('Clarity & Inner Vision')).toBeTruthy();
    });

    it('shows the advice text', () => {
      const { getByText } = render(
        <CosmicWeatherCard cosmic={FULL_DATA} isLoading={false} />
      );
      expect(getByText('Trust your intuition today.')).toBeTruthy();
    });

    it('shows the moon sign pill', () => {
      const { getByText } = render(
        <CosmicWeatherCard cosmic={FULL_DATA} isLoading={false} />
      );
      expect(getByText('♏ Scorpio')).toBeTruthy();
    });

    it('shows retrograde planets with the ℞ symbol', () => {
      const { getByText } = render(
        <CosmicWeatherCard cosmic={FULL_DATA} isLoading={false} />
      );
      expect(getByText(/Mercury ℞/)).toBeTruthy();
      expect(getByText(/Saturn ℞/)).toBeTruthy();
    });

    it('shows the first 4 lucky numbers joined by dots', () => {
      const { getByText } = render(
        <CosmicWeatherCard cosmic={FULL_DATA} isLoading={false} />
      );
      // slice(0, 4) → [3, 7, 12, 28]
      expect(getByText(/3 · 7 · 12 · 28/)).toBeTruthy();
    });
  });

  describe('optional fields absent', () => {
    const MINIMAL: DailyMetaphysical = {
      date: '2026-04-11',
      moon_phase: 'New Moon',
      retrograde_planets: null,
      lucky_numbers: null,
      lucky_colors: null,
      energy_theme: null,
      advice: null,
      moon_sign: null,
    };

    it('renders without error when optional fields are null', () => {
      expect(() =>
        render(<CosmicWeatherCard cosmic={MINIMAL} isLoading={false} />)
      ).not.toThrow();
    });

    it('does not render the retrograde pill', () => {
      const { queryByText } = render(
        <CosmicWeatherCard cosmic={MINIMAL} isLoading={false} />
      );
      expect(queryByText(/℞/)).toBeNull();
    });

    it('still shows moon phase', () => {
      const { getByText } = render(
        <CosmicWeatherCard cosmic={MINIMAL} isLoading={false} />
      );
      expect(getByText(/New Moon/)).toBeTruthy();
    });
  });
});
