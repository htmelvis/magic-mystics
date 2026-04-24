import { renderLandingHtml, renderNotFoundHtml } from './html';
import { renderShareImage } from './image';
import { fetchShareableReading } from './supabase';
import { renderAASA, renderAssetLinks } from './well-known';
import type { Env } from './types';

const READING_PATH = /^\/reading\/([0-9a-f-]{36})(?:\/image\.png)?$/i;
const IMAGE_SUFFIX = '/image.png';
const KV_TTL_SECONDS = 60 * 60; // 1h

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    if (url.pathname === '/.well-known/apple-app-site-association') {
      return renderAASA(env);
    }
    if (url.pathname === '/.well-known/assetlinks.json') {
      return renderAssetLinks(env);
    }

    const match = url.pathname.match(READING_PATH);
    if (match) {
      const readingId = match[1].toLowerCase();
      const isImage = url.pathname.endsWith(IMAGE_SUFFIX);
      return isImage
        ? handleImage(env, ctx, readingId)
        : handleLanding(env, readingId, `${url.origin}/reading/${readingId}`);
    }

    if (url.pathname === '/' || url.pathname === '') {
      return Response.redirect(env.MARKETING_URL, 302);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleLanding(env: Env, readingId: string, canonicalUrl: string): Promise<Response> {
  const reading = await fetchShareableReading(env, readingId);
  if (!reading) {
    return new Response(renderNotFoundHtml(env), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  return new Response(renderLandingHtml(env, reading, canonicalUrl), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Short cache: OG scrapers revisit on each share; reading content is stable
      // but users might edit the reflection (though reflection isn't in the HTML).
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}

async function handleImage(env: Env, ctx: ExecutionContext, readingId: string): Promise<Response> {
  const cacheKey = `png:${readingId}`;
  const cached = await env.IMAGE_CACHE.get(cacheKey, { type: 'arrayBuffer' });
  if (cached) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': `public, max-age=${KV_TTL_SECONDS}`,
        'X-Cache': 'HIT',
      },
    });
  }

  const reading = await fetchShareableReading(env, readingId);
  if (!reading) return new Response('Not found', { status: 404 });

  const imageResponse = await renderShareImage(env, reading);
  const bytes = await imageResponse.arrayBuffer();

  // Persist to KV in the background so the response isn't blocked by the write.
  ctx.waitUntil(env.IMAGE_CACHE.put(cacheKey, bytes, { expirationTtl: KV_TTL_SECONDS }));

  return new Response(bytes, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': `public, max-age=${KV_TTL_SECONDS}`,
      'X-Cache': 'MISS',
    },
  });
}
