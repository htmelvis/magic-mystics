import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
  SkeletonProfile,
  SkeletonRow,
} from './Skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  decorators: [
    Story => (
      <View style={{ padding: 16, gap: 12 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    width: '80%',
    height: 16,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tall: Story = {
  args: { height: 48 },
};

export const Circle: Story = {
  args: { width: 56, height: 56, circle: true },
};

export const TextPreset: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SkeletonText lines={3} />
    </View>
  ),
};

export const CirclePreset: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SkeletonCircle size={64} />
    </View>
  ),
};

export const CardPreset: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SkeletonCard />
    </View>
  ),
};

export const ProfilePreset: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SkeletonProfile />
    </View>
  ),
};

export const RowPreset: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  ),
};
