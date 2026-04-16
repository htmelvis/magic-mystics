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

export function CosmicWeatherCard({ cosmic, isLoading }: CosmicWeatherCardProps) {
  const theme = useAppTheme();
  const DEEP_SPACE = theme.colors.brand.cosmic.deepSpace;

  if (isLoading) {
    return (
      <LinearGradient colors={[DEEP_SPACE, '#0d0d1a']} style={styles.card}>
        <View
          style={{ gap: spacing.sm }}
          accessible
          accessibilityLabel="Loading cosmic weather"
        >
          <Skeleton width="45%" height={11} borderRadius={4} />
          <Skeleton width="80%" height={22} borderRadius={6} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="90%" height={14} />
          <Skeleton width="50%" height={24} borderRadius={12} style={{ marginTop: 4 }} />
        </View>
      </LinearGradient>
    );
  }

  if (!cosmic) return null;

  const phaseEmoji = PHASE_EMOJI[cosmic.moon_phase] ?? '🌙';
  const retrogradeText =
    cosmic.retrograde_planets && cosmic.retrograde_planets.length > 0
      ? cosmic.retrograde_planets.map(p => `${p} ℞`).join('  ')
      : null;
  const luckyNums = cosmic.lucky_numbers?.slice(0, 4).join(' · ') ?? null;
  const gradientColors = buildGradientColors(cosmic.lucky_colors);

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Header row */}
      <View style={styles.cardHeader}>
        <Text style={[styles.cardLabel, { color: theme.colors.brand.cosmic.stardust }]}>
          Cosmic Weather
        </Text>
        <Text
          style={[styles.cardPhase, { color: theme.colors.brand.cosmic.moonlight }]}
          accessibilityLabel={cosmic.moon_phase}
        >
          {phaseEmoji} {cosmic.moon_phase}
        </Text>
      </View>

      {/* Energy theme */}
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

      {/* Footer pills */}
      <View style={styles.pills}>
        {cosmic.moon_sign && (
          <View style={[styles.pill, { backgroundColor: theme.colors.brand.cosmic.nebula }]}>
            <Text style={[styles.pillText, { color: theme.colors.brand.cosmic.aurora }]}>
              {cosmic.moon_sign.symbol} {cosmic.moon_sign.name}
            </Text>
          </View>
        )}
        {retrogradeText && (
          <View style={[styles.pill, styles.pillWarning]}>
            <Text style={[styles.pillText, styles.pillTextWarning]}>{retrogradeText}</Text>
          </View>
        )}
        {luckyNums && (
          <View style={[styles.pill, { backgroundColor: theme.colors.brand.cosmic.nebula }]}>
            <Text style={[styles.pillText, { color: theme.colors.brand.cosmic.aurora }]}>
              🎲 {luckyNums}
            </Text>
          </View>
        )}
      </View>

      {/* Lucky colors */}
      {cosmic.lucky_colors && cosmic.lucky_colors.length > 0 && (
        <View
          style={styles.colorRow}
          accessible
          accessibilityLabel={`Today's colors: ${cosmic.lucky_colors.join(', ')}`}
        >
          <Text style={styles.colorLabel} accessible={false}>Today's colors </Text>
          {cosmic.lucky_colors.map(c => (
            <View
              key={c}
              style={[styles.colorSwatch, { backgroundColor: resolveColor(c) }]}
              accessible={false}
            />
          ))}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
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
    marginBottom: spacing.sm,
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
