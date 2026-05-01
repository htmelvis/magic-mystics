import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { Toast } from './Toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ height: 300, backgroundColor: '#111' }}>
        <Story />
      </View>
    ),
  ],
  args: {
    id: 'toast-default',
    type: 'info',
    title: 'Reading saved',
    message: 'Your daily draw has been added to your history.',
    onDismiss: fn(),
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Feature: Story = {
  args: {
    type: 'feature',
    title: 'New: 3-Card Spreads',
    message: 'Explore past, present, and future in a single reading.',
  },
};

export const CTA: Story = {
  args: {
    type: 'cta',
    title: 'Unlock Premium',
    message: 'Get AI-powered insights and unlimited readings.',
    actionLabel: 'Learn More',
    onAction: fn(),
  },
};

export const TitleOnly: Story = {
  args: { message: undefined },
};

export const AutoDismiss: Story = {
  args: {
    type: 'info',
    title: 'Saved',
    autoDismissMs: 3000,
  },
};
