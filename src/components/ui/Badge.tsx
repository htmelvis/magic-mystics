import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@theme';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', size = 'md', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], styles[`badge_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Base badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.badge,
  },

  // Variants
  badge_default: {
    backgroundColor: theme.colors.gray[100],
  },
  badge_primary: {
    backgroundColor: theme.colors.brand.primaryMuted,
  },
  badge_success: {
    backgroundColor: theme.colors.success.light,
  },
  badge_warning: {
    backgroundColor: theme.colors.warning.light,
  },
  badge_error: {
    backgroundColor: theme.colors.error.light,
  },
  badge_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },

  // Sizes
  badge_sm: {
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.xs,
  },
  badge_md: {
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
  },
  badge_lg: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },

  // Text
  text: {
    fontWeight: '600',
  },

  // Text variants
  text_default: {
    color: theme.colors.gray[700],
  },
  text_primary: {
    color: theme.colors.brand.primaryDark,
  },
  text_success: {
    color: theme.colors.success.dark,
  },
  text_warning: {
    color: theme.colors.warning.dark,
  },
  text_error: {
    color: theme.colors.error.dark,
  },
  text_outline: {
    color: theme.colors.text.secondary,
  },

  // Text sizes
  text_sm: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  text_md: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  text_lg: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
