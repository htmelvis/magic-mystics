import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Card } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { spacing, borderRadius } from '@theme';

const BAR_MAX_HEIGHT = 56;

interface MonthlyActivityChartProps {
  data: { month: string; count: number }[];
  isLoading: boolean;
}

export function MonthlyActivityChart({ data, isLoading }: MonthlyActivityChartProps) {
  const theme = useAppTheme();

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Skeleton width="40%" height={11} borderRadius={4} style={{ marginBottom: spacing.md }} />
        <View style={styles.chart}>
          {[0.4, 0.7, 1, 0.6, 0.8, 0.5].map((h, i) => (
            <View key={i} style={styles.barCol}>
              <Skeleton width={28} height={BAR_MAX_HEIGHT * h} borderRadius={6} />
              <Skeleton width={24} height={10} borderRadius={4} style={{ marginTop: 6 }} />
            </View>
          ))}
        </View>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const currentMonth = new Date().toLocaleDateString(undefined, { month: 'short' });

  return (
    <Card style={styles.card}>
      <Text style={[styles.sectionLabel, { color: theme.colors.text.muted }]}>MONTHLY ACTIVITY</Text>
      <View style={styles.chart}>
        {data.map(({ month, count }) => {
          const height = Math.max((count / maxCount) * BAR_MAX_HEIGHT, count > 0 ? 6 : 3);
          const isCurrentMonth = month === currentMonth;
          return (
            <View key={month} style={styles.barCol}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor: isCurrentMonth
                        ? theme.colors.brand.primary
                        : theme.colors.brand.purple[200],
                    },
                  ]}
                  accessibilityLabel={`${month}: ${count} readings`}
                />
              </View>
              <Text
                style={[
                  styles.monthLabel,
                  {
                    color: isCurrentMonth
                      ? theme.colors.brand.primary
                      : theme.colors.text.muted,
                    fontWeight: isCurrentMonth ? '700' : '400',
                  },
                ]}
              >
                {month}
              </Text>
              {count > 0 && (
                <Text style={[styles.countLabel, { color: theme.colors.text.muted }]}>{count}</Text>
              )}
            </View>
          );
        })}
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
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barWrapper: {
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 28,
    borderRadius: borderRadius.sm,
  },
  monthLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  countLabel: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
});
