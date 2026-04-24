export interface Env {
  IMAGE_CACHE: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  APP_SCHEME: string;
  APP_STORE_ID: string;
  IOS_BUNDLE_ID: string;
  ANDROID_PACKAGE: string;
  ANDROID_SHA256: string;
  MARKETING_URL: string;
}

// Shape returned by the public.get_shareable_reading RPC.
// Migration: supabase/migrations/019_reading_shares.sql.
export interface ShareableReading {
  reading_id: string;
  spread_type: string;
  card_count: number;
  shared_at: string;
  created_at: string;
  primary_card_name: string;
  primary_card_arcana: 'Major' | 'Minor';
  primary_card_suit: 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null;
  primary_card_number: number | null;
  primary_card_orientation: 'upright' | 'reversed';
  primary_card_summary: string | null;
  primary_card_image_url: string | null;
  primary_card_thumbnail_url: string | null;
}
