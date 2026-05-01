import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { AIInsightSection } from './AIInsightSection';
import { UpgradeSheetContext } from '@/context/UpgradeSheetContext';
import type { SingleCardInsight, SpreadInsight } from '@/types/ai-insight';

const SINGLE_INSIGHT: SingleCardInsight = {
  kind: 'single',
  opening: 'The Fool appears at the threshold today — not as warning, but as invitation.',
  card_essence:
    'This card in your reading speaks to the edge of the known. You have been circling a decision, and the Fool asks: what would happen if you simply stepped forward?',
  celestial_overlay:
    'With Mercury direct and the moon waxing, the sky supports new beginnings over analysis. Your instincts today carry more signal than your calculations.',
  guidance:
    'Begin. Not perfectly, not with every detail resolved — begin. The courage is in the first step, not the full map.',
  resonance: 'You already know what to do. You have known for a while.',
};

const SPREAD_INSIGHT: SpreadInsight = {
  kind: 'spread',
  opening:
    'Temperance, the Ace of Cups, and the King of Pentacles form a clear arc: from resolution through opening to mastery.',
  spread_reading:
    'The past position shows Temperance — you have been in a process of integration, learning to hold opposing forces in balance. The present brings the Ace of Cups reversed, suggesting an emotional opportunity not yet fully received. The future King of Pentacles confirms: what you are building has solid ground, if you allow yourself to feel it as you build.',
  guidance:
    'The invitation is to receive, not just to do. Let the emotional current that has been blocked begin to move.',
  resonance: 'What you are building will last. Trust the ground beneath you.',
};

const meta = {
  title: 'Tarot/AIInsightSection',
  component: AIInsightSection,
  decorators: [
    (Story: React.ComponentType) => (
      <UpgradeSheetContext.Provider value={{ open: fn() }}>
        <View style={{ padding: 16 }}>
          <Story />
        </View>
      </UpgradeSheetContext.Provider>
    ),
  ],
  args: {
    insight: SINGLE_INSIGHT,
    isLoading: false,
    isPremium: true,
  },
} satisfies Meta<typeof AIInsightSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleCard: Story = {};

export const Spread: Story = {
  args: { insight: SPREAD_INSIGHT },
};

export const Locked: Story = {
  args: { isPremium: false, insight: null },
};

export const Loading: Story = {
  args: { isLoading: true, insight: null },
};

export const NoInsight: Story = {
  args: { insight: null },
};
