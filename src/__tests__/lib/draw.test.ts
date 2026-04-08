// expo-crypto is mocked below because jest runs in Node, not on device.
// The mock makes getRandomValues fill a Uint32Array with incrementing values
// so tests are deterministic without needing actual crypto entropy.
jest.mock('expo-crypto', () => ({
  getRandomValues: (buf: Uint32Array) => {
    for (let i = 0; i < buf.length; i++) buf[i] = i + 1;
    return buf;
  },
}));

import { drawDailyCard, drawCard, drawSpread } from '@lib/tarot/draw';

const DECK = Array.from({ length: 78 }, (_, i) => i + 1); // IDs 1–78
const USER_ID = 'user-abc-123';

// ── drawDailyCard ─────────────────────────────────────────────────────────────

describe('drawDailyCard', () => {
  it('returns a card from the deck', () => {
    const { cardId } = drawDailyCard(DECK, USER_ID, new Date('2024-01-01'));
    expect(DECK).toContain(cardId);
  });

  it('is deterministic — same user + date always yields same card', () => {
    const date = new Date('2024-06-15');
    const a = drawDailyCard(DECK, USER_ID, date);
    const b = drawDailyCard(DECK, USER_ID, date);
    expect(a.cardId).toBe(b.cardId);
    expect(a.orientation).toBe(b.orientation);
  });

  it('differs across days for the same user', () => {
    const day1 = drawDailyCard(DECK, USER_ID, new Date('2024-01-01'));
    const day2 = drawDailyCard(DECK, USER_ID, new Date('2024-01-02'));
    // Different seeds almost certainly produce different cards
    expect(day1.cardId).not.toBe(day2.cardId);
  });

  it('differs across users on the same day', () => {
    const date = new Date('2024-01-01');
    const user1 = drawDailyCard(DECK, 'user-aaa', date);
    const user2 = drawDailyCard(DECK, 'user-bbb', date);
    expect(user1.cardId).not.toBe(user2.cardId);
  });

  it('returns a valid orientation', () => {
    const { orientation } = drawDailyCard(DECK, USER_ID, new Date('2024-01-01'));
    expect(['upright', 'reversed']).toContain(orientation);
  });

  it('always returns upright when allowReversals is false', () => {
    const { orientation } = drawDailyCard(DECK, USER_ID, new Date('2024-01-01'), {
      allowReversals: false,
    });
    expect(orientation).toBe('upright');
  });

  it('respects excludeIds — does not return excluded card', () => {
    const date = new Date('2024-01-01');
    // Draw without exclusions to find the daily card
    const { cardId: normalCard } = drawDailyCard(DECK, USER_ID, date);
    // Exclude that card and draw again
    const { cardId: excluded } = drawDailyCard(DECK, USER_ID, date, {
      excludeIds: [normalCard],
    });
    expect(excluded).not.toBe(normalCard);
  });

  it('falls back to full deck if all IDs are excluded', () => {
    const { cardId } = drawDailyCard(DECK, USER_ID, new Date('2024-01-01'), {
      excludeIds: [...DECK],
    });
    expect(DECK).toContain(cardId);
  });

  it('works with string IDs', () => {
    const uuidDeck = ['uuid-1', 'uuid-2', 'uuid-3'];
    const { cardId } = drawDailyCard(uuidDeck, USER_ID, new Date('2024-01-01'));
    expect(uuidDeck).toContain(cardId);
  });
});

// ── drawCard ──────────────────────────────────────────────────────────────────

describe('drawCard', () => {
  it('returns a card from the deck', () => {
    const { cardId } = drawCard(DECK);
    expect(DECK).toContain(cardId);
  });

  it('returns a valid orientation', () => {
    const { orientation } = drawCard(DECK);
    expect(['upright', 'reversed']).toContain(orientation);
  });

  it('always returns upright when allowReversals is false', () => {
    const { orientation } = drawCard(DECK, { allowReversals: false });
    expect(orientation).toBe('upright');
  });

  it('respects excludeIds', () => {
    const smallDeck = [1, 2, 3];
    const { cardId } = drawCard(smallDeck, { excludeIds: [1, 2] });
    expect(cardId).toBe(3);
  });
});

// ── drawSpread ────────────────────────────────────────────────────────────────

describe('drawSpread', () => {
  it('returns exactly count cards', () => {
    const results = drawSpread(DECK, 3);
    expect(results).toHaveLength(3);
  });

  it('returns no duplicate cardIds in a spread', () => {
    const results = drawSpread(DECK, 10);
    const ids = results.map((r) => r.cardId);
    expect(new Set(ids).size).toBe(10);
  });

  it('all cards come from the deck', () => {
    const results = drawSpread(DECK, 5);
    results.forEach(({ cardId }) => expect(DECK).toContain(cardId));
  });

  it('all orientations are valid', () => {
    const results = drawSpread(DECK, 5);
    results.forEach(({ orientation }) => {
      expect(['upright', 'reversed']).toContain(orientation);
    });
  });

  it('throws RangeError when count exceeds deck size', () => {
    const tinyDeck = [1, 2];
    expect(() => drawSpread(tinyDeck, 3)).toThrow(RangeError);
    expect(() => drawSpread(tinyDeck, 3)).toThrow(/Cannot draw 3 cards from a deck of 2/);
  });

  it('draws exactly count=1 without error', () => {
    const results = drawSpread(DECK, 1);
    expect(results).toHaveLength(1);
    expect(DECK).toContain(results[0].cardId);
  });
});
