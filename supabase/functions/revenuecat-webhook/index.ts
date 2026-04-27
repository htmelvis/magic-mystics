/**
 * RevenueCat Webhook Handler
 *
 * Keeps the Supabase subscriptions table in sync with RevenueCat events.
 * This is the authoritative source of truth for subscription state — the
 * client-side purchase flow does an optimistic update, but this webhook
 * corrects any drift on renewal, cancellation, or billing failure.
 *
 * Setup in RevenueCat dashboard:
 *   Project → Integrations → Webhooks → Add URL:
 *   https://<project>.supabase.co/functions/v1/revenuecat-webhook
 *
 * Required environment variables:
 *   REVENUECAT_WEBHOOK_SECRET — shared secret set in RevenueCat dashboard
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

// RevenueCat event types that affect subscription status.
// https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields
type RevenueCatEventType =
  | 'INITIAL_PURCHASE'
  | 'RENEWAL'
  | 'CANCELLATION'
  | 'EXPIRATION'
  | 'BILLING_ISSUE'
  | 'PRODUCT_CHANGE'
  | 'TRANSFER'
  | 'UNCANCELLATION';

interface RevenueCatEvent {
  type: RevenueCatEventType;
  app_user_id: string;
  expiration_at_ms: number | null;
  cancel_reason?: string;
  product_id?: string;
}

interface RevenueCatWebhookPayload {
  api_version: string;
  event: RevenueCatEvent;
}

// Events that grant or extend premium access.
const GRANT_EVENTS: RevenueCatEventType[] = ['INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION'];

// Events that revoke premium access.
const REVOKE_EVENTS: RevenueCatEventType[] = ['EXPIRATION', 'BILLING_ISSUE'];

// CANCELLATION means the user won't renew — but they keep access until expiry_date.
// We record it but keep is_active true until EXPIRATION fires.

Deno.serve(async (req: Request) => {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const secret = req.headers.get('X-RevenueCat-Shared-Secret');
    if (secret !== Deno.env.get('REVENUECAT_WEBHOOK_SECRET')) {
      return new Response('Unauthorized', { status: 401 });
    }

    const payload: RevenueCatWebhookPayload = await req.json();
    const { type, app_user_id, expiration_at_ms } = payload.event;

    console.log(`[revenuecat-webhook] ${type} for user ${app_user_id}`);

    // Ignore events we don't act on (e.g. TRANSFER, PRODUCT_CHANGE).
    if (![...GRANT_EVENTS, ...REVOKE_EVENTS, 'CANCELLATION'].includes(type)) {
      return Response.json({ status: 'ignored', type });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const isGrant = GRANT_EVENTS.includes(type);
    const isRevoke = REVOKE_EVENTS.includes(type);
    const isCancellation = type === 'CANCELLATION';

    const expiryDate = expiration_at_ms ? new Date(expiration_at_ms).toISOString() : null;

    const update = isGrant
      ? { tier: 'premium', is_active: true, expiry_date: expiryDate }
      : isRevoke
        ? { tier: 'free', is_active: false, expiry_date: expiryDate }
        : isCancellation
          ? // Keep is_active true — user retains access until expiry_date.
            { tier: 'premium', is_active: true, expiry_date: expiryDate }
          : null;

    if (!update) {
      return Response.json({ status: 'ignored', type });
    }

    const { error } = await supabase
      .from('subscriptions')
      .update(update)
      .eq('user_id', app_user_id);

    if (error) throw error;

    return Response.json({ status: 'ok', type, user: app_user_id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[revenuecat-webhook] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
});
