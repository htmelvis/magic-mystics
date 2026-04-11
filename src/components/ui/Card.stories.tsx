import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { fn } from 'storybook/test';
import { Card } from './Card';

const CardContent = () => (
  <View style={{ gap: 4 }}>
    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>The Fool</Text>
    <Text style={{ fontSize: 13, color: '#6b7280' }}>New beginnings, innocence, spontaneity</Text>
  </View>
);

const meta = {
  title: 'UI/Card',
  component: Card,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    children: <CardContent />,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: { variant: 'elevated' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Filled: Story = {
  args: { variant: 'filled' },
};

export const Pressable: Story = {
  args: { variant: 'elevated', onPress: fn() },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 12 }}>
      {(['elevated', 'outlined', 'filled'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Text style={{ fontSize: 13, color: '#374151', fontWeight: '500' }}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            A {variant} card container.
          </Text>
        </Card>
      ))}
    </View>
  ),
};
