import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Screen } from './Screen';

const LoremContent = () => (
  <View style={{ gap: 16 }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <View key={i} style={{ gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }}>Section {i + 1}</Text>
        <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 20 }}>
          The stars align to reveal a path through the cosmic tapestry. Trust the signals
          the universe is sending your way.
        </Text>
      </View>
    ))}
  </View>
);

const meta = {
  title: 'UI/Screen',
  component: Screen,
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View style={{ flex: 1, height: 600 }}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
  args: {
    children: <LoremContent />,
    scroll: true,
    padding: true,
  },
} satisfies Meta<typeof Screen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scrollable: Story = {
  args: { scroll: true },
};

export const Static: Story = {
  args: { scroll: false },
};

export const NoPadding: Story = {
  args: { padding: false },
};

export const WithTopEdge: Story = {
  args: { edges: ['top', 'bottom'] },
};
