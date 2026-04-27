import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { CosmicWeatherCard } from './CosmicWeatherCard';
import type { DailyMetaphysical } from '@hooks/useDailyMetaphysical';

const SAMPLE_DATA: DailyMetaphysical = {
  date: '2026-04-11',
  moon_phase: 'Full Moon',
  retrograde_planets: ['Mercury', 'Saturn'],
  lucky_numbers: [3, 7, 12, 28],
  lucky_colors: ['violet', 'gold', 'midnight blue'],
  energy_theme: 'Clarity & Inner Vision',
  advice:
    'Trust your intuition today. The full moon illuminates what has been hidden, bringing insight to long-standing questions.',
  moon_sign: { name: 'Scorpio', symbol: '♏', element: 'water' },
};

const MINIMAL_DATA: DailyMetaphysical = {
  date: '2026-04-11',
  moon_phase: 'Waxing Crescent',
  retrograde_planets: null,
  lucky_numbers: null,
  lucky_colors: null,
  energy_theme: null,
  advice: null,
  moon_sign: null,
};

const meta = {
  title: 'Home/CosmicWeatherCard',
  component: CosmicWeatherCard,
  decorators: [
    Story => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    cosmic: SAMPLE_DATA,
    isLoading: false,
  },
} satisfies Meta<typeof CosmicWeatherCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { isLoading: true, cosmic: null },
};

export const Minimal: Story = {
  args: { cosmic: MINIMAL_DATA },
};

export const NoData: Story = {
  args: { cosmic: null },
};

export const NewMoon: Story = {
  args: {
    cosmic: {
      ...SAMPLE_DATA,
      moon_phase: 'New Moon',
      retrograde_planets: null,
      energy_theme: 'New Beginnings',
      advice: 'Set intentions under the new moon. Plant seeds for the cycle ahead.',
    },
  },
};
