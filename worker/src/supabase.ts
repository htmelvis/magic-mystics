import type { Env, ShareableReading } from './types';

export async function fetchShareableReading(
  env: Env,
  readingId: string
): Promise<ShareableReading | null> {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/get_shareable_reading`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_id: readingId }),
  });

  if (!res.ok) {
    console.error('[supabase] RPC failed', res.status, await res.text());
    return null;
  }

  const data = (await res.json()) as ShareableReading | null;
  return data && data.reading_id ? data : null;
}
