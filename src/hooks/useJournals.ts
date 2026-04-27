import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchJournalsPage,
  fetchJournal,
  fetchJournalByReadingId,
  insertJournal,
  updateJournal,
  deleteJournal,
  PAGE_SIZE,
  type InsertJournalPayload,
  type UpdateJournalPayload,
} from '@lib/supabase/journals';

export type { JournalRow } from '@lib/supabase/journals';

export function useJournals(userId: string | undefined) {
  return useInfiniteQuery({
    queryKey: ['journals', userId],
    queryFn: ({ pageParam }) => fetchJournalsPage(userId!, pageParam as number),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.flat().length,
    initialPageParam: 0,
    enabled: !!userId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function useJournalByReading(
  readingId: string | null | undefined,
  userId: string | null | undefined
) {
  return useQuery({
    queryKey: ['journal-by-reading', readingId, userId],
    queryFn: () => fetchJournalByReadingId(readingId!, userId!),
    enabled: !!readingId && !!userId,
    staleTime: 60_000,
  });
}

export function useJournal(journalId: string | undefined) {
  return useQuery({
    queryKey: ['journal', journalId],
    queryFn: () => fetchJournal(journalId!),
    enabled: !!journalId,
    staleTime: 60_000,
  });
}

export function useCreateJournal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InsertJournalPayload) => insertJournal(payload),
    onSuccess: data => {
      qc.invalidateQueries({ queryKey: ['journals', data.user_id] });
    },
  });
}

export function useUpdateJournal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateJournalPayload }) =>
      updateJournal(id, payload),
    onSuccess: data => {
      qc.invalidateQueries({ queryKey: ['journals', data.user_id] });
      qc.invalidateQueries({ queryKey: ['journal', data.id] });
    },
  });
}

export function useDeleteJournal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      deleteJournal(id).then(() => ({ id, userId })),
    onSuccess: ({ id, userId }) => {
      qc.invalidateQueries({ queryKey: ['journals', userId] });
      qc.removeQueries({ queryKey: ['journal', id] });
    },
  });
}
