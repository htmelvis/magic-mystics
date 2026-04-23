import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';
import { Skeleton } from '@components/ui/Skeleton';
import type { DailyPlanetaryAlignment } from '@/types/metaphysical';

interface PlanetaryAlignmentCardProps {
  alignment: DailyPlanetaryAlignment | null;
  isLoading: boolean;
}

export function PlanetaryAlignmentCard({
  alignment,
  isLoading,
  showFull = false,
}: PlanetaryAlignmentCardProps & { showFull?: boolean }) {
  const theme = useAppTheme();
  const DEEP_SPACE = theme.colors.brand.cosmic.deepSpace;

  if (isLoading) {
    return (
      <View style={[styles.card, { backgroundColor: DEEP_SPACE }]}>
        <View
          style={{ gap: spacing.sm }}
          accessible
          accessibilityLabel="Loading planetary alignment"
        >
          <Skeleton width="45%" height={11} borderRadius={4} />
          <Skeleton width="60%" height={26} borderRadius={6} />
          <Skeleton width="85%" height={14} />
          {showFull && (
            <View style={styles.pillRow}>
              <Skeleton width={80} height={24} borderRadius={12} />
              <Skeleton width={90} height={24} borderRadius={12} />
              <Skeleton width={70} height={24} borderRadius={12} />
            </View>
          )}
        </View>
      </View>
    );
  }

  if (!alignment) return null;

  const planetLabel = alignment.dominant_planet_symbol
    ? `${alignment.dominant_planet_symbol} ${alignment.dominant_planet} in ${alignment.dominant_planet_sign}`
    : `${alignment.dominant_planet} in ${alignment.dominant_planet_sign}`;

  const retrogradeText =
    alignment.all_planet_positions
      ?.filter(p => p.isRetrograde)
      .map(p => `${p.symbol ?? p.planet} ℞`)
      .join('  ') ?? null;

  return (
    <View style={[styles.card, { backgroundColor: DEEP_SPACE }]}>
      <LinearGradient
        colors={['rgba(99,102,241,0.18)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Text style={[styles.label, { color: theme.colors.brand.cosmic.stardust }]}>
        PLANETARY ALIGNMENT
      </Text>

      <Text
        style={[styles.planetLine, { color: theme.colors.brand.cosmic.starWhite }]}
        accessibilityRole="header"
      >
        {planetLabel}
      </Text>

      {alignment.alignment_theme && (
        <Text style={[styles.theme, { color: theme.colors.brand.cosmic.moonlight }]}>
          {alignment.alignment_theme}
        </Text>
      )}

      {showFull && alignment.advice && (
        <Text style={[styles.advice, { color: theme.colors.text.primary }]}>
          {alignment.advice}
        </Text>
      )}

      {showFull && alignment.supported_endeavors && alignment.supported_endeavors.length > 0 && (
        <>
          <Text
            style={[
              styles.label,
              { color: theme.colors.brand.cosmic.stardust, marginBottom: 0, marginTop: 8 },
            ]}
          >
            Supported Endeavors
          </Text>
          <View style={styles.pillRow} accessibilityLabel="Supported endeavors">
            {alignment.supported_endeavors.map((endeavor: string, i: number) => (
              <View key={endeavor}>
                <Text style={[styles.pillText, { color: theme.colors.brand.cosmic.stardust }]}>
                  {endeavor + `${(alignment.supported_endeavors?.length ?? 0) == i + 1 ? '' : ','}`}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {showFull && retrogradeText && (
        <View style={[styles.pill, styles.pillWarning]}>
          <Text style={[styles.pillText, styles.pillTextWarning]}>{retrogradeText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    gap: spacing.xs,
  },
  label: {
    fontSize: 10,
    fontWeight: '300',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  planetLine: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  theme: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  advice: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  pill: {
    borderRadius: borderRadius.badge,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  pillWarning: {
    backgroundColor: '#3b1f1f',
    alignSelf: 'flex-start',
  },
  pillTextWarning: {
    color: '#fca5a5',
  },
});
