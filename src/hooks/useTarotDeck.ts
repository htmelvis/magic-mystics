import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase/client';

export interface TarotCardMeta {
  id: number;
  name: string;
  arcana: string;
  suit: string | null;
  number: number | null;
}

async function fetchTarotDeck(): Promise<TarotCardMeta[]> {
  const { data, error } = await supabase
    .from('tarot_cards')
    .select('id, name, arcana, suit, number')
    .order('arcana', { ascending: false }) // Major first, then Minor
    .order('number', { ascending: true });

  if (error) throw error;
  return data as TarotCardMeta[];
}

/**
 * Loads the full 78-card deck metadata once per session and caches it forever.
 *
 * The tarot deck is static reference data — it never changes after seeding.
 * staleTime: Infinity means React Query will never refetch in the background,
 * and gcTime: Infinity keeps it in memory for the lifetime of the app session.
 *
 * Every component that calls this hook shares the same cached result — there
 * is only ever one network request regardless of how many draws occur.
 */
export function useTarotDeck() {
  const {
    data: deck = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tarot-deck'],
    queryFn: fetchTarotDeck,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const cardIds = deck.map(c => c.id);

  return { deck, cardIds, isLoading, error };
}
