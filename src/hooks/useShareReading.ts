import { useCallback, useState } from 'react';
import { Platform, Share } from 'react-native';
import { File, Paths } from 'expo-file-system';
import { supabase } from '@lib/supabase/client';
import { buildCaption } from '@lib/share/build-caption';
import type { AIInsight } from '@/types/ai-insight';
import type { TarotCardOrientation, TarotCardRow } from '@/types/tarot';

export const LINKS_HOST = 'https://links.magicmystics.com';

export interface ShareReadingInput {
  readingId: string;
  card: TarotCardRow;
  orientation: TarotCardOrientation;
  insight: AIInsight | null;
}

interface Result {
  share: (input: ShareReadingInput) => Promise<void>;
  isSharing: boolean;
  error: string | null;
}

// Stamps readings.shared_at on the first share (idempotent — later shares are
// no-ops). Safe to call unconditionally; failure is non-fatal so the user
// can still share even if the write flops.
async function stampSharedAt(readingId: string): Promise<void> {
  try {
    await supabase
      .from('readings')
      .update({ shared_at: new Date().toISOString() })
      .eq('id', readingId)
      .is('shared_at', null);
  } catch (err) {
    console.warn('[useShareReading] shared_at stamp failed', err);
  }
}

export function useShareReading(): Result {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const share = useCallback(
    async ({ readingId, card, orientation, insight }: ShareReadingInput) => {
      if (isSharing) return;
      setIsSharing(true);
      setError(null);

      const shareUrl = `${LINKS_HOST}/reading/${readingId}`;
      const imageUrl = `${shareUrl}/image.png`;
      const caption = buildCaption({ card, orientation, insight, shareUrl });

      try {
        await stampSharedAt(readingId);

        // iOS: attach the PNG file AND the caption. iMessage will render the
        // image inline and preserve the caption text (which contains the URL,
        // so the recipient also gets the rich link preview).
        //
        // Android: RN's Share doesn't accept `url`. We share caption+URL as
        // text only; the messaging app renders an OG preview of the link.
        if (Platform.OS === 'ios') {
          const target = new File(Paths.cache, `share-${readingId}.png`);
          if (target.exists) target.delete();
          try {
            const file = await File.downloadFileAsync(imageUrl, target);
            await Share.share({ url: file.uri, message: caption });
          } catch (dlErr) {
            console.warn('[useShareReading] image download failed, falling back to text', dlErr);
            await Share.share({ message: caption });
          }
        } else {
          await Share.share({ message: caption });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // User-cancelled share is not an error.
        if (!/dismiss|cancel/i.test(msg)) setError(msg);
      } finally {
        setIsSharing(false);
      }
    },
    [isSharing]
  );

  return { share, isSharing, error };
}
