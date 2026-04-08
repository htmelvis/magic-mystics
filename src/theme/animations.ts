/**
 * Animation timing and easing constants
 * 
 * Provides consistent animation durations and easings
 */

export const durations = {
  // Standard durations (in milliseconds)
  instant: 0,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,

  // Component-specific durations
  button: 150,
  modal: 280,
  drawer: 280,
  tooltip: 200,
  toast: 300,

  // Tarot-specific animations
  cardFlip: 600,
  cardShuffle: 300,
  cardDraw: 350,
  deckFade: 300,
} as const;

// Spring animation configs (for use with Animated.spring)
export const springs = {
  gentle: {
    damping: 50,
    stiffness: 380,
    mass: 1,
  },
  snappy: {
    damping: 30,
    stiffness: 400,
    mass: 0.8,
  },
  bouncy: {
    damping: 15,
    stiffness: 200,
    mass: 1,
  },
} as const;

// Common animation values
export const animations = {
  // Opacity transitions
  fadeIn: {
    from: 0,
    to: 1,
  },
  fadeOut: {
    from: 1,
    to: 0,
  },

  // Scale transitions
  scaleUp: {
    from: 0.95,
    to: 1,
  },
  scaleDown: {
    from: 1,
    to: 0.95,
  },

  // Slide transitions
  slideUp: {
    from: 100,
    to: 0,
  },
  slideDown: {
    from: -100,
    to: 0,
  },

  // Rotation
  rotate180: {
    from: '0deg',
    to: '180deg',
  },
  rotate360: {
    from: '0deg',
    to: '360deg',
  },
} as const;

export type Durations = typeof durations;
export type Springs = typeof springs;
export type Animations = typeof animations;
