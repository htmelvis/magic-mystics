import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { DrawnCardRecord } from '@/types/tarot';
import { spacing, borderRadius } from '@theme';
import { useAppTheme } from '@/hooks/useAppTheme';

// ── Helpers ───────────────────────────────────────────────────────────────────

function arcanaLabel(card: DrawnCardRecord): string {
  return card.arcana === 'Major' ? 'Major Arcana' : (card.suit ?? 'Minor Arcana');
}

interface CardDetail {
  upright_summary?: string;
  reversed_summary?: string;
  upright_meaning_long?: string;
  reversed_meaning_long?: string;
  keywords_upright?: string[];
  keywords_reversed?: string[];
  element?: string;
  astrology_association?: string;
  numerology?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DrawerCardSectionProps {
  card: DrawnCardRecord;
  cardDetail: Record<string, unknown> | null;
  showPosition: boolean;
  divider: boolean;
}

export function DrawerCardSection({
  card,
  cardDetail,
  showPosition,
  divider,
}: DrawerCardSectionProps) {
  const theme = useAppTheme();
  const isReversed = card.orientation === 'reversed';
  const detail = cardDetail as CardDetail | null;

  const summary = isReversed ? detail?.reversed_summary : detail?.upright_summary;
  const meaning = isReversed ? detail?.reversed_meaning_long : detail?.upright_meaning_long;
  const keywords = isReversed ? detail?.keywords_reversed : detail?.keywords_upright;

  return (
    <View
      style={[
        styles.cardSection,
        divider && { borderBottomWidth: 1, borderBottomColor: theme.colors.border.light },
      ]}
    >
      {showPosition && card.position && (
        <Text style={[styles.positionLabel, { color: theme.colors.text.muted }]}>
          {card.position.toUpperCase()}
        </Text>
      )}
      <Text style={[styles.cardName, { color: theme.colors.text.primary }]}>{card.cardName}</Text>

      <View style={styles.cardMeta}>
        <Text
          style={[
            styles.orientText,
            { color: isReversed ? theme.colors.tarot.orientation.reversed : theme.colors.brand.primary },
          ]}
        >
          {isReversed ? '↓ Reversed' : '↑ Upright'}
        </Text>
        <View
          style={[
            styles.arcanaBadge,
            {
              backgroundColor: theme.colors.surface.subtle,
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          <Text style={[styles.arcanaText, { color: theme.colors.text.muted }]}>
            {arcanaLabel(card)}
          </Text>
        </View>
      </View>

      {cardDetail ? (
        <View style={styles.detailContainer}>
          {/* Element / astrology row */}
          {(detail?.element || detail?.astrology_association) && (
            <View style={styles.metaRow}>
              {detail.element && (
                <View
                  style={[
                    styles.metaPill,
                    {
                      backgroundColor: theme.colors.surface.subtle,
                      borderColor: theme.colors.border.subtle,
                    },
                  ]}
                >
                  <Text style={[styles.metaPillText, { color: theme.colors.text.muted }]}>
                    {detail.element}
                  </Text>
                </View>
              )}
              {detail.astrology_association && (
                <View
                  style={[
                    styles.metaPill,
                    {
                      backgroundColor: theme.colors.surface.subtle,
                      borderColor: theme.colors.border.subtle,
                    },
                  ]}
                >
                  <Text style={[styles.metaPillText, { color: theme.colors.text.muted }]}>
                    {detail.astrology_association}
                  </Text>
                </View>
              )}
              {detail.numerology != null && (
                <View
                  style={[
                    styles.metaPill,
                    {
                      backgroundColor: theme.colors.surface.subtle,
                      borderColor: theme.colors.border.subtle,
                    },
                  ]}
                >
                  <Text style={[styles.metaPillText, { color: theme.colors.text.muted }]}>
                    #{detail.numerology}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Summary */}
          {summary && (
            <Text style={[styles.summary, { color: theme.colors.text.secondary }]}>{summary}</Text>
          )}

          {/* Keywords */}
          {keywords && keywords.length > 0 && (
            <View style={styles.keywordsRow}>
              {keywords.map(kw => (
                <View
                  key={kw}
                  style={[
                    styles.keyword,
                    isReversed
                      ? { backgroundColor: theme.colors.error.light, borderColor: theme.colors.error.main }
                      : { backgroundColor: theme.colors.brand.purple[50], borderColor: theme.colors.brand.purple[100] },
                  ]}
                >
                  <Text
                    style={[
                      styles.keywordText,
                      { color: isReversed ? theme.colors.error.main : theme.colors.brand.purple[600] },
                    ]}
                  >
                    {kw}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Long meaning */}
          {meaning && (
            <Text style={[styles.meaning, { color: theme.colors.text.secondary }]}>{meaning}</Text>
          )}
        </View>
      ) : (
        <ActivityIndicator
          size="small"
          color={theme.colors.brand.primary}
          style={{ marginTop: spacing.lg }}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  cardSection: { paddingVertical: 22 },
  positionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  cardName: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: spacing.sm,
    lineHeight: 36,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  orientText: {
    fontSize: 16,
    fontWeight: '700',
  },
  arcanaBadge: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
  },
  arcanaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailContainer: { gap: spacing.md },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metaPill: {
    borderRadius: borderRadius.sm,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  summary: {
    fontSize: 16,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  keyword: {
    borderRadius: borderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
  },
  keywordText: {
    fontSize: 12,
    fontWeight: '600',
  },
  meaning: {
    fontSize: 14,
    lineHeight: 21,
  },
});
