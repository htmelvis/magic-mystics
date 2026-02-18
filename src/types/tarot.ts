export type TarotCardSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

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
