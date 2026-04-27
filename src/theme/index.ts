/**
 * Magic Mystics Theme
 *
 * Centralized theme system for consistent design tokens
 * Import from this file to access colors, spacing, typography, etc.
 *
 * Usage:
 * ```typescript
 * import { theme } from '@/theme';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.colors.surface.background,
 *     padding: theme.spacing.screenPadding,
 *   },
 *   title: {
 *     ...theme.textStyles.h1,
 *     color: theme.colors.text.primary,
 *   },
 * });
 * ```
 */
import { colors, darkColors } from './colors';
import { spacing, borderRadius, iconSizes, layout } from './spacing';
import { fontSizes, fontWeights, lineHeights, letterSpacings, textStyles } from './typography';
import { shadows } from './shadows';
import { durations, springs, animations } from './animations';
import type { ActiveColorScheme } from '../context/ThemeContext';

export { colors, darkColors } from './colors';
export { spacing, borderRadius, iconSizes, layout } from './spacing';
export { fontSizes, fontWeights, lineHeights, letterSpacings, textStyles } from './typography';
export { shadows } from './shadows';
export { durations, springs, animations } from './animations';

// Export types
export type { Colors, ColorKey } from './colors';
export type { Spacing, BorderRadius, IconSizes, Layout } from './spacing';
export type { FontSizes, FontWeights, LineHeights, LetterSpacings, TextStyles } from './typography';
export type { Shadows, ShadowKey } from './shadows';
export type { Durations, Springs, Animations } from './animations';

// Function to get theme based on color scheme
export function getTheme(colorScheme: ActiveColorScheme = 'light') {
  return {
    colors: colorScheme === 'dark' ? darkColors : colors,
    spacing,
    radius: borderRadius, // Alias for easier access
    borderRadius,
    iconSizes,
    layout,
    typography: {
      fontSize: fontSizes,
      fontWeight: fontWeights,
      lineHeight: lineHeights,
      letterSpacing: letterSpacings,
    },
    fontSizes,
    fontWeights,
    lineHeights,
    letterSpacings,
    textStyles,
    shadows,
    durations,
    springs,
    animations,
  };
}

// Default theme (light mode) for compatibility
export const theme = getTheme('light');

export type Theme = ReturnType<typeof getTheme>;
