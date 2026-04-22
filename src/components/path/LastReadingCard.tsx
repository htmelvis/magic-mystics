import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Card } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { spacing, borderRadius } from '@theme';
import type { ReadingRow } from '@hooks/useReadings';

const SPREAD_LABELS: Record<string, string> = {
  'daily': 'Daily Draw',
  'past-present-future': 'Past · Present · Future',
  'relationship': 'Relationship',
  'situation-obstacle-solution': 'Situation',
  'mind-body-spirit': 'Mind Body Spirit',
  'accept-embrace-let-go': 'Accept & Let Go',
  'path-choice': 'Path & Choice',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

interface LastReadingCardProps {
  reading: ReadingRow | null;
  isLoading: boolean;
  onPress: (reading: ReadingRow) => void;
}

export function LastReadingCard({ reading, isLoading, onPress }: LastReadingCardProps) {
  const theme = useAppTheme();

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Skeleton width="45%" height={11} borderRadius={4} style={{ marginBottom: spacing.md }} />
        <Skeleton width="60%" height={18} borderRadius={4} />
        <Skeleton width="40%" height={14} borderRadius={4} style={{ marginTop: spacing.xs }} />
      </Card>
    );
  }

  if (!reading) return null;

  const label = SPREAD_LABELS[reading.spread_type] ?? reading.spread_type;
  const isDaily = reading.spread_type === 'daily';
  const firstCard = reading.drawn_cards[0];

  return (
    <Pressable
      onPress={() => onPress(reading)}
      accessibilityRole="button"
      accessibilityLabel="Open last reading"
      accessibilityHint="Double-tap to view your most recent reading"
    >
      <Card style={styles.card}>
        <Text style={[styles.sectionLabel, { color: theme.colors.text.muted }]}>LAST READING</Text>

        <View style={styles.row}>
          <View style={[styles.badge, { backgroundColor: isDaily ? theme.colors.brand.purple[50] : theme.colors.brand.cosmic.sky }]}>
            <Text style={[styles.badgeText, { color: isDaily ? theme.colors.brand.purple[600] : theme.colors.brand.cosmic.ocean }]}>
              {label}
            </Text>
          </View>
          <Text style={[styles.date, { color: theme.colors.text.muted }]}>
            {formatDate(reading.created_at)}
          </Text>
        </View>

        {firstCard && (
          <View style={styles.cardPreview}>
            <Text style={[styles.cardName, { color: theme.colors.text.primary }]}>
              {firstCard.cardName}
            </Text>
            <Text
              style={[
                styles.orientation,
                {
                  color:
                    firstCard.orientation === 'reversed'
                      ? theme.colors.tarot.orientation.reversed
                      : theme.colors.brand.primary,
                },
              ]}
            >
              {firstCard.orientation === 'upright' ? '↑ Upright' : '↓ Reversed'}
            </Text>
          </View>
        )}

        {!isDaily && reading.drawn_cards.length > 1 && (
          <Text style={[styles.extraCards, { color: theme.colors.text.muted }]}>
            +{reading.drawn_cards.length - 1} more {reading.drawn_cards.length - 1 === 1 ? 'card' : 'cards'}
          </Text>
        )}

        <View style={styles.tapHint}>
          <Text style={[styles.tapText, { color: theme.colors.text.muted }]}>Tap to view →</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.badge,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
  },
  orientation: {
    fontSize: 13,
    fontWeight: '600',
  },
  extraCards: {
    fontSize: 12,
    fontWeight: '500',
  },
  tapHint: {
    alignSelf: 'flex-end',
  },
  tapText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
