import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Card } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { spacing } from '@theme';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
}

export function StreakCard({ currentStreak, longestStreak, isLoading }: StreakCardProps) {
  const theme = useAppTheme();

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <View style={styles.row}>
          <Skeleton width="40%" height={40} borderRadius={8} />
          <Skeleton width="40%" height={40} borderRadius={8} />
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text style={[styles.sectionLabel, { color: theme.colors.text.muted }]}>READING STREAK</Text>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={[styles.value, { color: theme.colors.brand.primary }]}>{currentStreak}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
            {currentStreak === 1 ? 'day active' : 'days active'}
          </Text>
          <Text style={[styles.subLabel, { color: theme.colors.text.muted }]}>current</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.border.light }]} />
        <View style={styles.stat}>
          <Text style={[styles.value, { color: theme.colors.brand.cosmic.sunGold }]}>
            {longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
            {longestStreak === 1 ? 'day' : 'days'}
          </Text>
          <Text style={[styles.subLabel, { color: theme.colors.text.muted }]}>best streak</Text>
        </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  value: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 44,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 52,
    marginHorizontal: spacing.md,
  },
});
