import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';
import { SignsSheet } from './SignsSheet';

const meta = {
  title: 'Profile/SignsSheet',
  component: SignsSheet,
  args: {
    isVisible: true,
    onClose: fn(),
    sunSign: 'Aries',
    moonSign: 'Scorpio',
    risingSign: 'Capricorn',
  },
} satisfies Meta<typeof SignsSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WaterSigns: Story = {
  args: {
    sunSign: 'Pisces',
    moonSign: 'Cancer',
    risingSign: 'Scorpio',
  },
};

export const EarthSigns: Story = {
  args: {
    sunSign: 'Taurus',
    moonSign: 'Virgo',
    risingSign: 'Capricorn',
  },
};

export const AirSigns: Story = {
  args: {
    sunSign: 'Aquarius',
    moonSign: 'Gemini',
    risingSign: 'Libra',
  },
};
