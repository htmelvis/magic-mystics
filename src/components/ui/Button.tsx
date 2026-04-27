import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { borderRadius, spacing } from '@theme';

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
  const theme = useAppTheme();
  const isDisabled = disabled || loading;

  const variantStyle: ViewStyle = {
    primary: { backgroundColor: theme.colors.brand.primary, ...theme.shadows.button },
    secondary: {
      backgroundColor: theme.colors.surface.card,
      borderWidth: 2,
      borderColor: theme.colors.border.main,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.brand.primary,
    },
    ghost: { backgroundColor: 'transparent' },
    destructive: { backgroundColor: theme.colors.error.main, ...theme.shadows.button },
  }[variant];

  const variantTextColor = {
    primary: theme.colors.text.inverse,
    secondary: theme.colors.text.primary,
    outline: theme.colors.brand.primary,
    ghost: theme.colors.brand.primary,
    destructive: theme.colors.text.inverse,
  }[variant];

  const buttonStyles = [
    styles.button,
    sizeButton[size],
    variantStyle,
    isDisabled && styles.button_disabled,
    fullWidth && styles.button_fullWidth,
    style,
  ];

  return (
    <Pressable
      style={({ pressed }) => [...buttonStyles, pressed && !isDisabled && styles.button_pressed]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={
        loading ? `${accessibilityLabel ?? title}, loading` : (accessibilityLabel ?? title)
      }
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
          <Text style={[styles.text, sizeText[size], { color: variantTextColor }]}>{title}</Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button,
    gap: spacing.xs,
  },
  button_disabled: { opacity: 0.5 },
  button_pressed: { opacity: 0.8 },
  button_fullWidth: { width: '100%' },
  text: { textAlign: 'center' },
});

const sizeButton = StyleSheet.create({
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  md: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
});

const sizeText = StyleSheet.create({
  sm: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.2 },
  md: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
  lg: { fontSize: 17, fontWeight: '700' as const, letterSpacing: 0.3 },
});
