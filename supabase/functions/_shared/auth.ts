/**
 * Shared authorization guard for cost-bearing daily edge functions.
 *
 * These functions (daily-metaphysical, daily-planetary, daily-horoscopes, …) each
 * make a paid Anthropic call per invocation and are meant to be triggered only by
 * the pg_cron job (and by developers running manual backfills). Supabase's default
 * `verify_jwt` gate is NOT sufficient on its own: it accepts any project-signed JWT,
 * including the public anon key and every end-user access token. This guard adds an
 * explicit authorization decision on top, based on a dedicated shared secret sent in
 * the `x-cron-secret` header and compared against DAILY_CRON_SECRET in the function
 * environment.
 *
 * Behavior:
 *   - Fails CLOSED: if DAILY_CRON_SECRET is unset, every request is rejected.
 *   - Constant-time comparison so the check does not leak the secret via timing.
 *   - Returns a bare 401 (no reason disclosed) on failure, or null when authorized.
 *   - Logs unauthorized attempts WITHOUT echoing the presented secret.
 *
 * Usage — call as the FIRST statement in the handler, before any DB read, astronomy
 * computation, or Anthropic client construction:
 *
 *   const denied = requireCronSecret(req, 'daily-metaphysical');
 *   if (denied) return denied;
 */

export const CRON_SECRET_HEADER = 'x-cron-secret';

/**
 * Length-safe, constant-time string comparison. Accumulates byte differences over
 * the full length of the longer input rather than returning early, so neither a
 * length mismatch nor an early-differing byte shortens the comparison.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);

  // A length difference is itself a mismatch, but we still walk the full range so
  // the loop's duration does not depend on where (or whether) the values diverge.
  let mismatch = aBytes.length === bBytes.length ? 0 : 1;
  const len = Math.max(aBytes.length, bBytes.length);
  for (let i = 0; i < len; i++) {
    mismatch |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return mismatch === 0;
}

function unauthorized(): Response {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

/**
 * Validates the incoming request's `x-cron-secret` header against DAILY_CRON_SECRET.
 * Returns a 401 Response to return immediately when unauthorized, or null when the
 * caller is authorized and the handler should proceed.
 */
export function requireCronSecret(req: Request, fnName: string): Response | null {
  const expected = Deno.env.get('DAILY_CRON_SECRET');
  const provided = req.headers.get(CRON_SECRET_HEADER);

  // Fail closed: a missing/misconfigured secret must reject everything, never allow.
  if (!expected) {
    console.error(
      `[${fnName}] DAILY_CRON_SECRET is not configured; rejecting all requests.`
    );
    return unauthorized();
  }

  if (!provided || !timingSafeEqual(provided, expected)) {
    console.warn(
      `[${fnName}] Rejected unauthorized request (missing or invalid ${CRON_SECRET_HEADER}).`
    );
    return unauthorized();
  }

  return null;
}
