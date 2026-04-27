export interface SingleCardInsight {
  kind: 'single';
  opening: string;
  card_essence: string;
  celestial_overlay: string;
  guidance: string;
  resonance: string;
}

export interface SpreadInsight {
  kind: 'spread';
  opening: string;
  spread_reading: string;
  guidance: string;
  resonance: string;
}

// Phase 2 — follow-up clarifying card (prompt in docs/PROMPT_DRAFTS.md)
export interface FollowUpInsight {
  kind: 'followup';
  reframe: string;
  card_speaks: string;
  in_light_of: string;
  guidance: string;
  resonance: string;
}

export type AIInsight = SingleCardInsight | SpreadInsight | FollowUpInsight;

export function parseAIInsight(raw: string | null): AIInsight | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.kind === 'single' || parsed.kind === 'spread' || parsed.kind === 'followup') {
      return parsed as AIInsight;
    }
    return null;
  } catch {
    return null;
  }
}

// Injected by the edge function for {{USER_INTENTION}} when no user-supplied text exists.
export const DEFAULT_INTENTIONS: Record<string, string> = {
  daily: 'daily guidance',
  'past-present-future': 'reflection on where I have been and where I am going',
  relationship: 'understanding this relationship',
  'situation-obstacle-solution': 'finding a way through this situation',
  'mind-body-spirit': 'alignment across all parts of myself',
  'path-choice': 'clarity on which path to take',
};

export const SPREAD_DISPLAY_NAMES: Record<string, string> = {
  daily: 'daily draw',
  'past-present-future': 'past · present · future',
  relationship: 'self · other · dynamic between you',
  'situation-obstacle-solution': 'situation · obstacle · solution',
  'mind-body-spirit': 'mind · body · spirit',
  'path-choice': 'path 1 · path 2 · path 3',
};
