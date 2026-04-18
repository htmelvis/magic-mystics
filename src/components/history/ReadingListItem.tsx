import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReadingRow } from '@hooks/useReadings';
import type { DrawnCardRecord } from '@/types/tarot';
import { spacing, borderRadius } from '@theme';
import { useAppTheme } from '@/hooks/useAppTheme';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function arcanaLabel(card: DrawnCardRecord): string {
  return card.arcana === 'Major' ? 'Major Arcana' : (card.suit ?? 'Minor Arcana');
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ReadingListItemProps {
  reading: ReadingRow;
  onPress: (r: ReadingRow) => void;
}

function buildAccessibilityLabel(reading: ReadingRow): string {
  const dateStr = formatDate(reading.created_at);
  if (reading.spread_type === 'daily') {
    const first = reading.drawn_cards[0];
    if (first) {
      return `Daily Draw, ${first.cardName}, ${first.orientation}, ${dateStr}`;
    }
    return `Daily Draw, ${dateStr}`;
  }
  const names = reading.drawn_cards.map((c) => c.cardName).join(', ');
  return `3-Card Spread, ${names}, ${dateStr}`;
}

export function ReadingListItem({ reading, onPress }: ReadingListItemProps) {
  const theme = useAppTheme();
  const isDaily = reading.spread_type === 'daily';
  const first = reading.drawn_cards[0];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed
            ? theme.colors.surface.subtle
            : theme.colors.surface.card,
          borderColor: theme.colors.border.subtle,
        },
      ]}
      onPress={() => onPress(reading)}
      accessibilityRole="button"
      accessibilityLabel={buildAccessibilityLabel(reading)}
      accessibilityHint="Double-tap to view full reading"
    >
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isDaily ? theme.colors.brand.purple[50] : theme.colors.brand.cosmic.sky },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isDaily ? theme.colors.brand.purple[600] : theme.colors.brand.cosmic.ocean },
            ]}
          >
            {isDaily ? 'Daily Draw' : '3-Card Spread'}
          </Text>
        </View>
        <View style={styles.dateBlock}>
          <Text style={[styles.dateText, { color: theme.colors.text.secondary }]}>
            {formatDate(reading.created_at)}
          </Text>
          <Text style={[styles.timeText, { color: theme.colors.text.muted }]}>
            {formatTime(reading.created_at)}
          </Text>
        </View>
      </View>

      {isDaily && first && (
        <View style={styles.cardPreview}>
          <Text style={[styles.cardName, { color: theme.colors.text.primary }]}>
            {first.cardName}
          </Text>
          <Text
            style={[
              styles.orientationText,
              {
                color: first.orientation === 'reversed'
                  ? theme.colors.tarot.orientation.reversed
                  : theme.colors.brand.primary,
              },
            ]}
          >
            {first.orientation === 'upright' ? '↑ Upright' : '↓ Reversed'}
          </Text>
          <View
            style={[
              styles.arcanaBadge,
              {
                backgroundColor: theme.colors.surface.subtle,
                borderColor: theme.colors.border.subtle,
              },
            ]}
          >
            <Text style={[styles.arcanaText, { color: theme.colors.text.muted }]}>
              {arcanaLabel(first)}
            </Text>
          </View>
        </View>
      )}

      {!isDaily && (
        <View style={styles.ppfPreview}>
          {(['past', 'present', 'future'] as const).map((pos, i) => {
            const card =
              reading.drawn_cards.find((c) => c.position === pos) ?? reading.drawn_cards[i];
            if (!card) return null;
            return (
              <View
                key={pos}
                style={[
                  styles.ppfCell,
                  {
                    backgroundColor: theme.colors.surface.subtle,
                    borderColor: theme.colors.border.light,
                  },
                ]}
              >
                <Text style={[styles.ppfPos, { color: theme.colors.text.muted }]}>
                  {pos.toUpperCase()}
                </Text>
                <Text style={[styles.ppfName, { color: theme.colors.text.primary }]} numberOfLines={2}>
                  {card.cardName}
                </Text>
                <Text
                  style={[
                    styles.ppfOrientation,
                    {
                      color: card.orientation === 'reversed'
                        ? theme.colors.tarot.orientation.reversed
                        : theme.colors.brand.primary,
                    },
                  ]}
                >
                  {card.orientation === 'upright' ? '↑' : '↓'}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {reading.ai_insight && (
        <View
          style={[styles.insightPill, { backgroundColor: theme.colors.tarot.insight.background }]}
          accessible
          accessibilityLabel="AI Insight available"
        >
          <Text style={[styles.insightText, { color: theme.colors.tarot.insight.text }]} accessible={false}>
            ✦ AI Insight
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dateBlock: { alignItems: 'flex-end' },
  dateText: { fontSize: 14, fontWeight: '600' },
  timeText: { fontSize: 11, marginTop: 1 },
  cardPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  cardName: { fontSize: 18, fontWeight: '700' },
  orientationText: { fontSize: 14, fontWeight: '600' },
  arcanaBadge: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  arcanaText: { fontSize: 11, fontWeight: '600' },
  ppfPreview: { flexDirection: 'row', gap: spacing.sm },
  ppfCell: {
    flex: 1,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    gap: 3,
  },
  ppfPos: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  ppfName: { fontSize: 12, fontWeight: '700', lineHeight: 16 },
  ppfOrientation: { fontSize: 12, fontWeight: '700' },
  insightPill: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
  },
  insightText: { fontSize: 11, fontWeight: '600' },
});
