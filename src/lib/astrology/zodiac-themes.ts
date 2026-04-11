import { ZodiacSign } from './calculate-signs';

export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water';

export interface ZodiacTheme {
  glyph: string;
  element: ZodiacElement;
  gradient: [string, string];
}

export const ZODIAC_THEMES: Record<ZodiacSign, ZodiacTheme> = {
  Aries: {
    glyph: '♈',
    element: 'fire',
    gradient: ['#c0392b', '#e67e22'],
  },
  Taurus: {
    glyph: '♉',
    element: 'earth',
    gradient: ['#27ae60', '#a8c47a'],
  },
  Gemini: {
    glyph: '♊',
    element: 'air',
    gradient: ['#f1c40f', '#f39c12'],
  },
  Cancer: {
    glyph: '♋',
    element: 'water',
    gradient: ['#2980b9', '#a8d8ea'],
  },
  Leo: {
    glyph: '♌',
    element: 'fire',
    gradient: ['#e67e22', '#f1c40f'],
  },
  Virgo: {
    glyph: '♍',
    element: 'earth',
    gradient: ['#6d9b3a', '#d4e6b5'],
  },
  Libra: {
    glyph: '♎',
    element: 'air',
    gradient: ['#8e44ad', '#d7a8e6'],
  },
  Scorpio: {
    glyph: '♏',
    element: 'water',
    gradient: ['#1a1a2e', '#7b2d8b'],
  },
  Sagittarius: {
    glyph: '♐',
    element: 'fire',
    gradient: ['#9b2335', '#d4524e'],
  },
  Capricorn: {
    glyph: '♑',
    element: 'earth',
    gradient: ['#2c3e50', '#7f8c8d'],
  },
  Aquarius: {
    glyph: '♒',
    element: 'air',
    gradient: ['#2980b9', '#6dd5fa'],
  },
  Pisces: {
    glyph: '♓',
    element: 'water',
    gradient: ['#6a3093', '#a044ff'],
  },
};
