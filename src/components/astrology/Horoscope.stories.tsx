import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Horoscope } from './Horoscope';
import type { DailyMetaphysical } from '@hooks/useDailyMetaphysical';

const SAMPLE: DailyMetaphysical = {
  date: '2026-04-28',
  moon_phase: 'Waxing Gibbous',
  retrograde_planets: ['Mercury'],
  lucky_numbers: [4, 9, 17, 33, 41],
  lucky_colors: ['indigo', 'violet'],
  energy_theme: 'Deliberate Vision',
  advice:
    'The waxing gibbous moon brings your intentions into sharper focus. What you started at the new moon is gaining momentum — refine rather than redirect.',
  moon_sign: { name: 'Scorpio', symbol: '♏', element: 'water' },
};

const meta = {
  title: 'Astrology/Horoscope',
  component: Horoscope,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    cosmic: SAMPLE,
    isLoading: false,
  },
} satisfies Meta<typeof Horoscope>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullMoon: Story = {
  args: {
    cosmic: {
      ...SAMPLE,
      moon_phase: 'Full Moon',
      energy_theme: 'Peak Illumination',
      advice:
        'The full moon in Scorpio draws hidden truths to the surface. Sit with what is revealed before you respond.',
      retrograde_planets: null,
      lucky_colors: ['gold', 'amber'],
    },
  },
};

export const MultipleRetrogrades: Story = {
  args: {
    cosmic: { ...SAMPLE, retrograde_planets: ['Mercury', 'Saturn', 'Neptune'] },
  },
};

export const NewMoon: Story = {
  args: {
    cosmic: {
      ...SAMPLE,
      moon_phase: 'New Moon',
      energy_theme: 'Quiet Beginning',
      retrograde_planets: null,
      lucky_colors: ['black', 'silver'],
    },
  },
};

export const Loading: Story = {
  args: { isLoading: true, cosmic: null },
};

export const NoData: Story = {
  args: { cosmic: null },
};
