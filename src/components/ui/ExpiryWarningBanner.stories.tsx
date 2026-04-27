import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { ExpiryWarningBanner } from './ExpiryWarningBanner';
import type { ReadingExpiryState } from '@hooks/useReadingExpiry';

const baseExpiry: ReadingExpiryState = {
  expiringCount: 3,
  daysUntilOldest: 5,
  isDismissed: false,
  dismiss: fn(),
  isLoading: false,
};

const meta = {
  title: 'UI/ExpiryWarningBanner',
  component: ExpiryWarningBanner,
  decorators: [
    Story => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    expiry: baseExpiry,
    onUpgradePress: fn(),
  },
} satisfies Meta<typeof ExpiryWarningBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Urgent: Story = {
  args: {
    expiry: { ...baseExpiry, expiringCount: 1, daysUntilOldest: 1 },
  },
};

export const ExpiringToday: Story = {
  args: {
    expiry: { ...baseExpiry, expiringCount: 2, daysUntilOldest: 0 },
  },
};

export const ManyReadings: Story = {
  args: {
    expiry: { ...baseExpiry, expiringCount: 12, daysUntilOldest: 6 },
  },
};

/** Renders nothing — banner is hidden after dismiss */
export const Dismissed: Story = {
  args: {
    expiry: { ...baseExpiry, isDismissed: true },
  },
};
