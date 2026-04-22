import { useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useUserProfile } from '@hooks/useUserProfile';
import { useDailyMetaphysical } from '@hooks/useDailyMetaphysical';
import { useDailyPlanetaryAlignment } from '@hooks/useDailyPlanetaryAlignment';
import { useJourneyStats } from '@hooks/useJourneyStats';
import { useStreak } from '@hooks/useStreak';
import { useSpreadStats } from '@hooks/useSpreadStats';
import { useReadings } from '@hooks/useReadings';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen } from '@components/ui/Screen';
import { ReadingDrawer } from '@/components/history/ReadingDrawer';
import { PathCosmicHeader } from '@/components/path/PathCosmicHeader';
import { PlanetaryAlignmentCard } from '@/components/path/PlanetaryAlignmentCard';
import { StreakCard } from '@/components/path/StreakCard';
import { JourneyStatsGrid } from '@/components/path/JourneyStatsGrid';
import { MonthlyActivityChart } from '@/components/path/MonthlyActivityChart';
import { SpreadBreakdown } from '@/components/path/SpreadBreakdown';
import { LastReadingCard } from '@/components/path/LastReadingCard';
import { HistoryAccessCard } from '@/components/path/HistoryAccessCard';
import { spacing } from '@theme';
import type { ReadingRow } from '@hooks/useReadings';

export default function PathScreen() {
  const { user } = useAuth();
  const { limits } = useSubscription(user?.id);
  const { userProfile } = useUserProfile(user?.id);
  const { data: cosmic, isLoading: cosmicLoading } = useDailyMetaphysical();
  const { data: planetary, isLoading: planetaryLoading } = useDailyPlanetaryAlignment();
  const { data: stats, isLoading: statsLoading } = useJourneyStats(user?.id);
  const { data: streak, isLoading: streakLoading } = useStreak(user?.id);
  const { data: spreadStats, isLoading: spreadLoading } = useSpreadStats(user?.id);
  const { data: readingsData, isLoading: readingsLoading } = useReadings(user?.id, limits.maxReadingHistory);
  const router = useRouter();
  const theme = useAppTheme();

  const [selectedReading, setSelectedReading] = useState<ReadingRow | null>(null);

  const lastReading = useMemo(
    () => readingsData?.pages[0]?.[0] ?? null,
    [readingsData]
  );

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Path</Text>
      </View>

      <PathCosmicHeader
        cosmic={cosmic}
        userProfile={userProfile}
        isLoading={cosmicLoading}
      />

      <PlanetaryAlignmentCard alignment={planetary} isLoading={planetaryLoading} />

      <StreakCard
        currentStreak={streak?.currentStreak ?? 0}
        longestStreak={streak?.longestStreak ?? 0}
        isLoading={streakLoading}
      />

      <JourneyStatsGrid
        readings={stats?.readings ?? 0}
        reflections={stats?.reflections ?? 0}
        daysActive={stats?.daysActive ?? 0}
        isLoading={statsLoading}
      />

      <LastReadingCard
        reading={lastReading}
        isLoading={readingsLoading}
        onPress={setSelectedReading}
      />

      <MonthlyActivityChart
        data={streak?.monthlyActivity ?? []}
        isLoading={streakLoading}
      />

      <SpreadBreakdown
        stats={spreadStats ?? []}
        isLoading={spreadLoading}
      />

      <HistoryAccessCard
        readingCount={stats?.readings ?? 0}
        onPress={() => router.push('/history')}
      />

      <ReadingDrawer
        reading={selectedReading}
        onClose={() => setSelectedReading(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
