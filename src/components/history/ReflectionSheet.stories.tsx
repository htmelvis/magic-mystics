import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { ReflectionSheet } from './ReflectionSheet';

const meta = {
  title: 'History/ReflectionSheet',
  component: ReflectionSheet,
  decorators: [
    Story => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    visible: true,
    isSaving: false,
    onSave: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof ReflectionSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// Step 1 — feeling picker, nothing selected yet
export const StepOneEmpty: Story = {};

// Step 1 pre-seeded (editing an existing reflection)
export const StepOnePreseeded: Story = {
  args: {
    initialFeeling: 'positive',
  },
};

// Step 2 — alignment picker, seeded so Next was clickable
export const StepTwoPreseeded: Story = {
  args: {
    initialFeeling: 'positive',
    initialAlignment: 'neutral',
  },
};

// Step 3 — free-text entry with prior content
export const StepThreeWithContent: Story = {
  args: {
    initialFeeling: 'positive',
    initialAlignment: 'positive',
    initialContent:
      'The Fool felt surprisingly apt today. Starting something new always feels chaotic but this reading reminded me to trust the leap.',
  },
};

// Saving in progress — Save button shows spinner text and is disabled
export const Saving: Story = {
  args: {
    initialFeeling: 'neutral',
    initialAlignment: 'positive',
    initialContent: 'Something stirred.',
    isSaving: true,
  },
};

// Hidden — sheet not visible
export const Hidden: Story = {
  args: { visible: false },
};
