import { config as defaultConfig } from '@gluestack-ui/config';
import { createConfig } from '@gluestack-style/react';

// Import our custom theme colors
import { colors } from './src/theme/colors';

// Extend the default gluestack config with our custom colors
export const config = createConfig({
  ...defaultConfig.theme,
  tokens: {
    ...defaultConfig.theme.tokens,
    colors: {
      ...defaultConfig.theme.tokens.colors,
      // Map our theme colors to gluestack tokens
      primary500: colors.brand.primary,
      primary600: colors.brand.primaryDark,
      primary400: colors.brand.primaryLight,
      
      // Text colors
      textDark900: colors.text.primary,
      textDark600: colors.text.secondary,
      textDark400: colors.text.muted,
      
      // Background colors
      backgroundLight0: colors.surface.card,
      backgroundLight50: colors.surface.background,
      
      // Border colors
      borderLight300: colors.border.main,
      
      // Success, warning, error colors
      success500: colors.success.main,
      warning500: colors.warning.main,
      error500: colors.error.main,
    },
  },
} as const);

type Config = typeof config;

declare module '@gluestack-style/react' {
  interface ICustomConfig extends Config {}
}
