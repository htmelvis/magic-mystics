import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { DailyHoroscopeCard } from './DailyHoroscopeCard';
import type { DailyHoroscope } from '@hooks/useDailyHoroscope';

const FULL_HOROSCOPE: DailyHoroscope = {
  date: '2026-04-29',
  sign: 'Aries',
  headline: 'Bold action cuts through the noise today',
  body: 'Mars, your ruler, forms a powerful trine to Jupiter in Gemini, expanding your reach and sharpening your instincts. This is not a day to wait — the cosmic weather favors those who move first. A conversation or decision you have been circling finally reaches its moment of clarity. Trust the fire within you.',
  theme: 'bold moves',
  love_note: 'A direct expression of how you feel lands better than you expect — say it.',
  career_note: 'Pitch the idea. The timing is more favorable than it appears from the inside.',
  wellness_note: 'Channel restless energy into movement; a brisk walk resets your nervous system.',
};

const PISCES_HOROSCOPE: DailyHoroscope = {
  date: '2026-04-29',
  sign: 'Pisces',
  headline: 'Dreams dissolve into quiet revelation',
  body: 'Neptune, your ruler, deepens its hold on your imagination as the moon waxes in Scorpio — a fellow water sign that amplifies intuitive knowing. You may feel things before you can name them. Let that be enough for now. What surfaces in stillness today carries more signal than anything in your schedule.',
  theme: 'inner knowing',
  love_note: 'A quiet act of care — a note, a gesture — says more than lengthy conversation.',
  career_note: 'Trust the unconventional angle; your lateral thinking is your edge right now.',
  wellness_note: 'Protect your sleep boundary tonight; restoration is where the real work happens.',
};

const LEO_HOROSCOPE: DailyHoroscope = {
  date: '2026-04-29',
  sign: 'Leo',
  headline: 'Your light is needed — step into it',
  body: 'The Sun conjuncts Venus in your chart zone of reputation and recognition, making this a standout day for visibility. Others notice your warmth before you notice theirs. Lead with generosity rather than seeking approval and you will find the admiration you crave arrives naturally.',
  theme: 'radiance',
  love_note:
    'Romance is favored — plan something that feels like a celebration, not an obligation.',
  career_note: 'Take credit for your contributions today; false modesty costs you real momentum.',
  wellness_note:
    'Your heart literally and figuratively needs joy — laugh more than you usually allow.',
};

const meta = {
  title: 'Home/DailyHoroscopeCard',
  component: DailyHoroscopeCard,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    horoscope: FULL_HOROSCOPE,
    isLoading: false,
    sunSign: 'Aries',
  },
} satisfies Meta<typeof DailyHoroscopeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { isLoading: true, horoscope: null },
};

export const NoData: Story = {
  args: { horoscope: null },
};

export const Pisces: Story = {
  args: { horoscope: PISCES_HOROSCOPE, sunSign: 'Pisces' },
};

export const Leo: Story = {
  args: { horoscope: LEO_HOROSCOPE, sunSign: 'Leo' },
};

export const PartialData: Story = {
  args: {
    horoscope: {
      ...FULL_HOROSCOPE,
      theme: null,
      love_note: null,
      career_note: null,
      wellness_note: null,
    },
  },
};
