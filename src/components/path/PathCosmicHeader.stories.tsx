import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { PathCosmicHeader } from './PathCosmicHeader';
import type { DailyMetaphysical } from '@hooks/useDailyMetaphysical';
import type { UserProfile } from '@/types/user';

const COSMIC: DailyMetaphysical = {
  date: '2026-04-29',
  moon_phase: 'Waxing Gibbous',
  moon_special_name: null,
  retrograde_planets: ['Mercury'],
  lucky_numbers: [4, 9, 17, 33, 41],
  lucky_colors: ['indigo', 'violet'],
  energy_theme: 'Deliberate Vision',
  advice:
    'The waxing gibbous moon brings your intentions into sharper focus. What you started at the new moon is gaining momentum — refine rather than redirect.',
  moon_sign: { name: 'Scorpio', symbol: '♏', element: 'water' },
};

const BASE_PROFILE: UserProfile = {
  id: 'user-1',
  email: 'ed@htmelvis.com',
  displayName: 'Edward',
  avatarUrl: null,
  birthDate: '1990-04-11',
  birthTime: '09:30:00',
  birthLocation: 'New York, NY',
  birthLat: 40.7128,
  birthLng: -74.006,
  birthTimezone: 'America/New_York',
  birthDetailsEditedAt: null,
  sunSign: 'Aries',
  moonSign: 'Scorpio',
  risingSign: 'Capricorn',
  natalChartData: null,
  tarotCard: null,
  onboardingCompleted: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-04-01T00:00:00Z',
};

const meta = {
  title: 'Path/PathCosmicHeader',
  component: PathCosmicHeader,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    cosmic: COSMIC,
    userProfile: BASE_PROFILE,
    isLoading: false,
  },
} satisfies Meta<typeof PathCosmicHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MoonInNatalSign: Story = {
  // Moon in Scorpio matches user's natal moonSign — shows the ✦ pill
  args: { userProfile: { ...BASE_PROFILE, moonSign: 'Scorpio' } },
};

export const MoonMatchesSunAndMoon: Story = {
  args: {
    userProfile: { ...BASE_PROFILE, sunSign: 'Scorpio', moonSign: 'Scorpio' },
  },
};

export const MultipleRetrogrades: Story = {
  args: {
    cosmic: {
      ...COSMIC,
      retrograde_planets: ['Mercury', 'Saturn', 'Neptune'],
    },
  },
};

export const FullMoon: Story = {
  args: {
    cosmic: {
      ...COSMIC,
      moon_phase: 'Full Moon',
      energy_theme: 'Peak Illumination',
      advice:
        'The full moon in Scorpio draws hidden truths to the surface. Sit with what is revealed before you respond.',
      retrograde_planets: null,
      lucky_colors: ['gold', 'amber'],
    },
  },
};

export const Loading: Story = {
  args: { isLoading: true, cosmic: null },
};

export const NoData: Story = {
  args: { cosmic: null },
};
