import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { MonthlyActivityChart } from './MonthlyActivityChart';

const SIX_MONTHS = [
  { month: 'Nov', count: 3 },
  { month: 'Dec', count: 8 },
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 7 },
  { month: 'Mar', count: 19 },
  { month: 'Apr', count: 24 },
];

const meta = {
  title: 'Path/MonthlyActivityChart',
  component: MonthlyActivityChart,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    data: SIX_MONTHS,
    isLoading: false,
  },
} satisfies Meta<typeof MonthlyActivityChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HighActivity: Story = {
  args: {
    data: [
      { month: 'Nov', count: 28 },
      { month: 'Dec', count: 31 },
      { month: 'Jan', count: 31 },
      { month: 'Feb', count: 29 },
      { month: 'Mar', count: 31 },
      { month: 'Apr', count: 30 },
    ],
  },
};

export const SparseThenBurst: Story = {
  args: {
    data: [
      { month: 'Nov', count: 0 },
      { month: 'Dec', count: 1 },
      { month: 'Jan', count: 0 },
      { month: 'Feb', count: 2 },
      { month: 'Mar', count: 0 },
      { month: 'Apr', count: 22 },
    ],
  },
};

export const NewUser: Story = {
  args: {
    data: [
      { month: 'Nov', count: 0 },
      { month: 'Dec', count: 0 },
      { month: 'Jan', count: 0 },
      { month: 'Feb', count: 0 },
      { month: 'Mar', count: 0 },
      { month: 'Apr', count: 3 },
    ],
  },
};

export const Loading: Story = {
  args: { isLoading: true },
};
