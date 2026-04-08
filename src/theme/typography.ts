/**
 * Typography scale and text styles
 */

import { TextStyle } from 'react-native';

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15, // Alias for md
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 32,
} as const;

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const letterSpacings = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 1.5,
} as const;

// Pre-defined text styles for common use cases
export const textStyles = {
  // Display styles (large headings)
  display: {
    fontSize: 32,
    fontWeight: fontWeights.bold,
    lineHeight: 40,
    letterSpacing: letterSpacings.tight,
  },

  // Heading styles
  h1: {
    fontSize: 28,
    fontWeight: fontWeights.bold,
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: fontWeights.bold,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    lineHeight: 26,
  },
  h4: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    lineHeight: 24,
  },

  // Body text
  body: {
    fontSize: 15,
    fontWeight: fontWeights.regular,
    lineHeight: 23,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
  },

  // Labels and captions
  label: {
    fontSize: 15,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
  },
  labelLarge: {
    fontSize: 16,
    fontWeight: fontWeights.medium,
    lineHeight: 22,
  },
  labelSmall: {
    fontSize: 13,
    fontWeight: fontWeights.medium,
    lineHeight: 18,
  },

  // Caption and helper text
  caption: {
    fontSize: 12,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
  },
  overline: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    lineHeight: 16,
    letterSpacing: letterSpacings.widest,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },

  // Button text
  buttonLarge: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    lineHeight: 24,
  },
  button: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    lineHeight: 22,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
  },

  // Special text styles
  monospace: {
    fontFamily: 'monospace' as TextStyle['fontFamily'],
    fontSize: 12,
    lineHeight: 18,
  },

  // Link text
  link: {
    fontSize: 15,
    fontWeight: fontWeights.medium,
    lineHeight: 22,
  },
} as const;

export type FontSizes = typeof fontSizes;
export type FontWeights = typeof fontWeights;
export type LineHeights = typeof lineHeights;
export type LetterSpacings = typeof letterSpacings;
export type TextStyles = typeof textStyles;
