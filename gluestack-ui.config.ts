import { createConfig } from '@gluestack-style/react';
import { colors } from './src/theme/colors';

// Create a basic gluestack config with our custom theme colors
export const config = createConfig({
  aliases: {},
  tokens: {
    colors: {
      // Primary brand colors
      primary0: colors.brand.primaryMuted,
      primary50: colors.brand.primaryLight,
      primary100: colors.brand.primaryLight,
      primary200: colors.brand.primaryLight,
      primary300: colors.brand.primary,
      primary400: colors.brand.primary,
      primary500: colors.brand.primary,
      primary600: colors.brand.primaryDark,
      primary700: colors.brand.primaryDark,
      primary800: colors.brand.primaryDark,
      primary900: colors.brand.primaryDark,

      // Secondary colors
      secondary500: colors.brand.secondary,

      // Text colors
      textLight0: colors.text.inverse,
      textLight50: colors.text.disabled,
      textLight100: colors.text.muted,
      textLight200: colors.text.muted,
      textLight300: colors.text.secondary,
      textLight400: colors.text.secondary,
      textLight500: colors.text.primary,
      textLight600: colors.text.primary,
      textLight700: colors.text.primary,
      textLight800: colors.text.primary,
      textLight900: colors.text.primary,

      // Background colors
      backgroundLight0: colors.surface.card,
      backgroundLight50: colors.surface.background,
      backgroundLight100: colors.surface.subtle,
      backgroundLight200: colors.surface.elevated,

      // Border colors
      borderLight0: colors.border.light,
      borderLight100: colors.border.light,
      borderLight200: colors.border.main,
      borderLight300: colors.border.main,
      borderLight400: colors.border.dark,

      // Semantic colors
      success500: colors.success.main,
      success600: colors.success.dark,
      warning500: colors.warning.main,
      warning600: colors.warning.dark,
      error500: colors.error.main,
      error600: colors.error.dark,
      info500: colors.info.main,
      info600: colors.info.dark,

      // Gray scale
      gray50: colors.gray[50],
      gray100: colors.gray[100],
      gray200: colors.gray[200],
      gray300: colors.gray[300],
      gray400: colors.gray[400],
      gray500: colors.gray[500],
      gray600: colors.gray[600],
      gray700: colors.gray[700],
      gray800: colors.gray[800],
      gray900: colors.gray[900],
    },
    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
    },
    borderWidths: {
      0: 0,
      1: 1,
      2: 2,
      4: 4,
      8: 8,
    },
    radii: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      '2xl': 16,
      '3xl': 24,
      full: 9999,
    },
    fontSizes: {
      '2xs': 10,
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
  },
} as const);

type Config = typeof config;

declare module '@gluestack-style/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ICustomConfig extends Config {}
}
