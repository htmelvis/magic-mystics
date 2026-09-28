import { AIInsightSchema, type AIInsight } from './insight-schema.ts';

/**
 * Parses a stored insight, returning null unless every field matches the schema.
 * A stored insight that fails validation is treated as missing, so the idempotency
 * guard regenerates it instead of serving a broken reading forever.
 */
export function parseAIInsight(raw: string | null): AIInsight | null {
  if (!raw) return null;
  try {
    const result = AIInsightSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export const DEFAULT_INTENTIONS: Record<string, string> = {
  daily: 'daily guidance',
  'past-present-future': 'reflection on where I have been and where I am going',
  relationship: 'understanding myself, another person, and the dynamic between us',
  'situation-obstacle-solution': 'finding a way through this situation',
  'mind-body-spirit': 'alignment across my mental, physical, and spiritual self',
  'path-choice': 'clarity on which path to take',
  'accept-embrace-let-go':
    'understanding what to acknowledge, what to welcome, and what to release',
};

export const SPREAD_DISPLAY_NAMES: Record<string, string> = {
  daily: 'daily draw',
  'past-present-future': 'past · present · future',
  relationship: 'you · them · relationship',
  'situation-obstacle-solution': 'situation · obstacle · solution',
  'mind-body-spirit': 'mind · body · spirit',
  'path-choice': 'path 1 · path 2 · path 3',
  'accept-embrace-let-go': 'accept · embrace · let go',
};
