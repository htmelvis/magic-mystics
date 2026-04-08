/**
 * Free Tier History Purge
 *
 * Deletes readings and ppf_readings older than 30 days for free-tier users.
 * Reflections are removed automatically via ON DELETE CASCADE on readings.
 *
 * Scheduled via pg_cron at 03:00 UTC daily (offset from daily-metaphysical
 * at 00:01 UTC to avoid resource contention).
 *
 * Query params:
 *   ?dry_run=true  — report what would be deleted without deleting anything
 *
 * Idempotent: safe to call multiple times; rows are simply gone after the first run.
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

const EXPIRY_DAYS = 30;

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const dryRun = url.searchParams.get('dry_run') === 'true';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - EXPIRY_DAYS);
    const cutoffIso = cutoff.toISOString();

    // ── Identify free-tier users ───────────────────────────────────────────────
    // Pull the list once so we can use it for both readings and ppf_readings.
    const { data: freeSubs, error: subsError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('tier', 'free')
      .eq('is_active', true);

    if (subsError) throw subsError;

    if (!freeSubs || freeSubs.length === 0) {
      return Response.json({
        status: 'ok',
        dry_run: dryRun,
        deleted_readings: 0,
        deleted_ppf_readings: 0,
        free_user_count: 0,
        cutoff: cutoffIso,
        ran_at: new Date().toISOString(),
      });
    }

    const freeUserIds = freeSubs.map((s) => s.user_id);

    // ── Count / delete readings ────────────────────────────────────────────────
    // Reflections cascade automatically — no explicit delete needed.
    let deletedReadings = 0;
    let deletedPpf = 0;

    if (dryRun) {
      const { count: readingCount, error: rcErr } = await supabase
        .from('readings')
        .select('id', { count: 'exact', head: true })
        .in('user_id', freeUserIds)
        .lt('created_at', cutoffIso);

      if (rcErr) throw rcErr;
      deletedReadings = readingCount ?? 0;

      const { count: ppfCount, error: pcErr } = await supabase
        .from('ppf_readings')
        .select('id', { count: 'exact', head: true })
        .in('user_id', freeUserIds)
        .lt('created_at', cutoffIso);

      if (pcErr) throw pcErr;
      deletedPpf = ppfCount ?? 0;
    } else {
      const { data: deletedReadingRows, error: rdErr } = await supabase
        .from('readings')
        .delete()
        .in('user_id', freeUserIds)
        .lt('created_at', cutoffIso)
        .select('id');

      if (rdErr) throw rdErr;
      deletedReadings = deletedReadingRows?.length ?? 0;

      const { data: deletedPpfRows, error: pdErr } = await supabase
        .from('ppf_readings')
        .delete()
        .in('user_id', freeUserIds)
        .lt('created_at', cutoffIso)
        .select('id');

      if (pdErr) throw pdErr;
      deletedPpf = deletedPpfRows?.length ?? 0;
    }

    const result = {
      status: 'ok',
      dry_run: dryRun,
      deleted_readings: deletedReadings,
      deleted_ppf_readings: deletedPpf,
      free_user_count: freeUserIds.length,
      cutoff: cutoffIso,
      ran_at: new Date().toISOString(),
    };

    console.log('[purge-free-history]', JSON.stringify(result));
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[purge-free-history] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
});
