import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { CardDetail } from './CardDetail';
import type { TarotCardRow } from '@/types/tarot';

const THE_FOOL: TarotCardRow = {
  id: 1,
  name: 'The Fool',
  arcana: 'Major',
  suit: null,
  number: 0,
  image_url: null,
  element: 'Air',
  astrology_association: 'Uranus',
  upright_summary: 'A leap into the unknown, carried by faith and fresh possibility.',
  reversed_summary: 'Recklessness or fear holding you back from the necessary leap.',
  upright_meaning_long:
    'The Fool invites you to step beyond what you can control and trust what you cannot yet see. There is tremendous freedom in beginning — and tremendous risk. Today, naivety is not your enemy; it is your permission slip.',
  reversed_meaning_long:
    'The reversed Fool asks whether your hesitation is wisdom or fear. Something is holding you back from the leap — examine it carefully before you decide whether to listen.',
  keywords_upright: ['new beginnings', 'innocence', 'spontaneity'],
  keywords_reversed: ['recklessness', 'fear', 'poor judgement'],
};

const ACE_OF_CUPS: TarotCardRow = {
  id: 37,
  name: 'Ace of Cups',
  arcana: 'Minor',
  suit: 'Cups',
  number: 1,
  image_url: null,
  element: 'Water',
  astrology_association: 'Cancer, Scorpio, Pisces',
  upright_summary: 'Emotional overflow — love and creativity arriving as gifts.',
  reversed_summary: 'Blocked emotion or creative drought.',
  upright_meaning_long:
    'The Ace of Cups is the seed of all feeling: love before it has found its object, creativity before it has found its form. Let what wants to open, open.',
  reversed_meaning_long:
    'When reversed, the cup has been turned — emotion blocked, repressed, or drained. Something needs to be released before the flow can return.',
  keywords_upright: ['love', 'new feelings', 'intuition', 'creativity'],
  keywords_reversed: ['repressed emotions', 'blocked creativity', 'emptiness'],
};

const meta = {
  title: 'Tarot/CardDetail',
  component: CardDetail,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    card: THE_FOOL,
    orientation: 'upright',
  },
} satisfies Meta<typeof CardDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MajorUpright: Story = {};

export const MajorReversed: Story = {
  args: { orientation: 'reversed' },
};

export const MinorUpright: Story = {
  args: { card: ACE_OF_CUPS },
};

export const MinorReversed: Story = {
  args: { card: ACE_OF_CUPS, orientation: 'reversed' },
};
