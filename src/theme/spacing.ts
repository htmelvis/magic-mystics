/**
 * Spacing scale and layout constants
 *
 * Based on 4px baseline grid for consistency
 */

export const spacing = {
  // Base unit (4px)
  unit: 4,

  // Spacing scale
  xxs: 4, // 4px
  xs: 8, // 8px
  sm: 12, // 12px
  md: 16, // 16px
  lg: 20, // 20px
  xl: 24, // 24px
  xxl: 32, // 32px
  xxxl: 40, // 40px

  // Specific spacing tokens
  screenPadding: 16,
  cardPadding: 16,
  sectionGap: 24,
  itemGap: 12,
  inlineGap: 8,

  // Safe area (for notches, home indicators)
  safeArea: {
    top: 0, // Will be overridden by useSafeAreaInsets
    bottom: 0,
    left: 0,
    right: 0,
  },
} as const;

export const borderRadius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,

  // Component-specific
  button: 12,
  card: 16,
  input: 12,
  badge: 20,
  modal: 24,
} as const;

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const layout = {
  // Maximum content width (for tablets/large screens)
  maxContentWidth: 600,

  // Minimum touch target size (accessibility)
  minTouchTarget: 44,

  // Tab bar height
  tabBarHeight: 60,

  // Header heights
  headerHeight: 56,
  headerHeightLarge: 96,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type IconSizes = typeof iconSizes;
export type Layout = typeof layout;
