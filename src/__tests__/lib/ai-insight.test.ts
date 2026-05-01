import { parseAIInsight } from '@/types/ai-insight';
import type { SingleCardInsight, SpreadInsight } from '@/types/ai-insight';

const SINGLE: SingleCardInsight = {
  kind: 'single',
  opening: 'The stars align.',
  card_essence: 'The Tower shifts everything.',
  celestial_overlay: 'Mercury speaks.',
  guidance: 'Trust the fall.',
  resonance: 'You were never the building.',
};

const SPREAD: SpreadInsight = {
  kind: 'spread',
  opening: 'Three threads of time.',
  spread_reading: 'Past loss feeds present bloom.',
  guidance: 'Walk forward.',
  resonance: 'Every ending opens a door.',
};

describe('parseAIInsight', () => {
  it('returns null for null input', () => {
    expect(parseAIInsight(null)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseAIInsight('')).toBeNull();
  });

  it('returns null for malformed JSON', () => {
    expect(parseAIInsight('not json')).toBeNull();
    expect(parseAIInsight('{broken')).toBeNull();
  });

  it('returns null for valid JSON with an unrecognised kind', () => {
    expect(parseAIInsight(JSON.stringify({ kind: 'unknown', text: 'hi' }))).toBeNull();
  });

  it('returns null for valid JSON with no kind field', () => {
    expect(parseAIInsight(JSON.stringify({ opening: 'hi' }))).toBeNull();
  });

  it('parses a valid single-card insight', () => {
    const result = parseAIInsight(JSON.stringify(SINGLE));
    expect(result).not.toBeNull();
    expect(result?.kind).toBe('single');
    if (result?.kind === 'single') {
      expect(result.opening).toBe(SINGLE.opening);
      expect(result.card_essence).toBe(SINGLE.card_essence);
      expect(result.celestial_overlay).toBe(SINGLE.celestial_overlay);
      expect(result.guidance).toBe(SINGLE.guidance);
      expect(result.resonance).toBe(SINGLE.resonance);
    }
  });

  it('parses a valid spread insight', () => {
    const result = parseAIInsight(JSON.stringify(SPREAD));
    expect(result).not.toBeNull();
    expect(result?.kind).toBe('spread');
    if (result?.kind === 'spread') {
      expect(result.opening).toBe(SPREAD.opening);
      expect(result.spread_reading).toBe(SPREAD.spread_reading);
      expect(result.guidance).toBe(SPREAD.guidance);
      expect(result.resonance).toBe(SPREAD.resonance);
    }
  });

  it('parses a valid followup insight', () => {
    const followup = {
      kind: 'followup',
      reframe: 'See it differently.',
      card_speaks: 'The card whispers.',
      in_light_of: 'Given what came before.',
      guidance: 'Move gently.',
      resonance: 'Clarity follows stillness.',
    };
    const result = parseAIInsight(JSON.stringify(followup));
    expect(result).not.toBeNull();
    expect(result?.kind).toBe('followup');
  });

  it('is the inverse of JSON.stringify for all three kinds', () => {
    [SINGLE, SPREAD].forEach(insight => {
      const round = parseAIInsight(JSON.stringify(insight));
      expect(round).toEqual(insight);
    });
  });
});
