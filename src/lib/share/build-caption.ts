import type { AIInsight } from '@/types/ai-insight';
import type { TarotCardOrientation, TarotCardRow } from '@/types/tarot';

interface Input {
  card: Pick<TarotCardRow, 'name' | 'upright_summary' | 'reversed_summary'>;
  orientation: TarotCardOrientation;
  insight: AIInsight | null;
  shareUrl: string;
}

const MAX_BODY_LENGTH = 180;

function truncate(s: string, max: number): string {
  const trimmed = s.trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 1).trimEnd() + '…';
}

// Returns the short line to accompany the shared image / URL. The URL is
// always appended so messaging apps that don't consume the image attachment
// still give recipients a tappable link with an OG preview.
export function buildCaption({ card, orientation, insight, shareUrl }: Input): string {
  const reversedSuffix = orientation === 'reversed' ? ' (reversed)' : '';

  const summary =
    insight && 'opening' in insight && insight.opening
      ? insight.opening
      : (orientation === 'reversed' ? card.reversed_summary : card.upright_summary) ?? '';

  const body = truncate(summary, MAX_BODY_LENGTH);
  const prefix = `I drew ${card.name}${reversedSuffix}.`;

  return body.length > 0 ? `${prefix} ${body}\n\n${shareUrl}` : `${prefix}\n\n${shareUrl}`;
}
