import { buildCaption } from '@lib/share/build-caption';
import type { AIInsight } from '@/types/ai-insight';
import type { TarotCardRow } from '@/types/tarot';

const card: Pick<TarotCardRow, 'name' | 'upright_summary' | 'reversed_summary'> = {
  name: 'The Magician',
  upright_summary: 'Focused will bringing vision into form.',
  reversed_summary: 'Scattered intent; power out of alignment.',
};

const URL = 'https://links.magicmystics.com/reading/abc-123';

describe('buildCaption', () => {
  it('uses upright summary for upright orientation', () => {
    const out = buildCaption({ card, orientation: 'upright', insight: null, shareUrl: URL });
    expect(out).toContain('I drew The Magician.');
    expect(out).toContain('Focused will bringing vision into form.');
    expect(out).toContain(URL);
  });

  it('annotates reversed and uses reversed summary', () => {
    const out = buildCaption({ card, orientation: 'reversed', insight: null, shareUrl: URL });
    expect(out).toContain('The Magician (reversed)');
    expect(out).toContain('Scattered intent; power out of alignment.');
  });

  it('prefers AI insight opening when available', () => {
    const insight: AIInsight = {
      kind: 'single',
      opening: 'You are standing at a threshold you keep pretending is a doorway.',
      card_essence: '',
      celestial_overlay: '',
      guidance: '',
      resonance: '',
    };
    const out = buildCaption({ card, orientation: 'upright', insight, shareUrl: URL });
    expect(out).toContain('threshold you keep pretending');
    expect(out).not.toContain('Focused will bringing vision into form.');
  });

  it('omits the body gracefully when both summary and insight are missing', () => {
    const bareCard = { name: 'The Fool', upright_summary: null, reversed_summary: null };
    const out = buildCaption({
      card: bareCard,
      orientation: 'upright',
      insight: null,
      shareUrl: URL,
    });
    expect(out).toBe(`I drew The Fool.\n\n${URL}`);
  });

  it('truncates long summaries with an ellipsis', () => {
    const longCard = {
      name: 'Ten of Swords',
      upright_summary: 'x'.repeat(300),
      reversed_summary: null,
    };
    const out = buildCaption({
      card: longCard,
      orientation: 'upright',
      insight: null,
      shareUrl: URL,
    });
    expect(out).toContain('…');
    // prefix + space + 180-char truncated body + \n\n + URL
    expect(out.length).toBeLessThan(300);
  });
});
