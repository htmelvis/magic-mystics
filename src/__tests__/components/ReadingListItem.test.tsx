import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ReadingListItem } from '@components/history/ReadingListItem';
import type { ReadingRow } from '@hooks/useReadings';

const DAILY_READING: ReadingRow = {
  id: 'r1',
  spread_type: 'daily',
  drawn_cards: [
    {
      cardId: 1,
      cardName: 'The Fool',
      arcana: 'Major',
      suit: null,
      orientation: 'upright',
      position: null,
    },
  ],
  ai_insight: null,
  created_at: '2026-04-15T10:00:00.000Z',
};

const PPF_READING: ReadingRow = {
  id: 'r2',
  spread_type: 'past-present-future',
  drawn_cards: [
    {
      cardId: 2,
      cardName: 'The High Priestess',
      arcana: 'Major',
      suit: null,
      orientation: 'upright',
      position: 'past',
    },
    {
      cardId: 3,
      cardName: 'The Emperor',
      arcana: 'Major',
      suit: null,
      orientation: 'reversed',
      position: 'present',
    },
    {
      cardId: 4,
      cardName: 'The Star',
      arcana: 'Major',
      suit: null,
      orientation: 'upright',
      position: 'future',
    },
  ],
  ai_insight: null,
  created_at: '2026-04-14T09:30:00.000Z',
};

describe('ReadingListItem', () => {
  describe('spread badge', () => {
    it('shows Daily Draw badge for daily spread', () => {
      const { getByText } = render(<ReadingListItem reading={DAILY_READING} onPress={jest.fn()} />);
      expect(getByText('Daily Draw')).toBeTruthy();
    });

    it('shows 3-Card Spread badge for past-present-future spread', () => {
      const { getByText } = render(<ReadingListItem reading={PPF_READING} onPress={jest.fn()} />);
      expect(getByText('3-Card Spread')).toBeTruthy();
    });
  });

  describe('daily draw preview', () => {
    it('renders card name and upright orientation', () => {
      const { getByText } = render(<ReadingListItem reading={DAILY_READING} onPress={jest.fn()} />);
      expect(getByText('The Fool')).toBeTruthy();
      expect(getByText('↑ Upright')).toBeTruthy();
    });

    it('renders reversed orientation indicator', () => {
      const reading: ReadingRow = {
        ...DAILY_READING,
        drawn_cards: [{ ...DAILY_READING.drawn_cards[0], orientation: 'reversed' }],
      };
      const { getByText } = render(<ReadingListItem reading={reading} onPress={jest.fn()} />);
      expect(getByText('↓ Reversed')).toBeTruthy();
    });

    it('shows "Major Arcana" label for major arcana cards', () => {
      const { getByText } = render(<ReadingListItem reading={DAILY_READING} onPress={jest.fn()} />);
      expect(getByText('Major Arcana')).toBeTruthy();
    });

    it('shows suit name as arcana label for minor arcana cards', () => {
      const reading: ReadingRow = {
        ...DAILY_READING,
        drawn_cards: [
          {
            cardId: 10,
            cardName: 'Ace of Cups',
            arcana: 'Minor',
            suit: 'Cups',
            orientation: 'upright',
            position: null,
          },
        ],
      };
      const { getByText } = render(<ReadingListItem reading={reading} onPress={jest.fn()} />);
      expect(getByText('Cups')).toBeTruthy();
    });
  });

  describe('3-card spread preview', () => {
    it('shows PAST, PRESENT, and FUTURE position labels', () => {
      const { getByText } = render(<ReadingListItem reading={PPF_READING} onPress={jest.fn()} />);
      expect(getByText('PAST')).toBeTruthy();
      expect(getByText('PRESENT')).toBeTruthy();
      expect(getByText('FUTURE')).toBeTruthy();
    });

    it('renders each card name in its position cell', () => {
      const { getByText } = render(<ReadingListItem reading={PPF_READING} onPress={jest.fn()} />);
      expect(getByText('The High Priestess')).toBeTruthy();
      expect(getByText('The Emperor')).toBeTruthy();
      expect(getByText('The Star')).toBeTruthy();
    });
  });

  describe('AI insight pill', () => {
    it('shows AI Insight pill when ai_insight is present', () => {
      const reading: ReadingRow = { ...DAILY_READING, ai_insight: 'You are on the right path.' };
      const { getByLabelText } = render(<ReadingListItem reading={reading} onPress={jest.fn()} />);
      expect(getByLabelText('AI Insight available')).toBeTruthy();
    });

    it('does not show AI Insight pill when ai_insight is null', () => {
      const { queryByLabelText } = render(
        <ReadingListItem reading={DAILY_READING} onPress={jest.fn()} />
      );
      expect(queryByLabelText('AI Insight available')).toBeNull();
    });
  });

  describe('interaction', () => {
    it('calls onPress with the reading when tapped', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<ReadingListItem reading={DAILY_READING} onPress={onPress} />);
      fireEvent.press(getByRole('button'));
      expect(onPress).toHaveBeenCalledWith(DAILY_READING);
    });
  });

  describe('accessibility labels', () => {
    it('includes spread type, card name, and orientation for daily draw', () => {
      const { getByRole } = render(<ReadingListItem reading={DAILY_READING} onPress={jest.fn()} />);
      expect(getByRole('button').props.accessibilityLabel).toMatch(
        /Daily Draw, The Fool, upright/
      );
    });

    it('includes spread type and all card names for 3-card spread', () => {
      const { getByRole } = render(<ReadingListItem reading={PPF_READING} onPress={jest.fn()} />);
      const label: string = getByRole('button').props.accessibilityLabel;
      expect(label).toMatch(/3-Card Spread/);
      expect(label).toMatch(/The High Priestess/);
      expect(label).toMatch(/The Emperor/);
      expect(label).toMatch(/The Star/);
    });
  });
});
