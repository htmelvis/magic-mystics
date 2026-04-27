import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { Button } from '@components/ui/Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  decorators: [
    Story => (
      <View style={{ padding: 16, gap: 12 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: { onPress: fn(), title: 'Button' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Small: Story = {
  args: { size: 'sm' },
};
