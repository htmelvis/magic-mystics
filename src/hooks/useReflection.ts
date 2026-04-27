import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@lib/supabase/client';

export type ReflectionSentiment = 'positive' | 'neutral' | 'negative';

export interface Reflection {
  id: string;
  reading_id: string;
  feeling: ReflectionSentiment | null;
  alignment: ReflectionSentiment | null;
  content: string;
  created_at: string;
}

interface SavePayload {
  feeling: ReflectionSentiment;
  alignment: ReflectionSentiment;
  content: string;
}

interface UseReflectionResult {
  reflection: Reflection | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  save: (payload: SavePayload) => Promise<void>;
}

export function useReflection(
  readingId: string | null,
  userId: string | null
): UseReflectionResult {
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!readingId || !userId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    supabase
      .from('reflections')
      .select('id, reading_id, feeling, alignment, content, created_at')
      .eq('reading_id', readingId)
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) {
          setError(err.message);
        } else {
          setReflection(data as Reflection | null);
        }
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [readingId, userId]);

  const save = useCallback(
    async (payload: SavePayload) => {
      if (!readingId || !userId) return;
      setIsSaving(true);
      setError(null);

      try {
        const { data, error: err } = await supabase
          .from('reflections')
          .upsert(
            {
              reading_id: readingId,
              user_id: userId,
              feeling: payload.feeling,
              alignment: payload.alignment,
              content: payload.content,
            },
            { onConflict: 'reading_id,user_id' }
          )
          .select('id, reading_id, feeling, alignment, content, created_at')
          .single();

        if (err) throw err;
        setReflection(data as Reflection);
      } catch (err) {
        const message = err instanceof Error ? err.message : JSON.stringify(err);
        setError(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [readingId, userId]
  );

  return { reflection, isLoading, isSaving, error, save };
}
