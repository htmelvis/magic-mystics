import { ImageResponse } from 'workers-og';
import type { Env, ShareableReading } from './types';

// Google Fonts TTF delivery — fetched once per isolate, then cached in the
// edge cache (honoring Google's cache headers). Cheap enough to re-fetch on
// cold start; the image endpoint itself is KV-cached so this runs rarely.
const FONT_INTER_600 =
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.ttf';
const FONT_PLAYFAIR_700 =
  'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTngieFN9QV_LTQ_kk1j.ttf';

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { cf: { cacheTtl: 60 * 60 * 24 * 30 } as RequestInitCfProperties });
  if (!res.ok) throw new Error(`Font load failed: ${url} → ${res.status}`);
  return await res.arrayBuffer();
}

const SUIT_GLYPH: Record<string, string> = {
  Wands: '🔥',
  Cups: '🜄',
  Swords: '🜁',
  Pentacles: '🜃',
};

function escape(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

function buildHtml(reading: ShareableReading): string {
  const isReversed = reading.primary_card_orientation === 'reversed';
  const arcana = reading.primary_card_arcana;
  const name = escape(reading.primary_card_name);
  const suit = reading.primary_card_suit;
  const glyph = suit ? (SUIT_GLYPH[suit] ?? '✦') : '✦';
  const summary = escape(truncate((reading.primary_card_summary ?? '').trim(), 140));
  const subtitle =
    arcana === 'Major'
      ? 'Major Arcana'
      : `${reading.primary_card_number != null ? `${reading.primary_card_number} of ` : ''}${suit ?? ''}`;
  const cardCountLabel = reading.card_count > 1 ? `${reading.card_count}-card spread · ` : '';

  // Satori renders CSS subset — keep layouts flex-based, no backdrop-filter,
  // no animations, no z-index stacking games.
  return `
  <div style="display:flex;width:1200px;height:630px;padding:56px;color:#f1e9ff;font-family:'Inter';background:linear-gradient(135deg,#1a0b3d 0%,#0a0420 55%,#050110 100%);">
    <div style="display:flex;flex-direction:column;flex:1;justify-content:space-between;">
      <div style="display:flex;flex-direction:column;">
        <div style="display:flex;font-size:20px;letter-spacing:8px;text-transform:uppercase;opacity:0.7;">✦ Magic Mystics ✦</div>
        <div style="display:flex;font-size:18px;opacity:0.55;margin-top:12px;letter-spacing:2px;text-transform:uppercase;">${cardCountLabel}${isReversed ? 'Reversed' : 'Upright'}</div>
      </div>

      <div style="display:flex;flex-direction:column;max-width:560px;">
        <div style="display:flex;font-family:'Playfair';font-size:76px;line-height:1.05;font-weight:700;color:#fff;">${name}</div>
        <div style="display:flex;font-size:22px;opacity:0.7;margin-top:18px;">${escape(subtitle)}</div>
        ${summary ? `<div style="display:flex;font-size:22px;line-height:1.5;margin-top:32px;opacity:0.85;font-style:italic;">${summary}</div>` : ''}
      </div>

      <div style="display:flex;font-size:18px;opacity:0.65;letter-spacing:1px;">Pull your card at magicmystics.com</div>
    </div>

    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:340px;height:480px;border:2px solid rgba(192,132,252,0.5);border-radius:28px;background:linear-gradient(160deg,rgba(139,92,246,0.2),rgba(10,4,32,0.8));margin-top:35px;padding:32px;">
      <div style="display:flex;font-size:120px;line-height:1;${isReversed ? 'transform:rotate(180deg);' : ''}">${glyph}</div>
      <div style="display:flex;font-family:'Playfair';font-size:28px;line-height:1.1;margin-top:32px;text-align:center;color:#fff;${isReversed ? 'transform:rotate(180deg);' : ''}">${name}</div>
      ${isReversed ? `<div style="display:flex;font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#c084fc;margin-top:20px;">Reversed</div>` : ''}
    </div>
  </div>`;
}

export async function renderShareImage(_env: Env, reading: ShareableReading): Promise<Response> {
  const [inter, playfair] = await Promise.all([
    loadFont(FONT_INTER_600),
    loadFont(FONT_PLAYFAIR_700),
  ]);

  return new ImageResponse(buildHtml(reading), {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: inter, weight: 600, style: 'normal' },
      { name: 'Playfair', data: playfair, weight: 700, style: 'normal' },
    ],
  });
}
