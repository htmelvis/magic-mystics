import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { DrawerCardSection } from './DrawerCardSection';
import type { DrawnCardRecord } from '@/types/tarot';

const THE_FOOL: DrawnCardRecord = {
  cardId: 1,
  cardName: 'The Fool',
  arcana: 'Major',
  suit: null,
  orientation: 'upright',
  position: null,
};

const FOOL_DETAIL = {
  upright_summary: 'A leap into the unknown, carried by faith and fresh possibility.',
  upright_meaning_long:
    'The Fool invites you to step beyond what you can control and trust what you cannot yet see. There is tremendous freedom in beginning — and tremendous risk. Today, naivety is not your enemy; it is your permission slip.',
  keywords_upright: ['new beginnings', 'innocence', 'spontaneity', 'free spirit'],
  element: 'Air',
  astrology_association: 'Uranus',
  numerology: 0,
};

const ACE_OF_CUPS: DrawnCardRecord = {
  cardId: 37,
  cardName: 'Ace of Cups',
  arcana: 'Minor',
  suit: 'Cups',
  orientation: 'upright',
  position: 'past',
};

const meta = {
  title: 'History/DrawerCardSection',
  component: DrawerCardSection,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    card: THE_FOOL,
    cardDetail: FOOL_DETAIL,
    showPosition: false,
    divider: false,
  },
} satisfies Meta<typeof DrawerCardSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Reversed: Story = {
  args: {
    card: { ...THE_FOOL, orientation: 'reversed' },
    cardDetail: {
      reversed_summary: 'Recklessness and fear of the unknown pulling in opposite directions.',
      reversed_meaning_long:
        'The reversed Fool asks whether your hesitation is wisdom or fear. Something is holding you back from the leap — examine it before you decide whether to listen.',
      keywords_reversed: ['recklessness', 'fear', 'poor judgement', 'risk-aversion'],
      element: 'Air',
      astrology_association: 'Uranus',
      numerology: 0,
    },
  },
};

export const WithPosition: Story = {
  args: {
    card: ACE_OF_CUPS,
    cardDetail: {
      upright_summary: 'Emotional overflow — love and creativity arriving as gifts.',
      upright_meaning_long:
        'The Ace of Cups is the seed of all feeling: love before it has found its object, creativity before it has found its form.',
      keywords_upright: ['love', 'new feelings', 'intuition', 'creativity'],
      element: 'Water',
      astrology_association: 'Cancer, Scorpio, Pisces',
    },
    showPosition: true,
    divider: true,
  },
};

export const Loading: Story = {
  args: { cardDetail: null },
};
