import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { TarotCardOrientation, TarotCardRow } from '@/types/tarot';

interface Props {
  card: TarotCardRow;
  orientation: TarotCardOrientation;
}

export function CardDetail({ card, orientation }: Props) {
  const theme = useAppTheme();
  const isReversed = orientation === 'reversed';

  const summary = isReversed ? (card.reversed_summary ?? '') : (card.upright_summary ?? '');

  const meaning = isReversed
    ? (card.reversed_meaning_long ?? '')
    : (card.upright_meaning_long ?? '');
  const { element, astrology_association: astrology, arcana, suit, number, name } = card;

  return (
    <View
      style={[
        styles.resultBox,
        { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.main },
      ]}
    >
      <View style={styles.metaRow}>
        {arcana && (
          <Text style={[styles.arcanaText, { color: theme.colors.text.primary }]}>
            {arcana === 'Major'
              ? name
              : `${number != null ? `${number} of ` : ''}${suit ?? 'Minor Arcana'}`}
          </Text>
        )}
        <Text style={[styles.orientText, { color: isReversed ? theme.colors.brand.primary : '' }]}>
          {isReversed ? '↓ Reversed' : null}
        </Text>
      </View>

      {(element || astrology) && (
        <View style={styles.metaRow}>
          {element && (
            <View
              style={[
                styles.pill,
                {
                  backgroundColor: theme.colors.surface.elevated,
                  borderColor: theme.colors.border.main,
                },
              ]}
            >
              <Text style={[styles.pillText, { color: theme.colors.text.secondary }]}>
                {element}
              </Text>
            </View>
          )}
          {astrology && (
            <View
              style={[
                styles.pill,
                {
                  backgroundColor: theme.colors.surface.elevated,
                  borderColor: theme.colors.border.main,
                },
              ]}
            >
              <Text style={[styles.pillText, { color: theme.colors.text.secondary }]}>
                {astrology}
              </Text>
            </View>
          )}
        </View>
      )}

      {summary.length > 0 && (
        <Text style={[styles.summary, { color: theme.colors.text.secondary }]}>{summary}</Text>
      )}

      {meaning.length > 0 && (
        <Text style={[styles.meaning, { color: theme.colors.text.secondary }]}>{meaning}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultBox: { borderRadius: 16, padding: 20, borderWidth: 1, gap: 0 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  orientText: { fontSize: 11, fontWeight: '400' },
  arcanaText: { fontSize: 14, fontWeight: '700' },
  pill: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  pillText: { fontSize: 12, fontWeight: '500' },
  summary: { fontSize: 12, lineHeight: 22, fontStyle: 'italic', marginBottom: 12 },
  meaning: { fontSize: 16, lineHeight: 23 },
});
