import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { theme } from '@theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  padding?: number | keyof Omit<typeof theme.spacing, 'safeArea' | 'unit'>;
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'elevated',
  onPress,
  padding = 'cardPadding',
  style,
}: CardProps) {
  const paddingValue = typeof padding === 'number' 
    ? padding 
    : theme.spacing[padding as keyof Omit<typeof theme.spacing, 'safeArea' | 'unit'>];

  const cardStyles: ViewStyle[] = [
    styles.card,
    styles[`card_${variant}`] as ViewStyle,
    { padding: paddingValue as number },
    style || {},
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => {
          const pressedStyle = pressed ? styles.card_pressed : {};
          return [...cardStyles, pressedStyle];
        }}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.card,
    backgroundColor: theme.colors.surface.card,
  },

  // Variants
  card_elevated: {
    ...theme.shadows.card,
  },
  card_outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  card_filled: {
    backgroundColor: theme.colors.gray[50],
  },

  // States
  card_pressed: {
    opacity: 0.9,
  },
});
