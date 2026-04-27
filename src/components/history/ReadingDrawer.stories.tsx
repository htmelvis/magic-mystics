/**
 * ReadingDrawer stories.
 *
 * The drawer uses useAuth + useReflection internally (both hit Supabase), so
 * hooks will return null/loading in Storybook. Stories cover:
 *   - Drawer open states (daily / PPF)
 *   - Reflection display section in isolation (pure render, no live hooks)
 *   - Drawer hidden / closed
 *
 * The reflection section is rendered directly in the last few stories so the
 * visual output can be verified without a live Supabase session.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet, Text } from 'react-native';
import { fn } from 'storybook/test';
import { ReadingDrawer } from './ReadingDrawer';
import type { ReadingRow } from '@hooks/useReadings';
import { theme } from '@theme';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const DAILY_READING: ReadingRow = {
  id: 'reading-daily-1',
  spread_type: 'daily',
  drawn_cards: [
    {
      cardId: 1,
      cardName: 'The Fool',
      arcana: 'Major',
      suit: null,
      orientation: 'upright',
      position: null,
    },
  ],
  ai_insight: null,
  created_at: '2026-04-11T09:00:00Z',
};

const DAILY_READING_WITH_INSIGHT: ReadingRow = {
  ...DAILY_READING,
  id: 'reading-daily-2',
  ai_insight:
    'The Fool invites you to trust the leap. Today carries the energy of fresh starts — a moment to release what you know and step into what could be.',
};

const PPF_READING: ReadingRow = {
  id: 'reading-ppf-1',
  spread_type: 'past-present-future',
  drawn_cards: [
    {
      cardId: 2,
      cardName: 'The High Priestess',
      arcana: 'Major',
      suit: null,
      orientation: 'upright',
      position: 'past',
    },
    {
      cardId: 14,
      cardName: 'Temperance',
      arcana: 'Major',
      suit: null,
      orientation: 'reversed',
      position: 'present',
    },
    {
      cardId: 57,
      cardName: 'Eight of Cups',
      arcana: 'Minor',
      suit: 'Cups',
      orientation: 'upright',
      position: 'future',
    },
  ],
  ai_insight: null,
  created_at: '2026-04-10T20:15:00Z',
};

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'History/ReadingDrawer',
  component: ReadingDrawer,
  decorators: [
    Story => (
      <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <Story />
      </View>
    ),
  ],
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof ReadingDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Drawer states ─────────────────────────────────────────────────────────────

export const DailyDraw: Story = {
  args: { reading: DAILY_READING },
};

export const DailyDrawWithAIInsight: Story = {
  args: { reading: DAILY_READING_WITH_INSIGHT },
};

export const PPFSpread: Story = {
  args: { reading: PPF_READING },
};

export const Closed: Story = {
  args: { reading: null },
};

// ── Reflection display — isolated ─────────────────────────────────────────────
//
// useReflection returns null in Storybook (no live session), so the reflection
// section won't appear in the live drawer above. These stories render the
// reflection block directly so every visual state can be reviewed.

const SENTIMENT_ICON: Record<string, string> = {
  positive: '👍',
  neutral: '😐',
  negative: '👎',
};

interface ReflectionDisplayProps {
  feeling: 'positive' | 'neutral' | 'negative' | null;
  alignment: 'positive' | 'neutral' | 'negative' | null;
  content: string;
}

function ReflectionDisplay({ feeling, alignment, content }: ReflectionDisplayProps) {
  return (
    <View style={reflectionStyles.box}>
      <Text style={reflectionStyles.label}>✦ Your Reflection</Text>
      <View style={reflectionStyles.sentimentRow}>
        <View style={reflectionStyles.sentimentItem}>
          <Text style={reflectionStyles.sentimentCaption}>Feeling</Text>
          <Text style={reflectionStyles.sentimentIcon}>
            {feeling ? SENTIMENT_ICON[feeling] : '—'}
          </Text>
        </View>
        <View style={reflectionStyles.sentimentDivider} />
        <View style={reflectionStyles.sentimentItem}>
          <Text style={reflectionStyles.sentimentCaption}>Alignment</Text>
          <Text style={reflectionStyles.sentimentIcon}>
            {alignment ? SENTIMENT_ICON[alignment] : '—'}
          </Text>
        </View>
      </View>
      {content.length > 0 && <Text style={reflectionStyles.content}>{content}</Text>}
    </View>
  );
}

const reflectionStyles = StyleSheet.create({
  box: {
    backgroundColor: theme.colors.brand.purple[50],
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.brand.purple[200],
    margin: theme.spacing.xl,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.primaryDark,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.brand.purple[100],
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  sentimentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    gap: 4,
  },
  sentimentDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.brand.purple[100],
  },
  sentimentCaption: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sentimentIcon: { fontSize: 22 },
  content: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 21,
  },
});

export const ReflectionPositiveBothNoText: StoryObj = {
  render: () => <ReflectionDisplay feeling="positive" alignment="positive" content="" />,
};

export const ReflectionMixedWithText: StoryObj = {
  render: () => (
    <ReflectionDisplay
      feeling="positive"
      alignment="neutral"
      content="The Fool felt surprisingly apt today. Starting something new always feels chaotic but this reading reminded me to trust the leap into the unknown."
    />
  ),
};

export const ReflectionNegativeBothLongText: StoryObj = {
  render: () => (
    <ReflectionDisplay
      feeling="negative"
      alignment="negative"
      content="This reading felt jarring — the Tower showed up exactly when I didn't want disruption. But I know deep down that what's falling away needed to go. Still uncomfortable to sit with."
    />
  ),
};

export const ReflectionSentimentsOnlyNullContent: StoryObj = {
  render: () => <ReflectionDisplay feeling="neutral" alignment="positive" content="" />,
};
