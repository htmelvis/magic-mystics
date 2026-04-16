export const CARD = {
  width: 230,
  height: 320,
  borderRadius: 14,
} as const;

export const COLORS = {
  back: {
    bg: '#0f0520',
    borderOuter: '#c9a84c',
    borderInner: '#7b5c1e',
    ornament: '#c9a84c',
    centerBg: '#1d0b35',
  },
  front: {
    bg: '#130926',
    border: '#4a1580',
    textPrimary: '#f0e0c8',
    textMuted: '#8a6a96',
    accentGold: '#c9a84c',
  },
} as const;

export const ANIMATION = {
  /** Card flip duration in ms */
  flip: 480,
  /** Duration for cards to fan out during shuffle */
  shuffleFan: 360,
  /** Duration for cards to return to stack after shuffle */
  shuffleReturn: 420,
  /** Per-card stagger delay in ms */
  staggerDelay: 50,
  /** Deck fade-out when a draw is initiated */
  deckFadeOut: 300,
  /** Card layer fade-in after shuffle completes */
  cardFadeIn: 350,
} as const;

export const VISIBLE_DECK_SIZE = 5;

/**
 * Target positions when the deck fans out during a shuffle.
 * Index 0 = leftmost card, index 4 = rightmost.
 */
export const FAN_TARGETS = [
  { x: -150, y: 15, rotate: -28 },
  { x: -75, y: -15, rotate: -13 },
  { x: 0, y: -25, rotate: 0 },
  { x: 75, y: -15, rotate: 13 },
  { x: 150, y: 15, rotate: 28 },
] as const;

/**
 * Subtle resting offsets per card in the stack (index 0 = bottom card).
 * Creates the natural "imperfect stack" look.
 */
export const STACK_OFFSETS = [
  { x: 0, y: 0, rotate: 0 },
  { x: 0.5, y: -1.5, rotate: 0.6 },
  { x: -0.5, y: -3, rotate: -0.9 },
  { x: 1.0, y: -4.5, rotate: 0.4 },
  { x: -0.5, y: -6, rotate: -0.7 },
] as const;
