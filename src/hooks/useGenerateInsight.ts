import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';
import { parseAIInsight } from '@/types/ai-insight';
import type { AIInsight } from '@/types/ai-insight';

async function generateInsight(readingId: string): Promise<AIInsight> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('generate-reading-insight', {
    body: { reading_id: readingId },
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error) throw error;

  const insight = parseAIInsight(JSON.stringify(data.insight));
  if (!insight) throw new Error('Invalid insight response');

  return insight;
}

export function useGenerateInsight(userId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateInsight,
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: ['readings', userId] });
    },
  });
}
