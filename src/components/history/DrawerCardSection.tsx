import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { DrawnCardRecord } from '@/types/tarot';
import { theme } from '@theme';

// ── Helper ────────────────────────────────────────────────────────────────────

function arcanaLabel(card: DrawnCardRecord): string {
  return card.arcana === 'Major' ? 'Major Arcana' : (card.suit ?? 'Minor Arcana');
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
        <View style={styles.jsonBox}>
          <Text style={styles.jsonLabel}>Card Data</Text>
          <Text style={styles.jsonText}>
            {JSON.stringify({ orientation: card.orientation, ...cardDetail }, null, 2)}
          </Text>
        </View>
      ) : (
        <View style={styles.jsonBox}>
          <ActivityIndicator size="small" color={theme.colors.brand.primary} style={{ marginVertical: 8 }} />
        </View>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  cardSection: { paddingVertical: 22 },
  cardDivider: { 
    borderBottomWidth: 1, 
    borderBottomColor: theme.colors.border.light 
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
    gap: theme.spacing.sm 
  },
  orientText: { 
    fontSize: theme.typography.fontSize.base, 
    fontWeight: '700', 
    color: theme.colors.brand.primary 
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
    fontWeight: '600' 
  },
  jsonBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.brand.purple[50],
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.brand.purple[100],
  },
  jsonLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.brand.purple[600],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: theme.colors.text.secondary,
    lineHeight: 17,
  },
});
