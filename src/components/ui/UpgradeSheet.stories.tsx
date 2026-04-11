import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { UpgradeSheet } from './UpgradeSheet';

const meta = {
  title: 'UI/UpgradeSheet',
  component: UpgradeSheet,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    isVisible: true,
    onClose: fn(),
    onUpgradePress: fn(),
    isPurchasing: false,
  },
} satisfies Meta<typeof UpgradeSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Purchasing: Story = {
  args: { isPurchasing: true },
};

export const Hidden: Story = {
  args: { isVisible: false },
};
