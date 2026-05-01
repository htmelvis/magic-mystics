import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { PlanetaryAlignmentCard } from './PlanetaryAlignmentCard';
import type { DailyPlanetaryAlignment } from '@/types/metaphysical';

const SAMPLE: DailyPlanetaryAlignment = {
  date: '2026-04-29',
  dominant_planet: 'Mars',
  dominant_planet_sign: 'Cancer',
  dominant_planet_symbol: '♂',
  alignment_theme: 'Mars in Cancer stirs protected action',
  supported_endeavors: [
    'home projects',
    'family conversations',
    'emotional honesty',
    'intuitive planning',
  ],
  advice: 'Direct your drive inward today — nurture what matters most before pushing outward.',
  all_planet_positions: [
    { planet: 'Sun', symbol: '☉', sign: 'Taurus', isRetrograde: false },
    { planet: 'Moon', symbol: '☽', sign: 'Scorpio', isRetrograde: false },
    { planet: 'Mercury', symbol: '☿', sign: 'Aries', isRetrograde: true },
    { planet: 'Venus', symbol: '♀', sign: 'Gemini', isRetrograde: false },
    { planet: 'Mars', symbol: '♂', sign: 'Cancer', isRetrograde: false },
    { planet: 'Jupiter', symbol: '♃', sign: 'Gemini', isRetrograde: false },
    { planet: 'Saturn', symbol: '♄', sign: 'Pisces', isRetrograde: false },
    { planet: 'Uranus', symbol: '♅', sign: 'Taurus', isRetrograde: false },
    { planet: 'Neptune', symbol: '♆', sign: 'Aries', isRetrograde: false },
    { planet: 'Pluto', symbol: '♇', sign: 'Aquarius', isRetrograde: true },
  ],
};

const meta = {
  title: 'Path/PlanetaryAlignmentCard',
  component: PlanetaryAlignmentCard,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    alignment: SAMPLE,
    isLoading: false,
    showFull: false,
  },
} satisfies Meta<typeof PlanetaryAlignmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {};

export const Full: Story = {
  args: { showFull: true },
};

export const FullWithMultipleRetrogrades: Story = {
  args: {
    showFull: true,
    alignment: {
      ...SAMPLE,
      alignment_theme: 'Saturn and Pluto slow the sky together',
      all_planet_positions: SAMPLE.all_planet_positions!.map(p =>
        ['Mercury', 'Saturn', 'Pluto', 'Neptune'].includes(p.planet)
          ? { ...p, isRetrograde: true }
          : p
      ),
    },
  },
};

export const Loading: Story = {
  args: { isLoading: true, alignment: null },
};

export const NoData: Story = {
  args: { alignment: null },
};
