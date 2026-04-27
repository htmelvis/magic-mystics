import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { TarotCard, CardBackFace } from './TarotCard';
import type { TarotCard as TarotCardType } from '@/types/tarot';

const THE_FOOL: TarotCardType = {
  id: '0',
  name: 'The Fool',
  suit: 'major',
  number: 0,
  imageUrl: '',
  keywords: {
    upright: ['beginnings', 'innocence', 'spontaneity'],
    reversed: ['recklessness', 'risk-taking'],
  },
  meaning: {
    upright: 'New beginnings, optimism, trust in life.',
    reversed: 'Recklessness, taken advantage of, inconsideration.',
  },
};

const ACE_OF_CUPS: TarotCardType = {
  id: 'cups-1',
  name: 'Ace of Cups',
  suit: 'cups',
  number: 1,
  imageUrl: '',
  keywords: {
    upright: ['love', 'intuition', 'new feelings'],
    reversed: ['blocked creativity', 'emptiness'],
  },
  meaning: {
    upright: 'New love, emotional awakening.',
    reversed: 'Emotional emptiness, blocked feelings.',
  },
};

const meta = {
  title: 'Tarot/TarotCard',
  component: TarotCard,
  decorators: [
    Story => (
      <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    isFlipped: false,
    onPress: fn(),
  },
} satisfies Meta<typeof TarotCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FaceDown: Story = {
  args: { isFlipped: false },
};

export const FaceUp: Story = {
  args: { isFlipped: true, card: THE_FOOL },
};

export const Reversed: Story = {
  args: { isFlipped: true, card: THE_FOOL, orientation: 'reversed' },
};

export const MinorArcana: Story = {
  args: { isFlipped: true, card: ACE_OF_CUPS },
};

export const NoCardData: Story = {
  args: { isFlipped: true, card: undefined },
};

export const BackFaceOnly: Story = {
  render: () => (
    <View style={{ width: 130, height: 220, borderRadius: 14, overflow: 'hidden' }}>
      <CardBackFace />
    </View>
  ),
};
