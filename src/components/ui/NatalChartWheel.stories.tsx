import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { NatalChartWheel } from './NatalChartWheel';
import type { StoredNatalChart } from '@lib/astrology/natal-chart';

const SAMPLE_CHART: StoredNatalChart = {
  computedAt: '2024-06-15T12:00:00Z',
  ascendant: 15,   // 15° Aries
  midheaven: 285,  // Capricorn MC
  planets: [
    { name: 'Sun',     glyph: '☉', longitude: 84,  sign: 'Gemini',      degree: 24, minute: 10 },
    { name: 'Moon',    glyph: '☽', longitude: 210, sign: 'Scorpio',     degree: 0,  minute: 44 },
    { name: 'Mercury', glyph: '☿', longitude: 72,  sign: 'Gemini',      degree: 12, minute: 5  },
    { name: 'Venus',   glyph: '♀', longitude: 47,  sign: 'Taurus',      degree: 17, minute: 33 },
    { name: 'Mars',    glyph: '♂', longitude: 310, sign: 'Aquarius',    degree: 10, minute: 0  },
    { name: 'Jupiter', glyph: '♃', longitude: 155, sign: 'Virgo',       degree: 5,  minute: 20 },
    { name: 'Saturn',  glyph: '♄', longitude: 330, sign: 'Pisces',      degree: 0,  minute: 15 },
    { name: 'Uranus',  glyph: '♅', longitude: 19,  sign: 'Aries',       degree: 19, minute: 8  },
    { name: 'Neptune', glyph: '♆', longitude: 355, sign: 'Pisces',      degree: 25, minute: 0  },
    { name: 'Pluto',   glyph: '♇', longitude: 270, sign: 'Capricorn',   degree: 0,  minute: 0  },
  ],
};

const meta = {
  title: 'UI/NatalChartWheel',
  component: NatalChartWheel,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
  args: {
    chart: SAMPLE_CHART,
    size: 300,
    showOuterPlanets: true,
  },
} satisfies Meta<typeof NatalChartWheel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FreeTierOnly: Story = {
  args: { showOuterPlanets: false },
};

export const Small: Story = {
  args: { size: 200 },
};

export const NoAngles: Story = {
  args: {
    chart: { ...SAMPLE_CHART, ascendant: null, midheaven: null },
  },
};
