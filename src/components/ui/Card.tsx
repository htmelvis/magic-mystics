import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { theme } from '@theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  padding?: keyof typeof theme.spacing;
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'elevated',
  onPress,
  padding = 'cardPadding',
  style,
}: CardProps) {
  const paddingValue = theme.spacing[padding];

  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    { padding: paddingValue },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyles,
          pressed && styles.card_pressed,
        ]}
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
