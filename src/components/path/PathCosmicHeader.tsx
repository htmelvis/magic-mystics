import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';
import { Skeleton } from '@components/ui/Skeleton';
import { buildGradientColors } from '@lib/colors/cosmicColors';
import type { DailyMetaphysical } from '@hooks/useDailyMetaphysical';
import type { UserProfile } from '@/types/user';

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

interface PathCosmicHeaderProps {
  cosmic: DailyMetaphysical | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

export function PathCosmicHeader({ cosmic, userProfile, isLoading }: PathCosmicHeaderProps) {
  const theme = useAppTheme();
  const DEEP_SPACE = theme.colors.brand.cosmic.deepSpace;

  if (isLoading) {
    return (
      <View style={[styles.card, { backgroundColor: DEEP_SPACE }]}>
        <View style={{ gap: spacing.sm }} accessible accessibilityLabel="Loading your sky">
          <Skeleton width="40%" height={11} borderRadius={4} />
          <Skeleton width="75%" height={22} borderRadius={6} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="55%" height={24} borderRadius={12} style={{ marginTop: 4 }} />
        </View>
      </View>
    );
  }

  if (!cosmic) return null;

  const phaseEmoji = PHASE_EMOJI[cosmic.moon_phase] ?? '🌙';
  const currentMoonSign = cosmic.moon_sign?.name ?? null;

  const natalMatches: string[] = [];
  if (currentMoonSign) {
    if (currentMoonSign === userProfile?.moonSign) natalMatches.push('natal Moon');
    if (currentMoonSign === userProfile?.sunSign) natalMatches.push('natal Sun');
    if (currentMoonSign === userProfile?.risingSign) natalMatches.push('natal Rising');
  }

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

      <Text style={[styles.label, { color: theme.colors.brand.cosmic.sunGold }]}>
        YOUR SKY TODAY
      </Text>

      {cosmic.energy_theme && (
        <Text style={[styles.energyTheme, { color: theme.colors.brand.cosmic.starWhite }]}>
          {cosmic.energy_theme}
        </Text>
      )}

      {cosmic.advice && (
        <Text style={[styles.advice, { color: theme.colors.brand.cosmic.moonlight }]}>
          {cosmic.advice}
        </Text>
      )}

      <View style={styles.pillRow}>
        <Text
          style={[styles.phase, { color: theme.colors.brand.cosmic.moonlight }]}
          accessibilityLabel={cosmic.moon_phase}
        >
          {phaseEmoji} {cosmic.moon_phase}
        </Text>
        {cosmic.moon_sign && (
          <View style={styles.pill}>
            <Text style={[styles.pillText, { color: theme.colors.text.primary }]}>
              {cosmic.moon_sign.symbol} {cosmic.moon_sign.name}
            </Text>
          </View>
        )}
      </View>

      {natalMatches.length > 0 && (
        <View style={[styles.pill, styles.natalPill]}>
          <Text style={[styles.pillText, styles.natalPillText]}>
            ✦ Moon in your {natalMatches.join(' & ')}
          </Text>
        </View>
      )}

      {retrogradeText && (
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
  energyTheme: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'capitalize',
  },
  advice: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.xs,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  phase: {
    fontSize: 13,
    fontWeight: '600',
  },
  pill: {
    borderRadius: borderRadius.badge,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  natalPill: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    alignSelf: 'flex-start',
  },
  natalPillText: {
    color: '#c4b5fd',
  },
  pillWarning: {
    backgroundColor: '#3b1f1f',
    alignSelf: 'flex-start',
  },
  pillTextWarning: {
    color: '#fca5a5',
  },
});
