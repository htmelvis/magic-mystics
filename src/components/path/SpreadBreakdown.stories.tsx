import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { SpreadBreakdown } from './SpreadBreakdown';
import type { SpreadStat } from '@hooks/useSpreadStats';

const MIXED_STATS: SpreadStat[] = [
  { spreadType: 'daily', count: 61, percentage: 73 },
  { spreadType: 'past-present-future', count: 12, percentage: 14 },
  { spreadType: 'relationship', count: 5, percentage: 6 },
  { spreadType: 'mind-body-spirit', count: 4, percentage: 5 },
  { spreadType: 'path-choice', count: 2, percentage: 2 },
];

const DAILY_ONLY: SpreadStat[] = [{ spreadType: 'daily', count: 30, percentage: 100 }];

const meta = {
  title: 'Path/SpreadBreakdown',
  component: SpreadBreakdown,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    stats: MIXED_STATS,
    isLoading: false,
  },
} satisfies Meta<typeof SpreadBreakdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DailyOnly: Story = {
  args: { stats: DAILY_ONLY },
};

export const AllSpreads: Story = {
  args: {
    stats: [
      { spreadType: 'daily', count: 40, percentage: 48 },
      { spreadType: 'past-present-future', count: 18, percentage: 22 },
      { spreadType: 'relationship', count: 10, percentage: 12 },
      { spreadType: 'mind-body-spirit', count: 8, percentage: 10 },
      { spreadType: 'accept-embrace-let-go', count: 6, percentage: 7 },
    ],
  },
};

export const Empty: Story = {
  args: { stats: [] },
};

export const Loading: Story = {
  args: { isLoading: true },
};
