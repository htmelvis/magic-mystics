import { supabase } from './client';

export const PAGE_SIZE = 20;

export interface JournalRow {
  id: string;
  user_id: string;
  reading_id: string | null;
  title: string | null;
  body: string;
  ai_prompt: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchJournalsPage(userId: string, offset: number): Promise<JournalRow[]> {
  const { data, error } = await supabase
    .from('journals')
    .select('id, user_id, reading_id, title, body, ai_prompt, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);
  if (error) throw error;
  return data ?? [];
}

export async function fetchJournal(journalId: string): Promise<JournalRow> {
  const { data, error } = await supabase
    .from('journals')
    .select('id, user_id, reading_id, title, body, ai_prompt, created_at, updated_at')
    .eq('id', journalId)
    .single();
  if (error) throw error;
  return data;
}

export interface InsertJournalPayload {
  user_id: string;
  reading_id?: string | null;
  title?: string | null;
  body?: string;
  ai_prompt?: string | null;
}

export async function insertJournal(payload: InsertJournalPayload): Promise<JournalRow> {
  const { data, error } = await supabase.from('journals').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export interface UpdateJournalPayload {
  title?: string | null;
  body?: string;
}

export async function updateJournal(
  journalId: string,
  payload: UpdateJournalPayload
): Promise<JournalRow> {
  const { data, error } = await supabase
    .from('journals')
    .update(payload)
    .eq('id', journalId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function fetchJournalByReadingId(
  readingId: string,
  userId: string
): Promise<JournalRow | null> {
  const { data, error } = await supabase
    .from('journals')
    .select('id, user_id, reading_id, title, body, ai_prompt, created_at, updated_at')
    .eq('reading_id', readingId)
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteJournal(journalId: string): Promise<void> {
  const { error } = await supabase.from('journals').delete().eq('id', journalId);
  if (error) throw error;
}
