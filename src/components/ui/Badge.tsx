import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { borderRadius, spacing } from '@theme';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', size = 'md', style }: BadgeProps) {
  const theme = useAppTheme();

  const variantContainerStyle = {
    default: { backgroundColor: theme.colors.gray[100] },
    primary: { backgroundColor: theme.colors.brand.primaryMuted },
    success: { backgroundColor: theme.colors.success.light },
    warning: { backgroundColor: theme.colors.warning.light },
    error: { backgroundColor: theme.colors.error.light },
    outline: {
      backgroundColor: 'transparent' as const,
      borderWidth: 1,
      borderColor: theme.colors.border.main,
    },
  }[variant];

  const variantTextStyle = {
    default: { color: theme.colors.gray[700] },
    primary: { color: theme.colors.brand.primaryDark },
    success: { color: theme.colors.success.dark },
    warning: { color: theme.colors.warning.dark },
    error: { color: theme.colors.error.dark },
    outline: { color: theme.colors.text.secondary },
  }[variant];

  return (
    <View style={[styles.badge, sizeContainer[size], variantContainerStyle, style]}>
      <Text style={[styles.text, sizeText[size], variantTextStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.badge,
  },
  text: {
    fontWeight: '600',
  },
});

const sizeContainer = StyleSheet.create({
  sm: { paddingVertical: 2, paddingHorizontal: spacing.xs },
  md: { paddingVertical: spacing.xxs, paddingHorizontal: spacing.sm },
  lg: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
});

const sizeText = StyleSheet.create({
  sm: { fontSize: 10, letterSpacing: 0.3 },
  md: { fontSize: 11, letterSpacing: 0.3 },
  lg: { fontSize: 12, letterSpacing: 0.5 },
});
