import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { LoadingState, SkeletonText, SkeletonCard, SkeletonProfile } from './LoadingState';

const meta = {
  title: 'UI/LoadingState',
  component: LoadingState,
  decorators: [
    Story => (
      <View style={{ padding: 16, gap: 12 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    variant: 'text',
    width: '80%',
  },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { variant: 'text', width: '80%' },
};

export const Card: Story = {
  args: { variant: 'card', width: '100%' },
};

export const Avatar: Story = {
  args: { variant: 'avatar', width: 48, height: 48 },
};

export const CustomSize: Story = {
  args: { variant: 'custom', width: 200, height: 60 },
};

export const SkeletonTextPreset: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SkeletonText lines={3} />
    </View>
  ),
};

export const SkeletonCardPreset: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SkeletonCard />
    </View>
  ),
};

export const SkeletonProfilePreset: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SkeletonProfile />
    </View>
  ),
};
