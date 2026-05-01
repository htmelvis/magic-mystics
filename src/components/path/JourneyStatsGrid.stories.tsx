import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { JourneyStatsGrid } from './JourneyStatsGrid';

const meta = {
  title: 'Path/JourneyStatsGrid',
  component: JourneyStatsGrid,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    readings: 84,
    reflections: 31,
    daysActive: 47,
    isLoading: false,
  },
} satisfies Meta<typeof JourneyStatsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NewUser: Story = {
  args: { readings: 1, reflections: 0, daysActive: 1 },
};

export const PowerUser: Story = {
  args: { readings: 512, reflections: 204, daysActive: 365 },
};

export const Loading: Story = {
  args: { isLoading: true },
};
