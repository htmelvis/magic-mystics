import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { TiltCard } from './TiltCard';
import type { TarotCard } from '@/types/tarot';

const THE_FOOL: TarotCard = {
  id: 'fool',
  name: 'The Fool',
  suit: 'major',
  number: 0,
  imageUrl: '',
  keywords: {
    upright: ['new beginnings', 'spontaneity', 'innocence'],
    reversed: ['recklessness', 'fear', 'poor judgement'],
  },
  meaning: {
    upright: 'A leap into the unknown, carried by faith and fresh possibility.',
    reversed: 'Recklessness or fear holding you back from the necessary leap.',
  },
};

const meta = {
  title: 'Tarot/TiltCard',
  component: TiltCard,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  args: {
    card: THE_FOOL,
    isFlipped: true,
    tiltEnabled: false,
    orientation: 'upright',
  },
} satisfies Meta<typeof TiltCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Revealed: Story = {};

export const Unflipped: Story = {
  args: { isFlipped: false },
};

export const Reversed: Story = {
  args: { orientation: 'reversed' },
};

export const TiltEnabled: Story = {
  args: { tiltEnabled: true },
};
