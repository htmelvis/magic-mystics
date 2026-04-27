import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Card } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { spacing, borderRadius } from '@theme';
import type { SpreadStat } from '@hooks/useSpreadStats';
import type { ReadingRow } from '@hooks/useReadings';

const SPREAD_LABELS: Record<string, string> = {
  daily: 'Daily Draw',
  'past-present-future': 'Past · Present · Future',
  relationship: 'Relationship',
  'situation-obstacle-solution': 'Situation',
  'mind-body-spirit': 'Mind Body Spirit',
  'accept-embrace-let-go': 'Accept & Let Go',
  'path-choice': 'Path & Choice',
};

function spreadLabel(type: ReadingRow['spread_type']): string {
  return SPREAD_LABELS[type] ?? type;
}

interface SpreadBreakdownProps {
  stats: SpreadStat[];
  isLoading: boolean;
}

export function SpreadBreakdown({ stats, isLoading }: SpreadBreakdownProps) {
  const theme = useAppTheme();

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Skeleton width="45%" height={11} borderRadius={4} style={{ marginBottom: spacing.md }} />
        {[1, 2, 3].map(i => (
          <View key={i} style={{ gap: spacing.xs, marginBottom: spacing.sm }}>
            <View style={styles.rowHeader}>
              <Skeleton width="50%" height={13} borderRadius={4} />
              <Skeleton width="10%" height={13} borderRadius={4} />
            </View>
            <Skeleton width="100%" height={6} borderRadius={3} />
          </View>
        ))}
      </Card>
    );
  }

  if (stats.length === 0) return null;

  const top = stats.slice(0, 5);

  return (
    <Card style={styles.card}>
      <Text style={[styles.sectionLabel, { color: theme.colors.text.muted }]}>SPREAD TYPES</Text>
      <View style={styles.list}>
        {top.map(({ spreadType, count, percentage }) => (
          <View key={spreadType} style={styles.item}>
            <View style={styles.rowHeader}>
              <Text style={[styles.spreadName, { color: theme.colors.text.primary }]}>
                {spreadLabel(spreadType)}
              </Text>
              <Text style={[styles.countText, { color: theme.colors.text.muted }]}>{count}</Text>
            </View>
            <View
              style={[
                styles.track,
                {
                  backgroundColor: theme.colors.surface.subtle,
                  borderColor: theme.colors.border.subtle,
                },
              ]}
            >
              <View
                style={[
                  styles.fill,
                  {
                    width: `${percentage}%`,
                    backgroundColor: theme.colors.brand.primary,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  item: {
    gap: 6,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spreadName: {
    fontSize: 13,
    fontWeight: '600',
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
  },
  track: {
    height: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
