/**
 * Tarot card draw algorithm
 *
 * Two draw paths:
 *   - Daily card: seeded by userId + date — deterministic, same result all day
 *   - Live draws: crypto.getRandomValues() — cryptographically random
 *
 * Both paths use Fisher-Yates for a provably uniform shuffle.
 * The crypto path uses rejection sampling to eliminate modulo bias.
 *
 * Generic over ID type <T> so it works with SERIAL integers (reference tables)
 * and UUID strings (user data tables) without coercion.
 */

import * as ExpoCrypto from 'expo-crypto';
import type { TarotCardOrientation } from '@/types/tarot';

// ── Seeded PRNG: mulberry32 ──────────────────────────────────────────────────
// High-quality 32-bit generator. Used only for the deterministic daily draw.
// Period: 2^32. Passes PractRand to 512GB. Fast and simple.

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

// ── String hash: djb2 ───────────────────────────────────────────────────────
// Maps a string key (userId:YYYY-MM-DD) to a uint32 seed.
// Collisions are ~1 in 4 billion — negligible for this use case.

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// ── Crypto random integer [0, max) — zero modulo bias ───────────────────────
// Uses expo-crypto (available on iOS, Android, and web via Expo SDK).
// Rejection sampling: discard values in the tail that would over-represent
// low integers if we used simple modulo. Expected iterations: < 2.

function cryptoRandomInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let value: number;
  do {
    ExpoCrypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

// ── Fisher-Yates shuffle ─────────────────────────────────────────────────────
// Every permutation is equally likely. O(n) time, O(n) space.

function fisherYates<T>(items: T[], randomInt: (max: number) => number): T[] {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface DrawOptions<T> {
  /** Whether reversed cards are possible. Defaults to true. */
  allowReversals?: boolean;
  /** IDs to exclude (e.g. recently drawn). Falls back to full deck if all excluded. */
  excludeIds?: T[];
}

export interface DrawResult<T> {
  cardId: T;
  orientation: TarotCardOrientation;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildAvailableDeck<T>(allIds: T[], excludeIds: T[]): T[] {
  if (excludeIds.length === 0) return allIds;
  // Use string coercion for the Set so both number and string IDs compare correctly
  const excluded = new Set(excludeIds.map(String));
  const available = allIds.filter((id) => !excluded.has(String(id)));
  return available.length > 0 ? available : allIds;
}

function pickOrientation(
  allowReversals: boolean,
  randomInt: (max: number) => number,
): TarotCardOrientation {
  if (!allowReversals) return 'upright';
  return randomInt(2) === 1 ? 'reversed' : 'upright';
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Daily card draw — deterministic for a given user on a given calendar date.
 *
 * The same (userId, date) pair always produces the same card, so the user sees
 * a consistent "card of the day" regardless of how many times they open the app.
 * The seed rotates at midnight local time.
 *
 * @param allCardIds  All card IDs from the database (number[] for SERIAL tables).
 * @param userId      Supabase user UUID — personalises the draw per user.
 * @param date        Date to draw for. Defaults to today (local time).
 * @param options     allowReversals, excludeIds.
 */
export function drawDailyCard<T>(
  allCardIds: T[],
  userId: string,
  date: Date = new Date(),
  options: DrawOptions<T> = {},
): DrawResult<T> {
  const { allowReversals = true, excludeIds = [] } = options;

  const dateKey = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  const seed = djb2(`${userId}:${dateKey}`);
  const rand = mulberry32(seed);
  const randInt = (max: number) => Math.floor(rand() * max);

  const deck = buildAvailableDeck(allCardIds, excludeIds);
  const shuffled = fisherYates(deck, randInt);

  return {
    cardId: shuffled[0],
    orientation: pickOrientation(allowReversals, randInt),
  };
}

/**
 * Single random card draw — cryptographically random.
 * Use for on-demand draws where you want genuine entropy.
 */
export function drawCard<T>(allCardIds: T[], options: DrawOptions<T> = {}): DrawResult<T> {
  const { allowReversals = true, excludeIds = [] } = options;

  const deck = buildAvailableDeck(allCardIds, excludeIds);
  const shuffled = fisherYates(deck, cryptoRandomInt);

  return {
    cardId: shuffled[0],
    orientation: pickOrientation(allowReversals, cryptoRandomInt),
  };
}

/**
 * Multi-card spread draw — cryptographically random, all cards unique.
 * Draws count distinct cards in a single shuffle pass.
 *
 * @param allCardIds  All card IDs from the database.
 * @param count       Number of cards to draw (e.g. 3 for Past-Present-Future).
 */
export function drawSpread<T>(
  allCardIds: T[],
  count: number,
  options: DrawOptions<T> = {},
): DrawResult<T>[] {
  const { allowReversals = true, excludeIds = [] } = options;

  const deck = buildAvailableDeck(allCardIds, excludeIds);

  if (count > deck.length) {
    throw new RangeError(`Cannot draw ${count} cards from a deck of ${deck.length}.`);
  }

  const shuffled = fisherYates(deck, cryptoRandomInt);

  return shuffled.slice(0, count).map((cardId) => ({
    cardId,
    orientation: pickOrientation(allowReversals, cryptoRandomInt),
  }));
}
