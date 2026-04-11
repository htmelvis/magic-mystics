import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { ZodiacAvatar } from './ZodiacAvatar';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';

const ALL_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const meta = {
  title: 'UI/ZodiacAvatar',
  component: ZodiacAvatar,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  args: {
    sign: 'Leo',
    size: 48,
  },
} satisfies Meta<typeof ZodiacAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 32 },
};

export const Large: Story = {
  args: { size: 80 },
};

export const AllSigns: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 }}>
      {ALL_SIGNS.map((sign) => (
        <ZodiacAvatar key={sign} sign={sign} size={48} />
      ))}
    </View>
  ),
};
