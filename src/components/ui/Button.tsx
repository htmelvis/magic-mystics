import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    isDisabled && styles.button_disabled,
    fullWidth && styles.button_fullWidth,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    isDisabled && styles.text_disabled,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyles,
        pressed && !isDisabled && styles.button_pressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={loading ? `${accessibilityLabel ?? title}, loading` : (accessibilityLabel ?? title)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.text.inverse : theme.colors.brand.primary}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Base button styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.button,
    gap: theme.spacing.xs,
  },

  // Variants
  button_primary: {
    backgroundColor: theme.colors.brand.primary,
    ...theme.shadows.button,
  },
  button_secondary: {
    backgroundColor: theme.colors.surface.card,
    borderWidth: 2,
    borderColor: theme.colors.border.main,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.brand.primary,
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_destructive: {
    backgroundColor: theme.colors.error.main,
    ...theme.shadows.button,
  },

  // Sizes
  button_sm: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  button_md: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  button_lg: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },

  // States
  button_disabled: {
    opacity: 0.5,
  },
  button_pressed: {
    opacity: 0.8,
  },
  button_fullWidth: {
    width: '100%',
  },

  // Text styles
  text: {
    textAlign: 'center',
  },

  // Text variants
  text_primary: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
  },
  text_secondary: {
    ...theme.textStyles.button,
    color: theme.colors.text.primary,
  },
  text_outline: {
    ...theme.textStyles.button,
    color: theme.colors.brand.primary,
  },
  text_ghost: {
    ...theme.textStyles.button,
    color: theme.colors.brand.primary,
  },
  text_destructive: {
    ...theme.textStyles.button,
    color: theme.colors.text.inverse,
  },

  // Text sizes
  text_sm: {
    ...theme.textStyles.buttonSmall,
  },
  text_md: {
    ...theme.textStyles.button,
  },
  text_lg: {
    ...theme.textStyles.buttonLarge,
  },

  // Text states
  text_disabled: {
    opacity: 1, // Already handled by button opacity
  },
});
