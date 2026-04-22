import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Card } from '@components/ui/Card';
import { Skeleton } from '@components/ui/Skeleton';
import { spacing, borderRadius } from '@theme';

interface JourneyStatsGridProps {
  readings: number;
  reflections: number;
  daysActive: number;
  isLoading: boolean;
}

interface StatTileProps {
  value: number;
  label: string;
  color: string;
}

function StatTile({ value, label, color }: StatTileProps) {
  const theme = useAppTheme();
  return (
    <View style={[styles.tile, { backgroundColor: theme.colors.surface.subtle, borderColor: theme.colors.border.subtle }]}>
      <Text style={[styles.tileValue, { color }]}>{value}</Text>
      <Text style={[styles.tileLabel, { color: theme.colors.text.secondary }]}>{label}</Text>
    </View>
  );
}

export function JourneyStatsGrid({ readings, reflections, daysActive, isLoading }: JourneyStatsGridProps) {
  const theme = useAppTheme();

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Skeleton width="35%" height={11} borderRadius={4} style={{ marginBottom: spacing.md }} />
        <View style={styles.grid}>
          <Skeleton width="30%" height={72} borderRadius={12} />
          <Skeleton width="30%" height={72} borderRadius={12} />
          <Skeleton width="30%" height={72} borderRadius={12} />
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text style={[styles.sectionLabel, { color: theme.colors.text.muted }]}>YOUR JOURNEY</Text>
      <View style={styles.grid}>
        <StatTile value={readings} label="readings" color={theme.colors.brand.primary} />
        <StatTile value={reflections} label="reflections" color={theme.colors.brand.cosmic.ocean} />
        <StatTile value={daysActive} label="days active" color={theme.colors.brand.cosmic.sunGold} />
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
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  tileValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
