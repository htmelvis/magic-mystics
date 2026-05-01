import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { ReadingListItem } from './ReadingListItem';
import type { ReadingRow } from '@hooks/useReadings';

const DAILY_READING: ReadingRow = {
  id: 'reading-1',
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
  created_at: '2026-04-28T09:14:00Z',
};

const PPF_READING: ReadingRow = {
  id: 'reading-2',
  spread_type: 'past-present-future',
  drawn_cards: [
    {
      cardId: 14,
      cardName: 'Temperance',
      arcana: 'Major',
      suit: null,
      orientation: 'upright',
      position: 'past',
    },
    {
      cardId: 37,
      cardName: 'Ace of Cups',
      arcana: 'Minor',
      suit: 'Cups',
      orientation: 'reversed',
      position: 'present',
    },
    {
      cardId: 78,
      cardName: 'King of Pentacles',
      arcana: 'Minor',
      suit: 'Pentacles',
      orientation: 'upright',
      position: 'future',
    },
  ],
  ai_insight: null,
  created_at: '2026-04-27T21:30:00Z',
};

const meta = {
  title: 'History/ReadingListItem',
  component: ReadingListItem,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    reading: DAILY_READING,
    onPress: fn(),
  },
} satisfies Meta<typeof ReadingListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DailyUpright: Story = {};

export const DailyReversed: Story = {
  args: {
    reading: {
      ...DAILY_READING,
      drawn_cards: [
        {
          cardId: 13,
          cardName: 'Death',
          arcana: 'Major',
          suit: null,
          orientation: 'reversed',
          position: null,
        },
      ],
    },
  },
};

export const PPFSpread: Story = {
  args: { reading: PPF_READING },
};

export const WithAIInsight: Story = {
  args: {
    reading: {
      ...DAILY_READING,
      ai_insight:
        '{"kind":"single","opening":"test","card_essence":"test","celestial_overlay":"test","guidance":"test","resonance":"test"}',
    },
  },
};
