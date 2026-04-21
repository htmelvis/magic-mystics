/**
 * notify-support-ticket
 *
 * Triggered by a Supabase Database Webhook on INSERT to support_tickets.
 * Sends two emails via Resend:
 *   1. User confirmation — receipt + what they submitted
 *   2. Admin alert — full ticket details to ed@htmelvis.com
 *
 * Required Supabase secrets:
 *   RESEND_API_KEY
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ADMIN_EMAIL  (optional, falls back to ed@htmelvis.com)
 *
 * Webhook setup in Supabase dashboard:
 *   Database → Webhooks → Create webhook
 *   Table: support_tickets  |  Event: INSERT
 *   URL: https://<project>.supabase.co/functions/v1/notify-support-ticket
 *   HTTP Headers: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SupportCategory = 'bug' | 'feature' | 'account' | 'feedback';

interface SupportTicket {
  id: string;
  user_id: string;
  category: SupportCategory;
  message: string;
  app_version: string | null;
  created_at: string;
}

// Supabase DB webhook wraps the new row in a "record" field.
interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: SupportTicket;
  schema: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<SupportCategory, string> = {
  bug: 'Bug Report',
  feature: 'Feature Request',
  account: 'Account Issue',
  feedback: 'General Feedback',
};

const CATEGORY_EMOJI: Record<SupportCategory, string> = {
  bug: '🐛',
  feature: '✨',
  account: '👤',
  feedback: '💬',
};

async function sendEmail(resendKey: string, payload: {
  from: string;
  to: string;
  subject: string;
  html: string;
  reply_to?: string;
}): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

function userConfirmationHtml(ticket: SupportTicket): string {
  const label = CATEGORY_LABELS[ticket.category];
  const emoji = CATEGORY_EMOJI[ticket.category];
  const date = new Date(ticket.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We received your message</title>
</head>
<body style="margin:0;padding:0;background:#0f0a1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a1e;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:36px;">🔮</p>
              <h1 style="margin:12px 0 4px;color:#e8d5ff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                Magic Mystics
              </h1>
              <p style="margin:0;color:#9b7fc7;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">
                Support
              </p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#1a1030;border-radius:16px;padding:32px;border:1px solid #2d1f4e;">
              <p style="margin:0 0 8px;font-size:28px;text-align:center;">${emoji}</p>
              <h2 style="margin:0 0 12px;color:#e8d5ff;font-size:20px;font-weight:700;text-align:center;">
                Message received
              </h2>
              <p style="margin:0 0 24px;color:#9b7fc7;font-size:15px;line-height:1.6;text-align:center;">
                Thanks for reaching out. We read every message and will reply via email if we need more info.
              </p>

              <!-- Ticket summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a1e;border-radius:10px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:12px;">
                    <span style="color:#6b5a8e;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Type</span><br/>
                    <span style="color:#c4a8f0;font-size:14px;">${label}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <span style="color:#6b5a8e;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Submitted</span><br/>
                    <span style="color:#c4a8f0;font-size:14px;">${date}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="color:#6b5a8e;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your message</span><br/>
                    <p style="margin:6px 0 0;color:#c4a8f0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${ticket.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#9b7fc7;font-size:13px;line-height:1.6;text-align:center;">
                Need to add something? Reply directly to this email and we'll see it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;color:#4a3666;font-size:12px;">
                Magic Mystics · You're receiving this because you submitted a support request.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function adminAlertHtml(ticket: SupportTicket, userEmail: string): string {
  const label = CATEGORY_LABELS[ticket.category];
  const emoji = CATEGORY_EMOJI[ticket.category];
  const date = new Date(ticket.created_at).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const dashboardLink = `${supabaseUrl.replace('.supabase.co', '')}/project/default/editor`;
  const mailtoLink = `mailto:${userEmail}?subject=Re: Your Magic Mystics ${label}&body=Hi there,%0A%0AThanks for reaching out about your ${label.toLowerCase()}.%0A%0A`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New support ticket</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Badge -->
          <tr>
            <td style="padding-bottom:16px;">
              <span style="background:#1a1030;color:#c4a8f0;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;letter-spacing:0.5px;">
                ${emoji} ${label.toUpperCase()}
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;padding:28px;border:1px solid #e5e5e5;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
              <h2 style="margin:0 0 4px;color:#111;font-size:18px;font-weight:700;">
                New ${label}
              </h2>
              <p style="margin:0 0 24px;color:#888;font-size:13px;">${date}</p>

              <!-- User info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:20px;">
                <tr>
                  <td style="padding-bottom:10px;">
                    <span style="color:#666;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">From</span><br/>
                    <span style="color:#111;font-size:14px;">${userEmail}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;">
                    <span style="color:#666;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">User ID</span><br/>
                    <span style="color:#555;font-size:13px;font-family:monospace;">${ticket.user_id}</span>
                  </td>
                </tr>
                ${ticket.app_version ? `
                <tr>
                  <td>
                    <span style="color:#666;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">App Version</span><br/>
                    <span style="color:#555;font-size:14px;">${ticket.app_version}</span>
                  </td>
                </tr>` : ''}
              </table>

              <!-- Message -->
              <p style="margin:0 0 8px;color:#666;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Message</p>
              <p style="margin:0 0 24px;color:#222;font-size:15px;line-height:1.7;white-space:pre-wrap;background:#fafafa;border-left:3px solid #c4a8f0;padding:12px 16px;border-radius:0 6px 6px 0;">${ticket.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>

              <!-- Actions -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:12px;">
                    <a href="${mailtoLink}" style="display:inline-block;background:#1a1030;color:#e8d5ff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;">
                      Reply to user
                    </a>
                  </td>
                  <td>
                    <a href="${dashboardLink}" style="display:inline-block;background:#f0f0f0;color:#333;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:8px;">
                      Supabase dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ticket ID footer -->
          <tr>
            <td style="padding-top:16px;">
              <p style="margin:0;color:#aaa;font-size:11px;font-family:monospace;">
                Ticket ID: ${ticket.id}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  try {
    // Only accept POST from Supabase webhook
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const payload: WebhookPayload = await req.json();

    if (payload.type !== 'INSERT' || payload.table !== 'support_tickets') {
      return Response.json({ status: 'ignored' });
    }

    const ticket = payload.record;
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_EMAIL') ?? 'ed@htmelvis.com';

    if (!resendKey) throw new Error('RESEND_API_KEY not set');

    // Look up the user's email from Supabase Auth
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(ticket.user_id);
    if (userError) throw userError;

    const userEmail = userData.user?.email;
    if (!userEmail) throw new Error(`No email found for user ${ticket.user_id}`);

    const label = CATEGORY_LABELS[ticket.category];

    // Fire both emails in parallel
    await Promise.all([
      sendEmail(resendKey, {
        from: 'Magic Mystics Support <support@magicmystics.app>',
        to: userEmail,
        reply_to: adminEmail,
        subject: `We received your message ✨`,
        html: userConfirmationHtml(ticket),
      }),
      sendEmail(resendKey, {
        from: 'Magic Mystics Support <support@magicmystics.app>',
        to: adminEmail,
        reply_to: userEmail,
        subject: `[${ticket.category}] New ${label} from ${userEmail}`,
        html: adminAlertHtml(ticket, userEmail),
      }),
    ]);

    console.log(`[notify-support-ticket] Sent emails for ticket ${ticket.id} (${ticket.category})`);
    return Response.json({ status: 'ok', ticket_id: ticket.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[notify-support-ticket] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
});
