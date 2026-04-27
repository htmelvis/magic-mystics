import type { Env } from './types';

// Apple App Site Association — authorises universal links for links.magicmystics.com.
// Must be served at /.well-known/apple-app-site-association with
// Content-Type: application/json and NO file extension.
export function renderAASA(env: Env): Response {
  const body = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `APPLE_TEAM_ID.${env.IOS_BUNDLE_ID}`,
          paths: ['/reading/*'],
        },
      ],
    },
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// Android Digital Asset Links — authorises the package for auto-verified
// intent filters on links.magicmystics.com.
// Must be served at /.well-known/assetlinks.json with Content-Type: application/json.
export function renderAssetLinks(env: Env): Response {
  const fingerprints = env.ANDROID_SHA256.split(',').map((s) => s.trim()).filter(Boolean);
  const body = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: env.ANDROID_PACKAGE,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ];
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
