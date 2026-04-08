import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReadingRow } from '@hooks/useReadings';
import type { DrawnCardRecord } from '@/types/tarot';
import { theme } from '@theme';

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
  const isDaily = reading.spread_type === 'daily';
  const first = reading.drawn_cards[0];

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => onPress(reading)}
      accessibilityRole="button"
      accessibilityLabel={buildAccessibilityLabel(reading)}
      accessibilityHint="Double-tap to view full reading"
    >
      <View style={styles.header}>
        <View style={[styles.badge, !isDaily && styles.badgePPF]}>
          <Text style={[styles.badgeText, !isDaily && styles.badgeTextPPF]}>
            {isDaily ? 'Daily Draw' : '3-Card Spread'}
          </Text>
        </View>
        <View style={styles.dateBlock}>
          <Text style={styles.dateText}>{formatDate(reading.created_at)}</Text>
          <Text style={styles.timeText}>{formatTime(reading.created_at)}</Text>
        </View>
      </View>

      {isDaily && first && (
        <View style={styles.cardPreview}>
          <Text style={styles.cardName}>{first.cardName}</Text>
          <Text
            style={[
              styles.orientationText,
              first.orientation === 'reversed' && styles.orientationReversed,
            ]}
          >
            {first.orientation === 'upright' ? '↑ Upright' : '↓ Reversed'}
          </Text>
          <View style={styles.arcanaBadge}>
            <Text style={styles.arcanaText}>{arcanaLabel(first)}</Text>
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
              <View key={pos} style={styles.ppfCell}>
                <Text style={styles.ppfPos}>{pos.toUpperCase()}</Text>
                <Text style={styles.ppfName} numberOfLines={2}>
                  {card.cardName}
                </Text>
                <Text
                  style={[
                    styles.ppfOrientation,
                    card.orientation === 'reversed' && styles.orientationReversed,
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
        <View style={styles.insightPill} accessible accessibilityLabel="AI Insight available">
          <Text style={styles.insightText} accessible={false}>✦ AI Insight</Text>
        </View>
      )}
    </Pressable>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  rowPressed: {
    opacity: 0.85,
    backgroundColor: theme.colors.surface.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  badge: {
    backgroundColor: theme.colors.brand.purple[50],
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgePPF: { backgroundColor: theme.colors.brand.cosmic.sky },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.brand.purple[600],
    letterSpacing: 0.3,
  },
  badgeTextPPF: { color: theme.colors.brand.cosmic.ocean },
  dateBlock: { alignItems: 'flex-end' },
  dateText: { 
    fontSize: theme.typography.fontSize.sm, 
    color: theme.colors.text.secondary, 
    fontWeight: '600' 
  },
  timeText: { 
    fontSize: 11, 
    color: theme.colors.text.muted, 
    marginTop: 1 
  },
  cardPreview: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: theme.spacing.sm, 
    flexWrap: 'wrap' 
  },
  cardName: { 
    fontSize: theme.typography.fontSize.lg, 
    fontWeight: '700', 
    color: theme.colors.text.primary 
  },
  orientationText: { 
    fontSize: theme.typography.fontSize.sm, 
    fontWeight: '600', 
    color: theme.colors.brand.primary 
  },
  orientationReversed: { color: theme.colors.tarot.orientation.reversed },
  arcanaBadge: {
    backgroundColor: theme.colors.surface.subtle,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.radius.sm,
  },
  arcanaText: { 
    fontSize: 11, 
    color: theme.colors.text.muted, 
    fontWeight: '600' 
  },
  ppfPreview: { 
    flexDirection: 'row', 
    gap: theme.spacing.sm 
  },
  ppfCell: {
    flex: 1,
    backgroundColor: theme.colors.surface.subtle,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    gap: 3,
  },
  ppfPos: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.text.muted,
    letterSpacing: 1,
  },
  ppfName: { 
    fontSize: theme.typography.fontSize.xs, 
    fontWeight: '700', 
    color: theme.colors.text.primary, 
    lineHeight: 16 
  },
  ppfOrientation: { 
    fontSize: theme.typography.fontSize.xs, 
    fontWeight: '700', 
    color: theme.colors.brand.primary 
  },
  insightPill: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.tarot.insight.background,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: theme.radius.md,
  },
  insightText: { 
    fontSize: 11, 
    color: theme.colors.tarot.insight.text, 
    fontWeight: '600' 
  },
});
