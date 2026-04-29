import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { LastReadingCard } from './LastReadingCard';
import type { ReadingRow } from '@hooks/useReadings';

const DAILY_READING: ReadingRow = {
  id: 'reading-daily-1',
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
  created_at: '2026-04-29T08:12:00Z',
};

const DAILY_REVERSED: ReadingRow = {
  ...DAILY_READING,
  id: 'reading-daily-2',
  drawn_cards: [
    {
      cardId: 16,
      cardName: 'The Tower',
      arcana: 'Major',
      suit: null,
      orientation: 'reversed',
      position: null,
    },
  ],
  created_at: '2026-04-28T22:05:00Z',
};

const PPF_READING: ReadingRow = {
  id: 'reading-ppf-1',
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
      cardId: 14,
      cardName: 'Temperance',
      arcana: 'Major',
      suit: null,
      orientation: 'reversed',
      position: 'present',
    },
    {
      cardId: 57,
      cardName: 'Eight of Cups',
      arcana: 'Minor',
      suit: 'Cups',
      orientation: 'upright',
      position: 'future',
    },
  ],
  ai_insight: null,
  created_at: '2026-04-27T20:15:00Z',
};

const RELATIONSHIP_READING: ReadingRow = {
  id: 'reading-rel-1',
  spread_type: 'relationship',
  drawn_cards: [
    {
      cardId: 6,
      cardName: 'The Lovers',
      arcana: 'Major',
      suit: null,
      orientation: 'upright',
      position: 'self',
    },
    {
      cardId: 11,
      cardName: 'Justice',
      arcana: 'Major',
      suit: null,
      orientation: 'upright',
      position: 'other',
    },
    {
      cardId: 35,
      cardName: 'Five of Wands',
      arcana: 'Minor',
      suit: 'Wands',
      orientation: 'reversed',
      position: 'dynamic',
    },
  ],
  ai_insight: null,
  created_at: '2026-04-25T14:30:00Z',
};

const meta = {
  title: 'Path/LastReadingCard',
  component: LastReadingCard,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    reading: DAILY_READING,
    isLoading: false,
    onPress: fn(),
  },
} satisfies Meta<typeof LastReadingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DailyDraw: Story = {};

export const DailyReversed: Story = {
  args: { reading: DAILY_REVERSED },
};

export const PPFSpread: Story = {
  args: { reading: PPF_READING },
};

export const RelationshipSpread: Story = {
  args: { reading: RELATIONSHIP_READING },
};

export const Loading: Story = {
  args: { isLoading: true, reading: null },
};

export const NoReading: Story = {
  args: { reading: null },
};
