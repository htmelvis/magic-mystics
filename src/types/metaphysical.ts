// TypeScript types for metaphysical reference data
// Matches database schema from 003_metaphysical_reference_tables.sql

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water' | 'All';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';
export type Arcana = 'Major' | 'Minor';
export type TarotSuit = 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
export type CourtRank = 'Page' | 'Knight' | 'Queen' | 'King';

// ============== ZODIAC SIGNS ==============
export interface ZodiacSign {
  id: number;
  name: string;
  symbol: string;
  element: Element;
  modality: Modality;
  rulingPlanet: string | null;
  dateRangeStart: string; // DATE
  dateRangeEnd: string; // DATE
  description: string | null;
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ============== TAROT CARDS ==============
export interface TarotCardSymbolism {
  figures?: string[]; // People/beings in the card
  colors?: string[]; // Dominant colors and their meanings
  objects?: string[]; // Physical objects present
  background?: string; // Background description
  symbols?: string[]; // Specific symbolic elements
}

export interface TarotCardRef {
  id: number;
  name: string;
  arcana: Arcana;
  suit: TarotSuit | null;
  number: number | null;
  courtRank: CourtRank | null;
  // Short summaries (1-2 sentences)
  uprightSummary: string | null;
  reversedSummary: string | null;
  // Detailed meanings (2-3 paragraphs)
  uprightMeaningLong: string | null;
  reversedMeaningLong: string | null;
  // Keywords for quick reference
  keywordsUpright: string[];
  keywordsReversed: string[];
  // Visual description from Pictorial Key
  imageryDescription: string | null;
  symbolism: TarotCardSymbolism;
  // Associations
  element: string | null;
  astrologyAssociation: string | null;
  numerology: number | null;
  // Media
  imageUrl: string | null;
  thumbnailUrl: string | null;
  description: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ============== CRYSTALS ==============
export interface Crystal {
  id: number;
  name: string;
  scientificName: string | null;
  color: string[];
  chakra: string[];
  element: string | null;
  planetaryRuler: string | null;
  properties: string[];
  metaphysicalUses: string | null;
  physicalProperties: string | null;
  imageUrl: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ============== PLANETS ==============
export interface Planet {
  id: number;
  name: string;
  symbol: string;
  meaning: string;
  rulesSign: string[];
  keywords: string[];
  metadata: Record<string, any>;
  createdAt: string;
}

// ============== ASSOCIATIONS ==============
export interface ZodiacTarotAssociation {
  id: number;
  zodiacSignId: number;
  tarotCardId: number;
  associationType: string; // 'ruling', 'compatible', 'symbolic'
  strength: number; // 1-10
  description: string | null;
  createdAt: string;
}

export interface ZodiacCrystalAssociation {
  id: number;
  zodiacSignId: number;
  crystalId: number;
  associationType: string; // 'birthstone', 'recommended', 'healing'
  strength: number; // 1-10
  description: string | null;
  createdAt: string;
}

// ============== DAILY METAPHYSICAL DATA ==============
export interface DailyMetaphysicalData {
  id: number;
  date: string; // DATE
  luckyNumbers: number[];
  luckyColors: string[];
  recommendedCrystalId: number | null;
  recommendedTarotCardId: number | null;
  moonPhase: string | null;
  moonSignId: number | null;
  retrogradePlanets: string[];
  energyTheme: string | null;
  advice: string | null;
  metadata: Record<string, any>;
  createdAt: string;
}

// ============== JOINED DATA TYPES ==============
// For queries that join reference data with user data

export interface ZodiacSignWithAssociations extends ZodiacSign {
  crystals?: Crystal[];
  tarotCards?: TarotCardRef[];
}

export interface DailyMetaphysicalDataWithDetails extends DailyMetaphysicalData {
  recommendedCrystal?: Crystal;
  recommendedTarotCard?: TarotCardRef;
  moonSign?: ZodiacSign;
}
