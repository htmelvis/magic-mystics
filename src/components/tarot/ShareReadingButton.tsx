import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { useShareReading } from '@hooks/useShareReading';
import type { AIInsight } from '@/types/ai-insight';
import type { TarotCardOrientation, TarotCardRow } from '@/types/tarot';

interface Props {
  readingId: string;
  card: TarotCardRow;
  orientation: TarotCardOrientation;
  insight: AIInsight | null;
}

export function ShareReadingButton({ readingId, card, orientation, insight }: Props) {
  const theme = useAppTheme();
  const { share, isSharing } = useShareReading();

  return (
    <TouchableOpacity
      onPress={() => share({ readingId, card, orientation, insight })}
      disabled={isSharing}
      accessibilityRole="button"
      accessibilityLabel="Share this reading"
      accessibilityState={{ disabled: isSharing }}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surface.card,
          borderColor: theme.colors.border.main,
          opacity: isSharing ? 0.6 : 1,
        },
      ]}
    >
      {isSharing ? (
        <ActivityIndicator color={theme.colors.brand.primary} size="small" />
      ) : (
        <>
          <Text style={[styles.glyph, { color: theme.colors.brand.primary }]}>↗</Text>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>Share Reading</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  glyph: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '600' },
});
