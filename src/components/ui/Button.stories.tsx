import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { fn } from 'storybook/test';
import { Button } from './Button';
import type { ButtonVariant, ButtonSize } from './Button';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];

const meta = {
  title: 'UI/Button',
  component: Button,
  decorators: [
    Story => (
      <View style={{ padding: 16, gap: 12 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    title: 'Continue',
    onPress: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', title: 'Cancel' },
};

export const Outline: Story = {
  args: { variant: 'outline', title: 'Learn more' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', title: 'Skip' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', title: 'Delete reading' },
};

export const Loading: Story = {
  args: { loading: true, title: 'Saving...' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};

export const WithIconLeft: Story = {
  args: {
    title: 'Shuffle',
    icon: <Text style={{ fontSize: 16 }}>✦</Text>,
    iconPosition: 'left',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 12 }}>
      {VARIANTS.map(variant => (
        <Button key={variant} title={variant} variant={variant} onPress={fn()} />
      ))}
    </View>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 12, alignItems: 'flex-start' }}>
      {SIZES.map(size => (
        <Button key={size} title={`Size ${size.toUpperCase()}`} size={size} onPress={fn()} />
      ))}
    </View>
  ),
};
