import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { DrawnCardRecord } from '@/types/tarot';
import { theme } from '@theme';

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
  const isReversed = card.orientation === 'reversed';
  const detail = cardDetail as CardDetail | null;

  const summary = isReversed ? detail?.reversed_summary : detail?.upright_summary;
  const meaning = isReversed ? detail?.reversed_meaning_long : detail?.upright_meaning_long;
  const keywords = isReversed ? detail?.keywords_reversed : detail?.keywords_upright;

  return (
    <View style={[styles.cardSection, divider && styles.cardDivider]}>
      {showPosition && card.position && (
        <Text style={styles.positionLabel}>{card.position.toUpperCase()}</Text>
      )}
      <Text style={styles.cardName}>{card.cardName}</Text>

      <View style={styles.cardMeta}>
        <Text style={[styles.orientText, isReversed && styles.orientReversed]}>
          {isReversed ? '↓ Reversed' : '↑ Upright'}
        </Text>
        <View style={styles.arcanaBadge}>
          <Text style={styles.arcanaText}>{arcanaLabel(card)}</Text>
        </View>
      </View>

      {cardDetail ? (
        <View style={styles.detailContainer}>
          {/* Element / astrology row */}
          {(detail?.element || detail?.astrology_association) && (
            <View style={styles.metaRow}>
              {detail.element && (
                <View style={styles.metaPill}>
                  <Text style={styles.metaPillText}>{detail.element}</Text>
                </View>
              )}
              {detail.astrology_association && (
                <View style={styles.metaPill}>
                  <Text style={styles.metaPillText}>{detail.astrology_association}</Text>
                </View>
              )}
              {detail.numerology != null && (
                <View style={styles.metaPill}>
                  <Text style={styles.metaPillText}>#{detail.numerology}</Text>
                </View>
              )}
            </View>
          )}

          {/* Summary */}
          {summary && <Text style={styles.summary}>{summary}</Text>}

          {/* Keywords */}
          {keywords && keywords.length > 0 && (
            <View style={styles.keywordsRow}>
              {keywords.map(kw => (
                <View key={kw} style={[styles.keyword, isReversed && styles.keywordReversed]}>
                  <Text style={[styles.keywordText, isReversed && styles.keywordTextReversed]}>
                    {kw}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Long meaning */}
          {meaning && <Text style={styles.meaning}>{meaning}</Text>}
        </View>
      ) : (
        <ActivityIndicator
          size="small"
          color={theme.colors.brand.primary}
          style={{ marginTop: theme.spacing.lg }}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  cardSection: { paddingVertical: 22 },
  cardDivider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  positionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.text.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  cardName: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    lineHeight: 36,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  orientText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
    color: theme.colors.brand.primary,
  },
  orientReversed: { color: theme.colors.tarot.orientation.reversed },
  arcanaBadge: {
    backgroundColor: theme.colors.surface.subtle,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
  },
  arcanaText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    fontWeight: '600',
  },
  detailContainer: { gap: theme.spacing.md },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  metaPill: {
    backgroundColor: theme.colors.surface.subtle,
    borderRadius: theme.radius.sm,
    paddingVertical: 3,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  metaPillText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    fontWeight: '500',
  },
  summary: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  keyword: {
    backgroundColor: theme.colors.brand.purple[50],
    borderRadius: theme.radius.sm,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.brand.purple[100],
  },
  keywordReversed: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  keywordText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.brand.purple[600],
    fontWeight: '600',
  },
  keywordTextReversed: { color: '#dc2626' },
  meaning: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 21,
  },
});
