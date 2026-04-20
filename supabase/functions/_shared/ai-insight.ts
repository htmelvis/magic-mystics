export function parseAIInsight(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.kind === 'single' || parsed.kind === 'spread' || parsed.kind === 'followup') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export const DEFAULT_INTENTIONS: Record<string, string> = {
  'daily': 'daily guidance',
  'past-present-future': 'reflection on where I have been and where I am going',
  'relationship': 'understanding this relationship',
  'situation-obstacle-solution': 'finding a way through this situation',
  'mind-body-spirit': 'alignment across all parts of myself',
  'path-choice': 'clarity on which path to take',
};

export const SPREAD_DISPLAY_NAMES: Record<string, string> = {
  'daily': 'daily draw',
  'past-present-future': 'past · present · future',
  'relationship': 'self · other · dynamic between you',
  'situation-obstacle-solution': 'situation · obstacle · solution',
  'mind-body-spirit': 'mind · body · spirit',
  'path-choice': 'path 1 · path 2 · path 3',
};
