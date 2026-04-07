import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '@theme';
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
  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator
          color={theme.colors.brand.cosmic.moonlight}
          size="small"
          style={{ marginVertical: theme.spacing.lg }}
        />
      </View>
    );
  }

  if (!cosmic) return null;

  const phaseEmoji = PHASE_EMOJI[cosmic.moon_phase] ?? '🌙';
  const retrogradeText =
    cosmic.retrograde_planets && cosmic.retrograde_planets.length > 0
      ? cosmic.retrograde_planets.map(p => `${p} ℞`).join('  ')
      : null;
  const luckyNums = cosmic.lucky_numbers?.slice(0, 4).join(' · ') ?? null;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardLabel}>Cosmic Weather</Text>
        <Text style={styles.cardPhase}>
          {phaseEmoji} {cosmic.moon_phase}
        </Text>
      </View>

      {/* Energy theme */}
      {cosmic.energy_theme && <Text style={styles.energyTheme}>{cosmic.energy_theme}</Text>}

      {/* Advice */}
      {cosmic.advice && <Text style={styles.advice}>{cosmic.advice}</Text>}

      {/* Footer pills */}
      <View style={styles.pills}>
        {cosmic.moon_sign && (
          <View style={styles.pill}>
            <Text style={styles.pillText}>
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
          <View style={styles.pill}>
            <Text style={styles.pillText}>🎲 {luckyNums}</Text>
          </View>
        )}
      </View>

      {/* Lucky colors */}
      {cosmic.lucky_colors && cosmic.lucky_colors.length > 0 && (
        <View style={styles.colorRow}>
          <Text style={styles.colorLabel}>Today's colors </Text>
          {cosmic.lucky_colors.map(c => (
            <View key={c} style={styles.colorDot}>
              <Text style={styles.colorDotText}>{c}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.brand.cosmic.deepSpace,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
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
    color: theme.colors.brand.cosmic.stardust,
  },
  cardPhase: {
    fontSize: 13,
    color: theme.colors.brand.cosmic.moonlight,
    fontWeight: '600',
  },
  energyTheme: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.brand.cosmic.starWhite,
    marginBottom: theme.spacing.sm,
    lineHeight: 28,
  },
  advice: {
    fontSize: 14,
    color: theme.colors.brand.cosmic.moonlight,
    lineHeight: 21,
    marginBottom: theme.spacing.md,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  pill: {
    backgroundColor: theme.colors.brand.cosmic.nebula,
    borderRadius: theme.borderRadius.badge,
    paddingVertical: 5,
    paddingHorizontal: theme.spacing.sm,
  },
  pillWarning: {
    backgroundColor: '#3b1f1f',
  },
  pillText: {
    fontSize: 12,
    color: theme.colors.brand.cosmic.aurora,
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
  },
  colorLabel: {
    fontSize: 11,
    color: '#818cf8',
    fontWeight: '600',
  },
  colorDot: {
    backgroundColor: theme.colors.brand.cosmic.nebula,
    paddingVertical: 3,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  colorDotText: {
    fontSize: 11,
    color: theme.colors.brand.cosmic.aurora,
  },
});
