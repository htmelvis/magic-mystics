/**
 * Database type definitions mirroring the actual Supabase schema.
 *
 * All types use snake_case column names to match PostgreSQL and satisfy
 * Supabase's GenericTable / GenericSchema constraints. These are intentionally
 * separate from the camelCase app-layer types in user.ts / tarot.ts.
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          birth_date: string | null;
          birth_time: string | null;
          birth_location: string | null;
          sun_sign: string | null;
          moon_sign: string | null;
          rising_sign: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          birth_time?: string | null;
          birth_location?: string | null;
          sun_sign?: string | null;
          moon_sign?: string | null;
          rising_sign?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          birth_time?: string | null;
          birth_location?: string | null;
          sun_sign?: string | null;
          moon_sign?: string | null;
          rising_sign?: string | null;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: 'free' | 'premium';
          start_date: string;
          expiry_date: string | null;
          is_active: boolean;
          auto_renew: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier: 'free' | 'premium';
          start_date?: string;
          expiry_date?: string | null;
          is_active?: boolean;
          auto_renew?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tier?: 'free' | 'premium';
          start_date?: string;
          expiry_date?: string | null;
          is_active?: boolean;
          auto_renew?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      readings: {
        Row: {
          id: string;
          user_id: string;
          spread_type: 'daily' | 'past-present-future';
          drawn_cards: unknown;
          ai_insight: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          spread_type: 'daily' | 'past-present-future';
          drawn_cards: unknown;
          ai_insight?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          spread_type?: 'daily' | 'past-present-future';
          drawn_cards?: unknown;
          ai_insight?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      reflections: {
        Row: {
          id: string;
          reading_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reading_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ppf_readings: {
        Row: {
          id: string;
          user_id: string;
          past_card: unknown;
          present_card: unknown;
          future_card: unknown;
          ai_insight: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          past_card: unknown;
          present_card: unknown;
          future_card: unknown;
          ai_insight?: string | null;
          created_at?: string;
        };
        Update: {
          past_card?: unknown;
          present_card?: unknown;
          future_card?: unknown;
          ai_insight?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
}
