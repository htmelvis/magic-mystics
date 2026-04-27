import type { Env, ShareableReading } from './types';

const SUIT_GLYPH: Record<string, string> = {
  Wands: '🔥',
  Cups: '💧',
  Swords: '🌬',
  Pentacles: '🌿',
};

function titleFor(reading: ShareableReading): string {
  const base = reading.primary_card_name;
  return reading.primary_card_orientation === 'reversed' ? `${base} (Reversed)` : base;
}

function descriptionFor(reading: ShareableReading): string {
  const summary = reading.primary_card_summary?.trim();
  if (summary && summary.length > 0) return summary;
  const glyph = reading.primary_card_suit ? SUIT_GLYPH[reading.primary_card_suit] ?? '✦' : '✦';
  return `${glyph} A tarot reading from Magic Mystics — draw your own card.`;
}

function escape(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderLandingHtml(env: Env, reading: ShareableReading, canonicalUrl: string): string {
  const title = titleFor(reading);
  const description = descriptionFor(reading);
  const imageUrl = `https://links.magicmystics.com/reading/${reading.reading_id}/image.png`;
  const appDeepLink = `${env.APP_SCHEME}://reading/${reading.reading_id}`;
  const universalLink = canonicalUrl;
  const appStoreUrl = env.APP_STORE_ID.startsWith('REPLACE_')
    ? env.MARKETING_URL
    : `https://apps.apple.com/app/id${env.APP_STORE_ID}`;
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${env.ANDROID_PACKAGE}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escape(title)} · Magic Mystics</title>
  <meta name="description" content="${escape(description)}" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escape(title)} · Magic Mystics" />
  <meta property="og:description" content="${escape(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${universalLink}" />
  <meta property="og:site_name" content="Magic Mystics" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escape(title)} · Magic Mystics" />
  <meta name="twitter:description" content="${escape(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />

  ${
    env.APP_STORE_ID.startsWith('REPLACE_')
      ? ''
      : `<meta name="apple-itunes-app" content="app-id=${env.APP_STORE_ID}, app-argument=${appDeepLink}" />`
  }

  <link rel="canonical" href="${universalLink}" />

  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: radial-gradient(ellipse at top, #1a0b3d 0%, #0a0420 55%, #000 100%);
      color: #f1e9ff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 20px 48px;
    }
    .wordmark { letter-spacing: 4px; font-size: 11px; opacity: 0.7; text-transform: uppercase; margin-bottom: 32px; }
    .preview {
      width: min(560px, 100%);
      aspect-ratio: 1200 / 630;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
      margin-bottom: 32px;
      background: #110033;
    }
    .preview img { width: 100%; height: 100%; display: block; }
    h1 { font-size: 28px; font-weight: 700; margin: 0 0 12px; text-align: center; }
    .subtitle { opacity: 0.7; font-size: 15px; text-align: center; margin: 0 0 32px; max-width: 520px; line-height: 1.5; }
    .ctas { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    .cta {
      background: linear-gradient(135deg, #8b5cf6, #c084fc);
      color: #fff;
      text-decoration: none;
      padding: 14px 26px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 15px;
    }
    .cta.secondary {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.18);
    }
    footer { margin-top: 48px; opacity: 0.5; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wordmark">✦ Magic Mystics ✦</div>
  <div class="preview"><img src="${imageUrl}" alt="${escape(title)}" /></div>
  <h1>${escape(title)}</h1>
  <p class="subtitle">${escape(description)}</p>
  <div class="ctas">
    <a class="cta" href="${appStoreUrl}">Get the app (iOS)</a>
    <a class="cta secondary" href="${playStoreUrl}">Get on Android</a>
  </div>
  <footer>Pull your own card at <a style="color:inherit" href="${env.MARKETING_URL}">magicmystics.com</a></footer>

  <script>
    // If the Magic Mystics app is installed on this device, try to open it.
    // Universal links handle this natively on tap; this is only a fallback
    // for users who paste/type the URL in-browser.
    (function () {
      var ua = navigator.userAgent || '';
      var isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
      if (!isMobile) return;
      // Give the page a beat so OG scrapers and desktop visitors aren't redirected.
      setTimeout(function () { window.location.href = ${JSON.stringify(appDeepLink)}; }, 50);
    })();
  </script>
</body>
</html>`;
}

export function renderNotFoundHtml(env: Env): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Reading not found · Magic Mystics</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: -apple-system, sans-serif; background: #0a0420; color: #f1e9ff;
      min-height: 100vh; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
    a { color: #c084fc; }
  </style>
</head>
<body>
  <h1>✦ Nothing here ✦</h1>
  <p>This reading was removed or never shared.</p>
  <p><a href="${env.MARKETING_URL}">Get Magic Mystics →</a></p>
</body>
</html>`;
}
