import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, borderRadius } from '@theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useUpgradeSheet } from '@/context/UpgradeSheetContext';
import type { AIInsight, SingleCardInsight, SpreadInsight } from '@/types/ai-insight';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  insight: AIInsight | null;
  isLoading: boolean;
  isPremium: boolean;
}

interface Section {
  label: string | null;
  text: string;
  isResonance?: boolean;
  order?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSections(insight: AIInsight): Section[] {
  if (insight.kind === 'single') {
    const s = insight as SingleCardInsight;
    return [
      { label: null, text: s.opening, order: 1 },
      { label: 'THE CARD & YOU', text: s.card_essence, order: 2 },
      { label: 'CELESTIAL', text: s.celestial_overlay, order: 3 },
      { label: 'GUIDANCE', text: s.guidance, order: 4 },
      { label: null, text: s.resonance, isResonance: true, order: 0 },
    ];
  }

  if (insight.kind === 'spread') {
    const s = insight as SpreadInsight;
    return [
      { label: null, text: s.opening, order: 1 },
      { label: 'THE READING', text: s.spread_reading, order: 2 },
      { label: 'GUIDANCE', text: s.guidance, order: 3 },
      { label: null, text: s.resonance, isResonance: true, order: 0 },
    ];
  }

  return [];
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function InsightSkeleton() {
  const theme = useAppTheme();
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const bg = theme.colors.tarot.insight.background;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, borderColor: theme.colors.tarot.insight.border },
      ]}
    >
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.skeletonLabel,
            { backgroundColor: theme.colors.tarot.insight.border, opacity: pulse },
          ]}
        />
      </View>
      <Animated.View style={{ opacity: pulse, gap: spacing.md }}>
        <View
          style={[
            styles.skeletonLine,
            { width: '90%', backgroundColor: theme.colors.tarot.insight.border },
          ]}
        />
        <View
          style={[
            styles.skeletonLine,
            { width: '75%', backgroundColor: theme.colors.tarot.insight.border },
          ]}
        />
        <View
          style={[
            styles.skeletonLine,
            {
              width: '82%',
              backgroundColor: theme.colors.tarot.insight.border,
              marginTop: spacing.xs,
            },
          ]}
        />
        <View
          style={[
            styles.skeletonLine,
            { width: '68%', backgroundColor: theme.colors.tarot.insight.border },
          ]}
        />
        <View
          style={[
            styles.skeletonLine,
            { width: '55%', backgroundColor: theme.colors.tarot.insight.border },
          ]}
        />
        <View
          style={[
            styles.skeletonResonance,
            { backgroundColor: theme.colors.tarot.insight.border, marginTop: spacing.sm },
          ]}
        />
      </Animated.View>
    </View>
  );
}

// ── Locked ────────────────────────────────────────────────────────────────────

function InsightLocked() {
  const theme = useAppTheme();
  const { open } = useUpgradeSheet();

  return (
    <Pressable
      onPress={open}
      style={({ pressed }) => [
        styles.container,
        styles.lockedContainer,
        {
          backgroundColor: theme.colors.subscription.premium.background,
          borderColor: theme.colors.subscription.premium.border,
        },
        pressed && styles.lockedPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Unlock AI Reading — upgrade to Premium"
    >
      <Text style={styles.lockedIcon}>✦</Text>
      <Text style={[styles.lockedTitle, { color: theme.colors.subscription.premium.text }]}>
        Insights from the Oracle
      </Text>
      <Text style={[styles.lockedBody, { color: theme.colors.subscription.premium.text }]}>
        Upgrade to Premium for a personalized AI reading that weaves your birth chart, the cards,
        and today's celestial energy into a single insight.
      </Text>
      <View style={[styles.lockedCta, { backgroundColor: theme.colors.brand.accent }]}>
        <Text style={styles.lockedCtaText}>Unlock with Premium</Text>
      </View>
    </Pressable>
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

function InsightContent({ insight }: { insight: AIInsight }) {
  const theme = useAppTheme();
  const sections = getSections(insight).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const anims = useRef(sections.map(() => new Animated.Value(0))).current;
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const animations = anims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 420,
        delay: i * 500,
        useNativeDriver: true,
      })
    );

    Animated.stagger(500, animations).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.tarot.insight.background,
          borderColor: theme.colors.tarot.insight.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerLabel, { color: theme.colors.tarot.insight.text }]}>
          ✦ From the Oracle
        </Text>
      </View>

      <View style={styles.sectionsContainer}>
        {sections.map((section, i) => {
          if (section.isResonance) {
            return (
              <Animated.View
                key={i}
                style={[
                  styles.resonanceBlock,
                  {
                    borderColor: theme.colors.brand.accent,
                    opacity: anims[i],
                    transform: [
                      {
                        scale: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.resonanceText, { color: theme.colors.tarot.insight.text }]}>
                  "{section.text}"
                </Text>
              </Animated.View>
            );
          }

          return (
            <Animated.View key={i} style={{ opacity: anims[i] }}>
              {section.label && (
                <Text style={[styles.sectionLabel, { color: theme.colors.tarot.insight.text }]}>
                  {section.label}
                </Text>
              )}
              <Text
                style={
                  section.label === null
                    ? [styles.openingText, { color: theme.colors.tarot.insight.text }]
                    : section.label === 'GUIDANCE'
                      ? [styles.guidanceText, { color: theme.colors.tarot.insight.text }]
                      : [styles.bodyText, { color: theme.colors.tarot.insight.text }]
                }
              >
                {section.text}
              </Text>
              {i < sections.length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: theme.colors.tarot.insight.border }]}
                />
              )}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function AIInsightSection({ insight, isLoading, isPremium }: Props) {
  if (isLoading) return <InsightSkeleton />;
  if (!isPremium) return <InsightLocked />;
  if (!insight) return null;
  return <InsightContent insight={insight} />;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    marginBottom: spacing.xs,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionsContainer: {
    gap: spacing.md,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    opacity: 0.6,
  },
  openingText: {
    fontSize: 15,
    lineHeight: 23,
    fontStyle: 'italic',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 23,
  },
  guidanceText: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginTop: spacing.md,
    opacity: 0.4,
  },
  resonanceBlock: {
    borderLeftWidth: 3,
    paddingLeft: spacing.md,
    marginTop: spacing.xs,
  },
  resonanceText: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  // Skeleton
  skeletonLabel: {
    height: 10,
    width: 80,
    borderRadius: borderRadius.sm,
  },
  skeletonLine: {
    height: 12,
    borderRadius: borderRadius.sm,
  },
  skeletonResonance: {
    height: 40,
    width: '70%',
    borderRadius: borderRadius.sm,
    alignSelf: 'center',
  },
  // Locked
  lockedContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  lockedPressed: {
    opacity: 0.85,
  },
  lockedIcon: {
    fontSize: 20,
    color: '#c9a84c',
  },
  lockedTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  lockedBody: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  lockedCta: {
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  lockedCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
