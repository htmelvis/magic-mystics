import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { TarotDeck } from './TarotDeck';

const meta = {
  title: 'Tarot/TarotDeck',
  component: TarotDeck,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    onShuffle: fn(),
    onShuffleComplete: fn(),
    onDraw: fn(),
  },
} satisfies Meta<typeof TarotDeck>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCardCount: Story = {
  args: { cardCount: 78 },
};

export const WithoutDrawButton: Story = {
  args: { onDraw: undefined },
};

export const ShuffleOnMount: Story = {
  args: { shuffleOnMount: true, cardCount: 78 },
};
