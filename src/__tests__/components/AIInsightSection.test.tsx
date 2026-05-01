import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AIInsightSection } from '@components/tarot/AIInsightSection';
import type { SingleCardInsight, SpreadInsight } from '@/types/ai-insight';

const mockOpen = jest.fn();

jest.mock('@/context/UpgradeSheetContext', () => ({
  useUpgradeSheet: () => ({ open: mockOpen }),
}));

const SINGLE_INSIGHT: SingleCardInsight = {
  kind: 'single',
  opening: 'The cards speak of transformation.',
  card_essence: 'The Tower clears what no longer serves.',
  celestial_overlay: 'Mercury retrograde deepens the message.',
  guidance: 'Release, and trust the rebuild.',
  resonance: 'You are stronger than the storm.',
};

const SPREAD_INSIGHT: SpreadInsight = {
  kind: 'spread',
  opening: 'Three cards tell your story.',
  spread_reading: 'Past sacrifice feeds present growth.',
  guidance: 'Walk forward without looking back.',
  resonance: 'Every ending is a door.',
};

describe('AIInsightSection', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('loading state', () => {
    it('renders skeleton without crashing', () => {
      expect(() =>
        render(<AIInsightSection insight={null} isLoading isPremium={false} />)
      ).not.toThrow();
    });

    it('does not show oracle content while loading', () => {
      const { queryByText } = render(
        <AIInsightSection insight={null} isLoading isPremium={false} />
      );
      expect(queryByText('✦ From the Oracle')).toBeNull();
    });
  });

  describe('locked (non-premium)', () => {
    it('renders the upgrade prompt', () => {
      const { getByText } = render(
        <AIInsightSection insight={null} isLoading={false} isPremium={false} />
      );
      expect(getByText('Insights from the Oracle')).toBeTruthy();
      expect(getByText('Unlock with Premium')).toBeTruthy();
    });

    it('calls open() when the locked card is pressed', () => {
      const { getByLabelText } = render(
        <AIInsightSection insight={null} isLoading={false} isPremium={false} />
      );
      fireEvent.press(getByLabelText('Unlock AI Reading — upgrade to Premium'));
      expect(mockOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('premium with no insight', () => {
    it('renders nothing', () => {
      const { toJSON } = render(
        <AIInsightSection insight={null} isLoading={false} isPremium />
      );
      expect(toJSON()).toBeNull();
    });
  });

  describe('single card insight', () => {
    it('shows the oracle header', () => {
      const { getByText } = render(
        <AIInsightSection insight={SINGLE_INSIGHT} isLoading={false} isPremium />
      );
      expect(getByText('✦ From the Oracle')).toBeTruthy();
    });

    it('renders the opening text', () => {
      const { getByText } = render(
        <AIInsightSection insight={SINGLE_INSIGHT} isLoading={false} isPremium />
      );
      expect(getByText('The cards speak of transformation.')).toBeTruthy();
    });

    it('renders the card essence section', () => {
      const { getByText } = render(
        <AIInsightSection insight={SINGLE_INSIGHT} isLoading={false} isPremium />
      );
      expect(getByText('THE CARD & YOU')).toBeTruthy();
      expect(getByText('The Tower clears what no longer serves.')).toBeTruthy();
    });

    it('renders the celestial overlay section', () => {
      const { getByText } = render(
        <AIInsightSection insight={SINGLE_INSIGHT} isLoading={false} isPremium />
      );
      expect(getByText('CELESTIAL')).toBeTruthy();
      expect(getByText('Mercury retrograde deepens the message.')).toBeTruthy();
    });

    it('renders the guidance section', () => {
      const { getByText } = render(
        <AIInsightSection insight={SINGLE_INSIGHT} isLoading={false} isPremium />
      );
      expect(getByText('GUIDANCE')).toBeTruthy();
      expect(getByText('Release, and trust the rebuild.')).toBeTruthy();
    });

    it('renders the resonance quote', () => {
      const { getByText } = render(
        <AIInsightSection insight={SINGLE_INSIGHT} isLoading={false} isPremium />
      );
      expect(getByText(/"You are stronger than the storm\."/)). toBeTruthy();
    });
  });

  describe('spread insight', () => {
    it('renders the spread reading section', () => {
      const { getByText } = render(
        <AIInsightSection insight={SPREAD_INSIGHT} isLoading={false} isPremium />
      );
      expect(getByText('THE READING')).toBeTruthy();
      expect(getByText('Past sacrifice feeds present growth.')).toBeTruthy();
    });

    it('renders the resonance quote', () => {
      const { getByText } = render(
        <AIInsightSection insight={SPREAD_INSIGHT} isLoading={false} isPremium />
      );
      expect(getByText(/"Every ending is a door\./)).toBeTruthy();
    });
  });
});
