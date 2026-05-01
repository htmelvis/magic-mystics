import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { PremiumUnlockBanner } from './PremiumUnlockBanner';
import { UpgradeSheetContext } from '@/context/UpgradeSheetContext';

const meta = {
  title: 'Promo/PremiumUnlockBanner',
  component: PremiumUnlockBanner,
  decorators: [
    (Story: React.ComponentType) => (
      <UpgradeSheetContext.Provider value={{ open: fn() }}>
        <View style={{ padding: 16 }}>
          <Story />
        </View>
      </UpgradeSheetContext.Provider>
    ),
  ],
} satisfies Meta<typeof PremiumUnlockBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
