import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { ErrorBoundary } from './ErrorBoundary';

/** Helper that throws on first render to trigger the boundary */
function BrokenComponent({ message }: { message?: string }): React.ReactElement {
  throw new Error(message ?? 'Something went wrong in this component.');
}

const meta = {
  title: 'UI/ErrorBoundary',
  component: ErrorBoundary,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = {
  args: {
    children: (
      <View style={{ alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 16, color: '#374151' }}>Content rendered normally</Text>
      </View>
    ),
  },
};

export const WithError: Story = {
  args: {
    children: <BrokenComponent />,
  },
};

export const WithCustomFallbackTitle: Story = {
  args: {
    fallbackTitle: 'Unable to load reading',
    children: <BrokenComponent message="Network request failed" />,
  },
};
