/**
 * Color palette for Magic Mystics
 * 
 * Colors are organized by:
 * - Brand colors (primary, secondary)
 * - Semantic colors (success, warning, error, info)
 * - Neutral grays
 * - Surface colors
 * - Tarot-specific mystical colors
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#8b5cf6', // Violet - main brand color
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
    primaryMuted: '#f3e8ff',
    
    secondary: '#c4b5fd', // Lighter violet
    secondaryLight: '#ddd6fe',
    secondaryDark: '#a78bfa',
    
    accent: '#c9a84c', // Gold accent
    accentLight: '#d4b563',
    accentDark: '#b8973d',

    // Purple scale (for components)
    purple: {
      50: '#f3e8ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },

    // Cosmic colors (for PPF spreads, celestial themes)
    cosmic: {
      sky: '#e0f2fe',
      ocean: '#0369a1',
      deepSpace: '#1e1b4b',
      nebula: '#312e81',
      stardust: '#a5b4fc',
      moonlight: '#c4b5fd',
      aurora: '#e0e7ff',
      sunGold: '#fbbf24',
      moonSilver: '#e0e7ff',
      starWhite: '#f5f3ff',
    },
  },

  // Semantic Colors
  success: {
    main: '#10b981',
    light: '#d1fae5',
    dark: '#047857',
  },
  
  warning: {
    main: '#f59e0b',
    light: '#fef3c7',
    dark: '#d97706',
  },
  
  error: {
    main: '#ef4444',
    light: '#fee2e2',
    dark: '#dc2626',
  },
  
  info: {
    main: '#3b82f6',
    light: '#dbeafe',
    dark: '#2563eb',
  },

  // Neutral Grays
  gray: {
    50: '#fafafa',
    100: '#f9fafb',
    200: '#f3f4f6',
    300: '#e5e7eb',
    400: '#d1d5db',
    500: '#9ca3af',
    600: '#6b7280',
    700: '#4b5563',
    800: '#374151',
    900: '#1f2937',
    950: '#111827',
  },

  // Surface Colors
  surface: {
    background: '#fafafa',
    card: '#ffffff',
    elevated: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.48)',
    subtle: '#fafafa',
  },

  // Text Colors
  text: {
    primary: '#1f2937',
    secondary: '#666666',
    muted: '#9ca3af',
    disabled: '#d1d5db',
    inverse: '#ffffff',
    link: '#8b5cf6',
  },

  // Border Colors
  border: {
    light: '#f3f4f6',
    main: '#e5e7eb',
    dark: '#d1d5db',
    focus: '#8b5cf6',
    default: '#d1d5db',
    subtle: '#e5e7eb',
  },


  // Tarot-specific colors
  tarot: {
    // Suit Colors
    suits: {
      wands: '#ef4444', // Fire - Red
      cups: '#3b82f6', // Water - Blue
      swords: '#6b7280', // Air - Gray
      pentacles: '#10b981', // Earth - Green
      major: '#c9a84c', // Gold for Major Arcana
    },
    // Orientation colors
    orientation: {
      upright: '#8b5cf6',
      reversed: '#ef4444',
    },
    // AI Insight colors
    insight: {
      background: '#fef3c7',
      border: '#fef08a',
      text: '#92400e',
    },
  },

  // Subscription Tier Colors
  subscription: {
    free: {
      background: '#f9fafb',
      border: '#e5e7eb',
      text: '#6b7280',
    },
    premium: {
      background: '#fef3c7',
      border: '#fbbf24',
      text: '#92400e',
      accent: '#c9a84c',
    },
  },


  // Transparent variations
  transparent: {
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black30: 'rgba(0, 0, 0, 0.3)',
    black50: 'rgba(0, 0, 0, 0.5)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white50: 'rgba(255, 255, 255, 0.5)',
  },
} as const;

// Type for accessing colors
export type Colors = typeof colors;
export type ColorKey = keyof Colors;
