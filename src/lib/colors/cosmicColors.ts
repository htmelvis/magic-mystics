import { theme } from '@theme';

const DEEP_SPACE = theme.colors.brand.cosmic.deepSpace;

const COLOR_MAP: Record<string, string> = {
  red: '#7f1d1d',
  crimson: '#7f1d1d',
  scarlet: '#881337',
  pink: '#831843',
  rose: '#9f1239',
  magenta: '#701a75',
  orange: '#7c2d12',
  amber: '#78350f',
  yellow: '#713f12',
  gold: '#78350f',
  green: '#14532d',
  emerald: '#064e3b',
  teal: '#134e4a',
  cyan: '#164e63',
  blue: '#1e3a5f',
  cobalt: '#1e3a5f',
  indigo: '#1e1b4b',
  violet: '#2e1065',
  purple: '#3b0764',
  lavender: '#2e1065',
  lilac: '#3b0764',
  white: '#e2e8f0',
  silver: '#334155',
  gray: '#1e293b',
  grey: '#1e293b',
  black: '#0f0f1a',
  brown: '#292524',
  copper: '#431407',
};

export function resolveColor(name: string): string {
  return COLOR_MAP[name.toLowerCase().trim()] ?? DEEP_SPACE;
}

export function buildGradientColors(
  luckyColors: string[] | null
): readonly [string, string, ...string[]] {
  const resolved = (luckyColors ?? []).map(resolveColor).filter(c => c !== DEEP_SPACE);

  if (resolved.length === 0) return [DEEP_SPACE, '#0d0d1a'];
  if (resolved.length === 1) return [resolved[0], DEEP_SPACE];
  return [resolved[0], resolved[1], DEEP_SPACE] as [string, string, string];
}
