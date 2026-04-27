import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Badge } from './Badge';
import type { BadgeVariant, BadgeSize } from './Badge';

const VARIANTS: BadgeVariant[] = ['default', 'primary', 'success', 'warning', 'error', 'outline'];
const SIZES: BadgeSize[] = ['sm', 'md', 'lg'];

const meta = {
  title: 'UI/Badge',
  component: Badge,
  decorators: [
    Story => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  args: {
    label: 'Premium',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Default', variant: 'default' },
};

export const Primary: Story = {
  args: { label: 'Premium', variant: 'primary' },
};

export const Success: Story = {
  args: { label: 'Active', variant: 'success' },
};

export const Warning: Story = {
  args: { label: 'Expiring soon', variant: 'warning' },
};

export const Error: Story = {
  args: { label: 'Expired', variant: 'error' },
};

export const Outline: Story = {
  args: { label: 'Free', variant: 'outline' },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      {VARIANTS.map(variant => (
        <Badge key={variant} label={variant} variant={variant} />
      ))}
    </View>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 }}>
      {SIZES.map(size => (
        <Badge key={size} label={size.toUpperCase()} variant="primary" size={size} />
      ))}
    </View>
  ),
};
