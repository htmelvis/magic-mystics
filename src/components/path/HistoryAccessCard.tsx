import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';

interface HistoryAccessCardProps {
  readingCount: number;
  onPress: () => void;
}

export function HistoryAccessCard({ readingCount, onPress }: HistoryAccessCardProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? theme.colors.surface.subtle : theme.colors.surface.card,
          borderColor: theme.colors.border.subtle,
          ...theme.shadows.card,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Reading History, ${readingCount} readings`}
      accessibilityHint="Double-tap to view all readings"
    >
      <View style={styles.left}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={22}
          color={theme.colors.brand.primary}
        />
        <View>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Reading History</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.muted }]}>
            {readingCount} {readingCount === 1 ? 'reading' : 'readings'} total
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={theme.colors.text.muted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.card,
    borderWidth: 1,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
});
