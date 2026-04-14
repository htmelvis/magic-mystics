/**
 * PPF screen tests — verify the event-driven draw pattern.
 *
 * The core invariant: supabase.insert must be called exactly once, triggered
 * by onShuffleComplete firing (a one-time animation callback), never by
 * component mount or re-render.
 */

import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Animated } from 'react-native';

// ── TarotDeck mock — captures onShuffleComplete so tests can fire it ──────────

let capturedOnShuffleComplete: (() => void) | undefined;

jest.mock('@components/tarot', () => ({
  TarotDeck: ({ onShuffleComplete }: { onShuffleComplete?: () => void }) => {
    capturedOnShuffleComplete = onShuffleComplete;
    return null;
  },
  TarotCard: () => null,
}));

// ── Supabase mock ─────────────────────────────────────────────────────────────

const mockInsert = jest.fn();
const mockInsertSingle = jest.fn();
const mockCardSingle = jest.fn();

jest.mock('@lib/supabase/client', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'readings') {
        return {
          insert: (payload: unknown) => {
            mockInsert(payload);
            return { select: () => ({ single: mockInsertSingle }) };
          },
        };
      }
      if (table === 'tarot_cards') {
        return { select: () => ({ eq: () => ({ single: mockCardSingle }) }) };
      }
      return {};
    },
  },
}));

// ── drawSpread mock — deterministic 3-card result ─────────────────────────────

jest.mock('@lib/tarot/draw', () => ({
  drawSpread: jest.fn(() => [
    { cardId: 1, orientation: 'upright' },
    { cardId: 2, orientation: 'reversed' },
    { cardId: 3, orientation: 'upright' },
  ]),
}));

const MOCK_CARD_ROW = {
  id: 1,
  name: 'The Fool',
  arcana: 'Major',
  suit: null,
  number: 0,
  image_url: null,
  element: null,
  astrology_association: null,
  upright_summary: 'New beginnings',
  reversed_summary: 'Recklessness',
  upright_meaning_long: 'A long description.',
  reversed_meaning_long: 'A reversed description.',
  keywords_upright: ['freedom', 'innocence'],
  keywords_reversed: ['recklessness'],
};

// ── Hook mocks ────────────────────────────────────────────────────────────────

jest.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-test-123', email: 'test@example.com' } }),
}));

jest.mock('@hooks/useTarotDeck', () => ({
  useTarotDeck: () => ({
    cardIds: Array.from({ length: 78 }, (_, i) => i + 1),
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@hooks/useReadings', () => ({
  useInvalidateReadings: () => jest.fn(),
}));

jest.mock('@hooks/useJourneyStats', () => ({
  useInvalidateJourneyStats: () => jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('@hooks/useReflection', () => ({
  useReflection: () => ({
    reflection: null,
    isSaving: false,
    save: jest.fn(),
  }),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

import PPFScreen from '../../../app/ppf';

describe('PPFScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnShuffleComplete = undefined;

    // Make Animated.timing resolve its callback immediately so Promise.all
    // inside handleShuffleComplete doesn't hang in tests.
    jest.spyOn(Animated, 'timing').mockReturnValue({
      start: jest.fn((cb?: (result: { finished: boolean }) => void) => {
        cb?.({ finished: true });
      }),
      stop: jest.fn(),
      reset: jest.fn(),
    } as never);

    mockInsertSingle.mockResolvedValue({ data: { id: 'reading-id-test' }, error: null });
    mockCardSingle.mockResolvedValue({ data: MOCK_CARD_ROW, error: null });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── Core invariant ───────────────────────────────────────────────────────────

  it('does not insert a reading on mount', async () => {
    render(<PPFScreen />);
    await act(async () => {});
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('inserts exactly one reading when the shuffle animation completes', async () => {
    render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    expect(mockInsert).toHaveBeenCalledTimes(1);
  });

  it('inserts with the correct user_id and spread_type', async () => {
    render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-test-123',
        spread_type: 'past-present-future',
      })
    );
  });

  it('inserts drawn_cards with past / present / future positions', async () => {
    render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    const payload = mockInsert.mock.calls[0][0];
    const positions = payload.drawn_cards.map((c: { position: string }) => c.position);
    expect(positions).toEqual(['past', 'present', 'future']);
  });

  it('fetches all 3 card rows in parallel before inserting', async () => {
    render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    expect(mockCardSingle).toHaveBeenCalledTimes(3);
  });

  // ── Duplicate prevention ─────────────────────────────────────────────────────

  it('does not insert a second reading if onShuffleComplete fires again', async () => {
    render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });
    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    expect(mockInsert).toHaveBeenCalledTimes(1);
  });

  // ── drawSpread integration ───────────────────────────────────────────────────

  it('calls drawSpread with the full deck and count 3', async () => {
    const { drawSpread } = jest.requireMock('@lib/tarot/draw');
    render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    expect(drawSpread).toHaveBeenCalledWith(expect.arrayContaining([1, 2, 78]), 3);
  });

  // ── Error handling ───────────────────────────────────────────────────────────

  it('shows an error when the reading insert fails', async () => {
    mockInsertSingle.mockResolvedValue({ data: null, error: { message: 'DB connection failed' } });

    const { getByText } = render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    await waitFor(() => {
      expect(getByText(/DB connection failed/)).toBeTruthy();
    });
  });

  it('shows an error when a card fetch fails', async () => {
    mockCardSingle.mockResolvedValue({ data: null, error: { message: 'Card not found' } });

    const { getByText } = render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    await waitFor(() => {
      expect(getByText(/Card not found/)).toBeTruthy();
    });
  });

  it('does not insert when a card fetch fails', async () => {
    mockCardSingle.mockResolvedValue({ data: null, error: { message: 'Card not found' } });

    render(<PPFScreen />);

    await act(async () => {
      capturedOnShuffleComplete?.();
    });

    expect(mockInsert).not.toHaveBeenCalled();
  });
});
