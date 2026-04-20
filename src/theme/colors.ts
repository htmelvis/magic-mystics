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

// Dark mode color palette
export const darkColors = {
  // Brand Colors (slightly adjusted for dark mode)
  brand: {
    primary: '#a78bfa', // Lighter violet for better contrast
    primaryLight: '#c4b5fd',
    primaryDark: '#8b5cf6',
    primaryMuted: '#2e1065',
    
    secondary: '#ddd6fe',
    secondaryLight: '#ede9fe',
    secondaryDark: '#c4b5fd',
    
    accent: '#fbbf24', // Brighter gold for visibility
    accentLight: '#fcd34d',
    accentDark: '#f59e0b',

    // Purple scale (dark mode: 50-200 inverted to dark tints for backgrounds/borders)
    purple: {
      50: '#1c1033',
      100: '#2e1a52',
      200: '#4a2387',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },

    // Cosmic colors
    cosmic: {
      sky: '#0c4a6e',
      ocean: '#38bdf8',
      deepSpace: '#0f172a',
      nebula: '#1e1b4b',
      stardust: '#818cf8',
      moonlight: '#e0e7ff',
      aurora: '#312e81',
      sunGold: '#fbbf24',
      moonSilver: '#cbd5e1',
      starWhite: '#f8fafc',
    },
  },

  // Semantic Colors (adjusted for dark backgrounds)
  success: {
    main: '#34d399',
    light: '#064e3b',
    dark: '#10b981',
  },
  
  warning: {
    main: '#fbbf24',
    light: '#451a03',
    dark: '#f59e0b',
  },
  
  error: {
    main: '#f87171',
    light: '#450a0a',
    dark: '#ef4444',
  },
  
  info: {
    main: '#60a5fa',
    light: '#082f49',
    dark: '#3b82f6',
  },

  // Neutral Grays (inverted for dark mode)
  gray: {
    50: '#1a1a1a',
    100: '#262626',
    200: '#333333',
    300: '#404040',
    400: '#525252',
    500: '#737373',
    600: '#a3a3a3',
    700: '#d4d4d4',
    800: '#e5e5e5',
    900: '#f5f5f5',
    950: '#fafafa',
  },

  // Surface Colors (dark backgrounds)
  surface: {
    background: '#0a0a0a',
    card: '#1a1a1a',
    elevated: '#262626',
    overlay: 'rgba(0, 0, 0, 0.75)',
    subtle: '#171717',
  },

  // Text Colors (light text on dark backgrounds)
  text: {
    primary: '#f5f5f5',
    secondary: '#d4d4d4',
    muted: '#a3a3a3',
    disabled: '#525252',
    inverse: '#0a0a0a',
    link: '#a78bfa',
  },

  // Border Colors
  border: {
    light: '#262626',
    main: '#333333',
    dark: '#404040',
    focus: '#a78bfa',
    default: '#333333',
    subtle: '#262626',
  },

  // Tarot-specific colors (adjusted for dark mode)
  tarot: {
    // Suit Colors
    suits: {
      wands: '#f87171', // Brighter red
      cups: '#60a5fa', // Brighter blue
      swords: '#a3a3a3', // Lighter gray
      pentacles: '#34d399', // Brighter green
      major: '#fbbf24', // Brighter gold
    },
    // Orientation colors
    orientation: {
      upright: '#a78bfa',
      reversed: '#f87171',
    },
    // AI Insight colors
    insight: {
      background: '#422006',
      border: '#78350f',
      text: '#fbbf24',
    },
  },

  // Subscription Tier Colors
  subscription: {
    free: {
      background: '#262626',
      border: '#404040',
      text: '#a3a3a3',
    },
    premium: {
      background: '#422006',
      border: '#92400e',
      text: '#fbbf24',
      accent: '#f59e0b',
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
export type DarkColors = typeof darkColors;
export type ColorKey = keyof Colors;
