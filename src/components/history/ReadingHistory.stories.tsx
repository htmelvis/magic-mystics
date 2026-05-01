import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { ReadingHistory } from './ReadingHistory';

const meta = {
  title: 'History/ReadingHistory',
  component: ReadingHistory,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    onPress: fn(),
    readingCount: 42,
  },
} satisfies Meta<typeof ReadingHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleReading: Story = {
  args: { readingCount: 1 },
};

export const NoCount: Story = {
  args: { readingCount: undefined },
};

export const HighCount: Story = {
  args: { readingCount: 312 },
};
