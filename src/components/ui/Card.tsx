import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useAppTheme } from '@hooks/useAppTheme';
import { spacing, borderRadius } from '@theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  padding?: number | keyof Omit<typeof spacing, 'safeArea' | 'unit'>;
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'elevated',
  onPress,
  padding = 'cardPadding',
  style,
}: CardProps) {
  const theme = useAppTheme();

  const paddingValue =
    typeof padding === 'number'
      ? padding
      : spacing[padding as keyof Omit<typeof spacing, 'safeArea' | 'unit'>];

  const variantStyle: ViewStyle =
    variant === 'outlined'
      ? { borderWidth: 1, borderColor: theme.colors.border.main }
      : variant === 'filled'
        ? { backgroundColor: theme.colors.gray[100] }
        : theme.shadows.card;

  const cardStyles: ViewStyle[] = [
    styles.base,
    { backgroundColor: theme.colors.surface.card },
    variantStyle,
    { padding: paddingValue as number },
    style || {},
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [...cardStyles, pressed ? styles.pressed : {}]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.card,
  },
  pressed: {
    opacity: 0.9,
  },
});
