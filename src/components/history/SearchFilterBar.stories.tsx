import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { SearchFilterBar } from './SearchFilterBar';

const meta = {
  title: 'History/SearchFilterBar',
  component: SearchFilterBar,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    query: '',
    onChangeSearch: fn(),
    clearSearch: fn(),
    spreadFilter: 'all',
    setSpreadFilter: fn(),
    dateRangeFilter: 'all',
    setDateRangeFilter: fn(),
    clearAllFilters: fn(),
    resultCount: 12,
    totalCount: 12,
  },
} satisfies Meta<typeof SearchFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithQuery: Story = {
  args: { query: 'The Moon', resultCount: 3 },
};

export const Filtered: Story = {
  args: {
    spreadFilter: 'daily',
    dateRangeFilter: 'this-week',
    resultCount: 4,
  },
};

export const NoResults: Story = {
  args: {
    query: 'judgement',
    resultCount: 0,
  },
};
