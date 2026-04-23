import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';
import { Skeleton } from '@components/ui/Skeleton';
import { resolveColor, buildGradientColors } from '@lib/colors/cosmicColors';
import type { useDailyMetaphysical } from '@hooks/useDailyMetaphysical';

const PHASE_EMOJI: Record<string, string> = {
  'New Moon': '🌑',
  'Waxing Crescent': '🌒',
  'First Quarter': '🌓',
  'Waxing Gibbous': '🌔',
  'Full Moon': '🌕',
  'Waning Gibbous': '🌖',
  'Last Quarter': '🌗',
  'Waning Crescent': '🌘',
};

interface CosmicWeatherCardProps {
  cosmic: ReturnType<typeof useDailyMetaphysical>['data'];
  isLoading: boolean;
}

export function Horoscope({ cosmic, isLoading }: CosmicWeatherCardProps) {
  const theme = useAppTheme();
  const DEEP_SPACE = theme.colors.brand.cosmic.deepSpace;

  if (isLoading) {
    return (
      <View style={[styles.card, { backgroundColor: DEEP_SPACE }]}>
        <View style={{ gap: spacing.sm }} accessible accessibilityLabel="Loading cosmic weather">
          <Skeleton width="45%" height={11} borderRadius={4} />
          <Skeleton width="80%" height={22} borderRadius={6} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="90%" height={14} />
          <Skeleton width="50%" height={24} borderRadius={12} style={{ marginTop: 4 }} />
        </View>
      </View>
    );
  }

  if (!cosmic) return null;

  const phaseEmoji = PHASE_EMOJI[cosmic.moon_phase] ?? '🌙';
  const retrogradeText =
    cosmic.retrograde_planets && cosmic.retrograde_planets.length > 0
      ? cosmic.retrograde_planets.map(p => `${p} ℞`).join('  ')
      : null;
  const gradientColors = buildGradientColors(cosmic.lucky_colors);

  return (
    <View style={[styles.card, { backgroundColor: DEEP_SPACE }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.24, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Header row */}
      <View style={styles.cardHeader}>
        <Text style={[styles.cardLabel, { color: theme.colors.brand.cosmic.sunGold }]}>
          DAILY CELESTIAL INSIGHT
        </Text>
      </View>

      <View style={styles.pills}></View>

      {cosmic.energy_theme && (
        <Text style={[styles.energyTheme, { color: theme.colors.brand.cosmic.starWhite }]}>
          {cosmic.energy_theme}
        </Text>
      )}

      {/* Advice */}
      {cosmic.advice && (
        <Text style={[styles.advice, { color: theme.colors.brand.cosmic.moonlight }]}>
          {cosmic.advice}
        </Text>
      )}

      <View
        style={
          (styles.pills,
          {
            flexDirection: 'row',
            gap: spacing.xs,
            alignItems: 'center',
          })
        }
      >
        <Text
          style={[styles.cardPhase, { color: theme.colors.brand.cosmic.moonlight }]}
          accessibilityLabel={cosmic.moon_phase}
        >
          {phaseEmoji} {cosmic.moon_phase}
        </Text>
        {cosmic.moon_sign && (
          <View style={[styles.pill]}>
            <Text style={[styles.pillText, { color: theme.colors.text.primary }]}>
              {cosmic.moon_sign.symbol} {cosmic.moon_sign.name}
            </Text>
          </View>
        )}
      </View>
      <View>
        {retrogradeText && (
          <View style={[styles.pill, styles.pillWarning]}>
            <Text style={[styles.pillText, styles.pillTextWarning]}>{retrogradeText}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '300',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardPhase: {
    fontSize: 13,
    fontWeight: '600',
  },
  energyTheme: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    lineHeight: 28,
    textTransform: 'capitalize',
  },
  advice: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    // marginBottom: spacing.sm,
  },
  pill: {
    borderRadius: borderRadius.badge,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
  },
  pillWarning: {
    backgroundColor: '#3b1f1f',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextWarning: {
    color: '#fca5a5',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.xs,
  },
  colorLabel: {
    fontSize: 11,
    color: '#818cf8',
    fontWeight: '600',
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
