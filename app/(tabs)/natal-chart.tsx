import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { useUserProfile } from '@hooks/useUserProfile';
import { useSubscription } from '@hooks/useSubscription';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { NatalChartWheel } from '@components/ui';
import { computeNatalChart, FREE_PLANETS, PREMIUM_PLANETS } from '@lib/astrology/natal-chart';
import { supabase } from '@lib/supabase/client';
import { spacing, borderRadius } from '@theme';
import type { StoredNatalChart } from '@lib/astrology/natal-chart';

const FREE_SET = new Set<string>(FREE_PLANETS);

export default function NatalChartScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const { userProfile, loading } = useUserProfile(user?.id);
  const { isPremium } = useSubscription(user?.id);
  const { open: openUpgradeSheet } = useUpgradeSheet();
  const queryClient = useQueryClient();
  const theme = useAppTheme();

  const [showOuterPlanets, setShowOuterPlanets] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  const wheelSize = Math.min(width - 32, 340);

  const chart: StoredNatalChart | null = userProfile?.natalChartData ?? null;

  const handleToggleOuter = () => {
    if (!isPremium) {
      openUpgradeSheet();
      return;
    }
    setShowOuterPlanets((v) => !v);
  };

  const handleRecalculate = useCallback(async () => {
    if (!user || !userProfile?.birthDate || !userProfile?.birthTime) return;
    setRecalculating(true);
    try {
      const [year, month, day] = userProfile.birthDate.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day, 12, 0, 0);
      const newChart = computeNatalChart(
        birthDate,
        userProfile.birthTime,
        userProfile.birthLat,
        userProfile.birthLng,
      );
      await supabase
        .from('users')
        .update({ natal_chart_data: newChart } as never)
        .eq('id', user.id);
      await queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
    } finally {
      setRecalculating(false);
    }
  }, [user, userProfile, queryClient]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.surface.background }]}>
        <ActivityIndicator color={theme.colors.brand.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface.elevated,
            borderBottomColor: theme.colors.border.main,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backText, { color: theme.colors.brand.primary }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Natal Chart</Text>
        {/* Extended planets toggle */}
        <Pressable
          onPress={handleToggleOuter}
          style={[
            styles.toggleButton,
            {
              borderColor: showOuterPlanets ? theme.colors.brand.primary : theme.colors.border.main,
              backgroundColor: showOuterPlanets
                ? theme.colors.brand.primaryMuted
                : theme.colors.surface.card,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={isPremium ? 'Toggle extended planets' : 'Upgrade to unlock extended planets'}
          accessibilityState={{ selected: showOuterPlanets }}
        >
          <Text
            style={[
              styles.toggleText,
              { color: showOuterPlanets ? theme.colors.brand.primary : theme.colors.text.secondary },
            ]}
          >
            {isPremium ? (showOuterPlanets ? '♃♄✓' : '♃♄') : '♃♄ 🔒'}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!chart ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>No chart yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.text.secondary }]}>
              {userProfile?.birthDate && userProfile?.birthTime
                ? 'Tap below to generate your natal chart.'
                : 'Complete your birth details in profile to generate your chart.'}
            </Text>
            {userProfile?.birthDate && userProfile?.birthTime && (
              <Pressable
                style={[styles.generateButton, { backgroundColor: theme.colors.brand.primary }]}
                onPress={handleRecalculate}
                disabled={recalculating}
                accessibilityRole="button"
                accessibilityLabel="Generate natal chart"
              >
                {recalculating
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.generateButtonText}>Generate Chart</Text>
                }
              </Pressable>
            )}
          </View>
        ) : (
          <>
            {/* Wheel */}
            <NatalChartWheel
              chart={chart}
              size={wheelSize}
              showOuterPlanets={showOuterPlanets}
            />

            {/* ASC / MC note */}
            {chart.ascendant === null && (
              <Text style={[styles.noAnglesNote, { color: theme.colors.text.muted }]}>
                Add your birth location in Profile to show the Ascendant & Midheaven lines.
              </Text>
            )}

            {/* Planet list */}
            <View
              style={[
                styles.planetList,
                {
                  backgroundColor: theme.colors.surface.card,
                  borderColor: theme.colors.border.main,
                },
              ]}
            >
              <Text
                style={[
                  styles.listHeader,
                  {
                    color: theme.colors.brand.primary,
                    borderBottomColor: theme.colors.border.subtle,
                  },
                ]}
              >
                Planets
              </Text>
              {chart.planets.map((planet) => {
                const isFree = FREE_SET.has(planet.name);
                const isRevealed = isFree || (isPremium && showOuterPlanets);
                return (
                  <View
                    key={planet.name}
                    style={[
                      styles.planetRow,
                      { borderBottomColor: theme.colors.border.subtle },
                      !isRevealed && styles.planetRowDimmed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.planetGlyph,
                        { color: theme.colors.text.primary },
                        !isRevealed && { color: theme.colors.text.muted },
                      ]}
                    >
                      {planet.glyph}
                    </Text>
                    <Text
                      style={[
                        styles.planetName,
                        { color: theme.colors.text.primary },
                        !isRevealed && { color: theme.colors.text.muted },
                      ]}
                    >
                      {planet.name}
                    </Text>
                    <Text
                      style={[
                        styles.planetPosition,
                        { color: theme.colors.text.secondary },
                        !isRevealed && { color: theme.colors.text.muted },
                      ]}
                    >
                      {isRevealed
                        ? `${planet.sign}  ${planet.degree}°${planet.minute.toString().padStart(2, '0')}′`
                        : 'Premium'}
                    </Text>
                  </View>
                );
              })}

              {/* ASC / MC rows */}
              {chart.ascendant !== null && (
                <View style={[styles.planetRow, { borderBottomColor: theme.colors.border.subtle }]}>
                  <Text style={[styles.planetGlyph, { color: theme.colors.text.primary }]}>↑</Text>
                  <Text style={[styles.planetName, { color: theme.colors.text.primary }]}>Ascendant</Text>
                  <Text style={[styles.planetPosition, { color: theme.colors.text.secondary }]}>
                    {(() => {
                      const lon = chart.ascendant!;
                      const sign = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                        'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][Math.floor(lon/30)];
                      const deg = Math.floor(lon % 30);
                      const min = Math.floor((lon % 1) * 60);
                      return `${sign}  ${deg}°${min.toString().padStart(2,'0')}′`;
                    })()}
                  </Text>
                </View>
              )}
              {chart.midheaven !== null && (
                <View style={[styles.planetRow, { borderBottomColor: theme.colors.border.subtle }]}>
                  <Text style={[styles.planetGlyph, { color: theme.colors.text.primary }]}>MC</Text>
                  <Text style={[styles.planetName, { color: theme.colors.text.primary }]}>Midheaven</Text>
                  <Text style={[styles.planetPosition, { color: theme.colors.text.secondary }]}>
                    {(() => {
                      const lon = chart.midheaven!;
                      const sign = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                        'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][Math.floor(lon/30)];
                      const deg = Math.floor(lon % 30);
                      const min = Math.floor((lon % 1) * 60);
                      return `${sign}  ${deg}°${min.toString().padStart(2,'0')}′`;
                    })()}
                  </Text>
                </View>
              )}
            </View>

            {/* Recalculate */}
            <Pressable
              style={[styles.recalcButton, { borderColor: theme.colors.brand.primary }]}
              onPress={handleRecalculate}
              disabled={recalculating}
              accessibilityRole="button"
              accessibilityLabel="Recalculate natal chart"
            >
              {recalculating
                ? <ActivityIndicator color={theme.colors.brand.primary} size="small" />
                : <Text style={[styles.recalcText, { color: theme.colors.brand.primary }]}>Recalculate</Text>
              }
            </Pressable>

            <Text style={[styles.computedAt, { color: theme.colors.text.muted }]}>
              Computed {new Date(chart.computedAt).toLocaleDateString()}
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  backText: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  toggleText: { fontSize: 13, fontWeight: '600' },
  content: { padding: 16, paddingBottom: 48, alignItems: 'center', gap: 20 },
  emptyState: { alignItems: 'center', gap: 12, paddingTop: 48 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold' },
  emptySubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  generateButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    marginTop: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  generateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  noAnglesNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  planetList: {
    width: '100%',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  planetRowDimmed: { opacity: 0.45 },
  planetGlyph: { fontSize: 18, width: 24, textAlign: 'center' },
  planetName: { fontSize: 14, fontWeight: '500', flex: 1 },
  planetPosition: { fontSize: 14 },
  recalcButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 140,
    alignItems: 'center',
  },
  recalcText: { fontSize: 14, fontWeight: '600' },
  computedAt: { fontSize: 11, fontStyle: 'italic' },
});
