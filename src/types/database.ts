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
          birth_lat: number | null;
          birth_lng: number | null;
          birth_timezone: string | null;
          birth_details_edited_at: string | null;
          sun_sign: string | null;
          moon_sign: string | null;
          rising_sign: string | null;
          natal_chart_data: unknown;
          tarot_card_id: number | null;
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
          birth_lat?: number | null;
          birth_lng?: number | null;
          birth_timezone?: string | null;
          birth_details_edited_at?: string | null;
          sun_sign?: string | null;
          moon_sign?: string | null;
          rising_sign?: string | null;
          natal_chart_data?: unknown;
          tarot_card_id?: number | null;
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
          birth_lat?: number | null;
          birth_lng?: number | null;
          birth_timezone?: string | null;
          birth_details_edited_at?: string | null;
          sun_sign?: string | null;
          moon_sign?: string | null;
          rising_sign?: string | null;
          natal_chart_data?: unknown;
          tarot_card_id?: number | null;
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
          spread_type: 'daily' | 'past-present-future' | 'relationship' | 'situation-obstacle-solution' | 'mind-body-spirit' | 'path-choice' | 'accept-embrace-let-go';
          drawn_cards: unknown;
          ai_insight: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          spread_type: 'daily' | 'past-present-future' | 'relationship' | 'situation-obstacle-solution' | 'mind-body-spirit' | 'path-choice' | 'accept-embrace-let-go';
          drawn_cards: unknown;
          ai_insight?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          spread_type?: 'daily' | 'past-present-future' | 'relationship' | 'situation-obstacle-solution' | 'mind-body-spirit' | 'path-choice';
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
      tarot_cards: {
        Row: {
          id: number;
          name: string;
          arcana: 'Major' | 'Minor';
          suit: 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null;
          number: number | null;
          court_rank: 'Page' | 'Knight' | 'Queen' | 'King' | null;
          upright_meaning_long: string | null;
          reversed_meaning_long: string | null;
          upright_summary: string | null;
          reversed_summary: string | null;
          keywords_upright: string[] | null;
          keywords_reversed: string[] | null;
          imagery_description: string | null;
          symbolism: unknown;
          element: string | null;
          astrology_association: string | null;
          numerology: number | null;
          image_url: string | null;
          thumbnail_url: string | null;
          description: string | null;
          metadata: unknown;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          arcana: 'Major' | 'Minor';
          suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null;
          number?: number | null;
          court_rank?: 'Page' | 'Knight' | 'Queen' | 'King' | null;
          upright_meaning_long?: string | null;
          reversed_meaning_long?: string | null;
          upright_summary?: string | null;
          reversed_summary?: string | null;
          keywords_upright?: string[] | null;
          keywords_reversed?: string[] | null;
          imagery_description?: string | null;
          symbolism?: unknown;
          element?: string | null;
          astrology_association?: string | null;
          numerology?: number | null;
          image_url?: string | null;
          thumbnail_url?: string | null;
          description?: string | null;
          metadata?: unknown;
        };
        Update: {
          name?: string;
          upright_meaning_long?: string | null;
          reversed_meaning_long?: string | null;
          upright_summary?: string | null;
          reversed_summary?: string | null;
          keywords_upright?: string[] | null;
          keywords_reversed?: string[] | null;
          imagery_description?: string | null;
          symbolism?: unknown;
          image_url?: string | null;
          thumbnail_url?: string | null;
        };
        Relationships: [];
      };
      daily_metaphysical_data: {
        Row: {
          id: number;
          date: string;
          lucky_numbers: number[] | null;
          lucky_colors: string[] | null;
          recommended_crystal_id: number | null;
          recommended_tarot_card_id: number | null;
          moon_phase: string | null;
          moon_sign_id: number | null;
          retrograde_planets: string[] | null;
          energy_theme: string | null;
          advice: string | null;
          metadata: unknown;
          created_at: string;
        };
        Insert: {
          id?: number;
          date: string;
          lucky_numbers?: number[] | null;
          lucky_colors?: string[] | null;
          recommended_crystal_id?: number | null;
          recommended_tarot_card_id?: number | null;
          moon_phase?: string | null;
          moon_sign_id?: number | null;
          retrograde_planets?: string[] | null;
          energy_theme?: string | null;
          advice?: string | null;
          metadata?: unknown;
          created_at?: string;
        };
        Update: {
          date?: string;
          lucky_numbers?: number[] | null;
          lucky_colors?: string[] | null;
          recommended_crystal_id?: number | null;
          recommended_tarot_card_id?: number | null;
          moon_phase?: string | null;
          moon_sign_id?: number | null;
          retrograde_planets?: string[] | null;
          energy_theme?: string | null;
          advice?: string | null;
          metadata?: unknown;
        };
        Relationships: [];
      };
      daily_planetary_alignment: {
        Row: {
          id: number;
          date: string;
          dominant_planet: string;
          dominant_planet_sign: string;
          dominant_planet_symbol: string | null;
          alignment_theme: string | null;
          supported_endeavors: string[] | null;
          all_planet_positions: unknown;
          advice: string | null;
          metadata: unknown;
          created_at: string;
        };
        Insert: {
          id?: number;
          date: string;
          dominant_planet: string;
          dominant_planet_sign: string;
          dominant_planet_symbol?: string | null;
          alignment_theme?: string | null;
          supported_endeavors?: string[] | null;
          all_planet_positions?: unknown;
          advice?: string | null;
          metadata?: unknown;
          created_at?: string;
        };
        Update: {
          dominant_planet?: string;
          dominant_planet_sign?: string;
          dominant_planet_symbol?: string | null;
          alignment_theme?: string | null;
          supported_endeavors?: string[] | null;
          all_planet_positions?: unknown;
          advice?: string | null;
          metadata?: unknown;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          message: string;
          app_version: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          message: string;
          app_version?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          category?: string;
          message?: string;
          app_version?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      zodiac_signs: {
        Row: {
          id: number;
          name: string;
          symbol: string;
          element: 'Fire' | 'Earth' | 'Air' | 'Water';
          modality: 'Cardinal' | 'Fixed' | 'Mutable';
          ruling_planet: string | null;
          date_range_start: string;
          date_range_end: string;
          description: string | null;
          keywords: string[] | null;
          strengths: string[] | null;
          weaknesses: string[] | null;
          metadata: unknown;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          symbol: string;
          element: 'Fire' | 'Earth' | 'Air' | 'Water';
          modality: 'Cardinal' | 'Fixed' | 'Mutable';
          ruling_planet?: string | null;
          date_range_start: string;
          date_range_end: string;
          description?: string | null;
          keywords?: string[] | null;
          strengths?: string[] | null;
          weaknesses?: string[] | null;
          metadata?: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          symbol?: string;
          element?: 'Fire' | 'Earth' | 'Air' | 'Water';
          modality?: 'Cardinal' | 'Fixed' | 'Mutable';
          ruling_planet?: string | null;
          date_range_start?: string;
          date_range_end?: string;
          description?: string | null;
          keywords?: string[] | null;
          strengths?: string[] | null;
          weaknesses?: string[] | null;
          metadata?: unknown;
          updated_at?: string;
        };
        Relationships: [];
      };
      zodiac_tarot_associations: {
        Row: {
          id: number;
          zodiac_sign_id: number;
          tarot_card_id: number;
          association_type: string;
          strength: number | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          zodiac_sign_id: number;
          tarot_card_id: number;
          association_type: string;
          strength?: number | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          zodiac_sign_id?: number;
          tarot_card_id?: number;
          association_type?: string;
          strength?: number | null;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'zodiac_tarot_associations_tarot_card_id_fkey';
            columns: ['tarot_card_id'];
            isOneToOne: false;
            referencedRelation: 'tarot_cards';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'zodiac_tarot_associations_zodiac_sign_id_fkey';
            columns: ['zodiac_sign_id'];
            isOneToOne: false;
            referencedRelation: 'zodiac_signs';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
}
