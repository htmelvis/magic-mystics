export type TarotCardSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

/** Raw row shape returned by Supabase `select('*')` on the tarot_cards table. */
export interface TarotCardRow {
  id: number;
  name: string;
  arcana: 'Major' | 'Minor';
  suit: string | null;
  number: number | null;
  image_url: string | null;
  element: string | null;
  astrology_association: string | null;
  upright_summary: string | null;
  reversed_summary: string | null;
  upright_meaning_long: string | null;
  reversed_meaning_long: string | null;
  keywords_upright: string[] | null;
  keywords_reversed: string[] | null;
}

/**
 * Snapshot stored in readings.drawn_cards JSONB.
 * Intentionally denormalized — captures enough identity to render history
 * lists without joining back to tarot_cards. Full card details (meanings,
 * symbolism, imagery) are fetched on demand from tarot_cards by id.
 */
export interface DrawnCardRecord {
  cardId: number;
  cardName: string;
  arcana: 'Major' | 'Minor';
  suit: 'Wands' | 'Cups' | 'Swords' | 'Pentacles' | null;
  orientation: TarotCardOrientation;
  position: string | null;
}

export type TarotCardOrientation = 'upright' | 'reversed';

export interface TarotCard {
  id: string;
  name: string;
  suit: TarotCardSuit;
  number: number | null; // null for Major Arcana with names only
  imageUrl: string;
  keywords: {
    upright: string[];
    reversed: string[];
  };
  meaning: {
    upright: string;
    reversed: string;
  };
}

export interface DrawnCard {
  card: TarotCard;
  orientation: TarotCardOrientation;
  position?: 'past' | 'present' | 'future'; // For PPF spread
}

export type SpreadType = 'daily' | 'past-present-future';

export interface Reading {
  id: string;
  userId: string;
  spreadType: SpreadType;
  drawnCards: DrawnCard[];
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reflection {
  id: string;
  readingId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PPFReading {
  id: string;
  userId: string;
  pastCard: DrawnCard;
  presentCard: DrawnCard;
  futureCard: DrawnCard;
  aiInsight: string | null;
  createdAt: string;
}
