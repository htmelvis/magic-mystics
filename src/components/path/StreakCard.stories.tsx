import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { StreakCard } from './StreakCard';

const meta = {
  title: 'Path/StreakCard',
  component: StreakCard,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    currentStreak: 7,
    longestStreak: 21,
    isLoading: false,
  },
} satisfies Meta<typeof StreakCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CurrentBeatsBest: Story = {
  args: { currentStreak: 42, longestStreak: 42 },
};

export const SingleDay: Story = {
  args: { currentStreak: 1, longestStreak: 1 },
};

export const NoCurrentStreak: Story = {
  args: { currentStreak: 0, longestStreak: 14 },
};

export const Loading: Story = {
  args: { isLoading: true },
};
