/**
 * Tarot draw algorithm stories.
 *
 * Demonstrates the three draw paths:
 *   - drawDailyCard: deterministic seeded draw (same result for a given user + date)
 *   - drawCard: cryptographically random single card
 *   - drawSpread: cryptographically random multi-card draw
 *
 * Uses a standard 78-card deck (IDs 1–78). Real card names come from the
 * database at runtime; stories show the numeric IDs to keep them self-contained.
 */

import type { StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { drawDailyCard, drawCard, drawSpread } from './draw';
import type { DrawResult } from './draw';
import { theme } from '@theme';

const ALL_IDS = Array.from({ length: 78 }, (_, i) => i + 1);
const DEMO_USER_ID = 'story-user-demo-uuid-1234';

// ── Daily card demo — deterministic ──────────────────────────────────────────

function DailyCardDemo() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const draws = [
    { label: 'Yesterday', date: yesterday },
    { label: 'Today', date: today },
    { label: 'Tomorrow', date: tomorrow },
  ].map(({ label, date }) => ({
    label,
    result: drawDailyCard(ALL_IDS, DEMO_USER_ID, date),
  }));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Daily Card (deterministic)</Text>
      <Text style={styles.sectionNote}>Same userId + date always returns the same card.</Text>
      {draws.map(({ label, result }) => (
        <View key={label} style={styles.resultRow}>
          <Text style={styles.resultLabel}>{label}</Text>
          <Text style={styles.resultValue}>
            Card #{result.cardId} · {result.orientation}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ── Live draw demos — cryptographically random ────────────────────────────────

function LiveDrawDemo() {
  const [single, setSingle] = useState<DrawResult<number> | null>(null);
  const [spread, setSpread] = useState<DrawResult<number>[] | null>(null);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Live Draws (random)</Text>

      <Pressable style={styles.button} onPress={() => setSingle(drawCard(ALL_IDS))}>
        <Text style={styles.buttonText}>Draw Single Card</Text>
      </Pressable>

      {single && (
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Single</Text>
          <Text style={styles.resultValue}>
            Card #{single.cardId} · {single.orientation}
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.button, { marginTop: 8 }]}
        onPress={() => setSpread(drawSpread(ALL_IDS, 3))}
      >
        <Text style={styles.buttonText}>Draw 3-Card Spread</Text>
      </Pressable>

      {spread && (
        <View style={styles.spreadResult}>
          {spread.map((card, i) => (
            <View key={i} style={styles.spreadCard}>
              <Text style={styles.spreadPosition}>Position {i + 1}</Text>
              <Text style={styles.resultValue}>Card #{card.cardId}</Text>
              <Text style={styles.spreadOrientation}>{card.orientation}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ── Spread size demo ──────────────────────────────────────────────────────────

function SpreadSizesDemo() {
  const sizes = [1, 3, 5, 10];
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Spread Sizes</Text>
      {sizes.map(n => {
        const result = drawSpread(ALL_IDS, n, { allowReversals: false });
        return (
          <View key={n} style={styles.resultRow}>
            <Text style={styles.resultLabel}>
              {n} card{n > 1 ? 's' : ''}
            </Text>
            <Text style={styles.resultValue}>[{result.map(r => `#${r.cardId}`).join(', ')}]</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.brand.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionNote: {
    fontSize: 11,
    color: theme.colors.text.muted,
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  resultLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 13,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  spreadResult: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  spreadCard: {
    flex: 1,
    backgroundColor: theme.colors.surface.subtle,
    borderRadius: theme.radius.md,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  spreadPosition: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  spreadOrientation: {
    fontSize: 10,
    color: theme.colors.text.muted,
    textTransform: 'capitalize',
  },
});

export default {
  title: 'Tarot/DrawAlgorithm',
};

export const DailyDeterministic: StoryObj = {
  render: () => (
    <View style={{ padding: 16 }}>
      <DailyCardDemo />
    </View>
  ),
};

export const LiveDraw: StoryObj = {
  render: () => (
    <View style={{ padding: 16 }}>
      <LiveDrawDemo />
    </View>
  ),
};

export const SpreadSizes: StoryObj = {
  render: () => (
    <View style={{ padding: 16 }}>
      <SpreadSizesDemo />
    </View>
  ),
};

export const AllPaths: StoryObj = {
  render: () => (
    <View style={{ padding: 16 }}>
      <DailyCardDemo />
      <LiveDrawDemo />
      <SpreadSizesDemo />
    </View>
  ),
};
