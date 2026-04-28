import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';
import { Skeleton } from '@components/ui/Skeleton';
import { ZODIAC_THEMES } from '@lib/astrology/zodiac-themes';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';
import type { useDailyHoroscope } from '@hooks/useDailyHoroscope';

interface DailyHoroscopeCardProps {
  horoscope: ReturnType<typeof useDailyHoroscope>['data'];
  isLoading: boolean;
  sunSign: string | null | undefined;
}

export function DailyHoroscopeCard({ horoscope, isLoading, sunSign }: DailyHoroscopeCardProps) {
  const theme = useAppTheme();
  const DEEP_SPACE = theme.colors.brand.cosmic.deepSpace;

  const zodiacTheme = sunSign ? ZODIAC_THEMES[sunSign as ZodiacSign] : null;
  const gradientColors: readonly [string, string, ...string[]] = zodiacTheme
    ? [zodiacTheme.gradient[0], zodiacTheme.gradient[1], DEEP_SPACE]
    : [DEEP_SPACE, '#0d0d1a'];

  if (isLoading) {
    return (
      <View style={[styles.card, { backgroundColor: DEEP_SPACE }]}>
        <View
          style={{ gap: spacing.sm }}
          accessible
          accessibilityLabel="Loading your daily horoscope"
        >
          <Skeleton width="55%" height={11} borderRadius={4} />
          <Skeleton width="70%" height={22} borderRadius={6} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="95%" height={14} />
          <Skeleton width="85%" height={14} />
          <View style={styles.notesRow}>
            <Skeleton width="30%" height={40} borderRadius={borderRadius.card} />
            <Skeleton width="30%" height={40} borderRadius={borderRadius.card} />
            <Skeleton width="30%" height={40} borderRadius={borderRadius.card} />
          </View>
        </View>
      </View>
    );
  }

  if (!horoscope) return null;

  return (
    <View style={[styles.card, { backgroundColor: DEEP_SPACE }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={[styles.cardLabel, { color: theme.colors.brand.cosmic.sunGold }]}>
          YOUR DAILY HOROSCOPE
        </Text>
        {sunSign && (
          <View style={styles.signBadge}>
            <Text style={[styles.signBadgeText, { color: theme.colors.text.primary }]}>
              {zodiacTheme ? ZODIAC_THEMES[sunSign as ZodiacSign]?.glyph : ''} {sunSign}
            </Text>
          </View>
        )}
      </View>

      {/* Theme pill */}
      {horoscope.theme && (
        <View style={styles.themePill}>
          <Text style={[styles.themePillText, { color: theme.colors.brand.cosmic.sunGold }]}>
            {horoscope.theme}
          </Text>
        </View>
      )}

      {/* Headline */}
      {horoscope.headline && (
        <Text style={[styles.headline, { color: theme.colors.brand.cosmic.starWhite }]}>
          {horoscope.headline}
        </Text>
      )}

      {/* Body */}
      {horoscope.body && (
        <Text style={[styles.body, { color: theme.colors.brand.cosmic.moonlight }]}>
          {horoscope.body}
        </Text>
      )}

      {/* Love / Career / Wellness notes */}
      <View style={styles.notesRow}>
        {horoscope.love_note && (
          <View style={[styles.noteCard, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
            <Text style={[styles.noteLabel, { color: theme.colors.brand.cosmic.sunGold }]}>
              Love
            </Text>
            <Text style={[styles.noteText, { color: theme.colors.brand.cosmic.moonlight }]}>
              {horoscope.love_note}
            </Text>
          </View>
        )}
        {horoscope.career_note && (
          <View style={[styles.noteCard, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
            <Text style={[styles.noteLabel, { color: theme.colors.brand.cosmic.sunGold }]}>
              Career
            </Text>
            <Text style={[styles.noteText, { color: theme.colors.brand.cosmic.moonlight }]}>
              {horoscope.career_note}
            </Text>
          </View>
        )}
        {horoscope.wellness_note && (
          <View style={[styles.noteCard, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
            <Text style={[styles.noteLabel, { color: theme.colors.brand.cosmic.sunGold }]}>
              Wellness
            </Text>
            <Text style={[styles.noteText, { color: theme.colors.brand.cosmic.moonlight }]}>
              {horoscope.wellness_note}
            </Text>
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
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '300',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  signBadge: {
    borderRadius: borderRadius.badge,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  signBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  themePill: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.badge,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: spacing.sm,
  },
  themePillText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 26,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  notesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  noteCard: {
    flex: 1,
    minWidth: 90,
    borderRadius: borderRadius.card,
    padding: spacing.sm,
    gap: 4,
  },
  noteLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  noteText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
