import { StyleSheet, View } from 'react-native';
import { theme } from '@theme';

export function SkeletonRow() {
  return (
    <View style={[styles.row, { opacity: 0.45 }]}>
      <View style={[styles.line, { width: 90, height: 20, marginBottom: 14 }]} />
      <View style={[styles.line, { width: '65%', height: 18, marginBottom: 8 }]} />
      <View style={[styles.line, { width: '40%', height: 13 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  line: { 
    backgroundColor: theme.colors.border.subtle, 
    borderRadius: theme.radius.sm 
  },
});
