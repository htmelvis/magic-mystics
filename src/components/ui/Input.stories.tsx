import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { fn } from 'storybook/test';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ padding: 16, gap: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    placeholder: 'Enter text…',
    onChangeText: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Email address', placeholder: 'you@example.com' },
};

export const WithHint: Story = {
  args: {
    label: 'Birth time',
    hint: 'Use 24-hour format, e.g. 14:30',
    placeholder: '09:00',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email address',
    error: 'That email address is not valid',
    value: 'not-an-email',
  },
};

export const WithValue: Story = {
  args: { label: 'Display name', value: 'Edward' },
};

export const WithLeftIcon: Story = {
  args: {
    label: 'Location',
    placeholder: 'Search for your city',
    leftIcon: <Text style={{ fontSize: 16 }}>📍</Text>,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: '••••••••',
    secureTextEntry: true,
  },
};
