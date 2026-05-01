import { renderHook } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';
import { useSubscription } from '@hooks/useSubscription';
import type { Database } from '@/types/database';

jest.mock('@tanstack/react-query', () => ({ useQuery: jest.fn() }));
jest.mock('@lib/supabase/client', () => ({ supabase: {} }));

const mockUseQuery = jest.mocked(useQuery);

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];

function makeSubscription(overrides: Partial<SubscriptionRow> = {}): SubscriptionRow {
  return {
    id: 'sub-1',
    user_id: 'user-1',
    tier: 'premium',
    is_active: true,
    start_date: '2026-01-01',
    expiry_date: '2027-01-01',
    auto_renew: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function mockQuery(data: SubscriptionRow | null, isLoading = false) {
  mockUseQuery.mockReturnValue({ data, isLoading } as never);
}

beforeEach(() => jest.clearAllMocks());

// ── isPremium ─────────────────────────────────────────────────────────────────

describe('isPremium', () => {
  it('is true when tier is premium and is_active is true', () => {
    mockQuery(makeSubscription({ tier: 'premium', is_active: true }));
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.isPremium).toBe(true);
  });

  it('is false when tier is premium but is_active is false', () => {
    mockQuery(makeSubscription({ tier: 'premium', is_active: false }));
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.isPremium).toBe(false);
  });

  it('is false when tier is free', () => {
    mockQuery(makeSubscription({ tier: 'free', is_active: true }));
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.isPremium).toBe(false);
  });

  it('is false when there is no subscription row', () => {
    mockQuery(null);
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.isPremium).toBe(false);
  });
});

// ── limits ────────────────────────────────────────────────────────────────────

describe('limits', () => {
  it('returns premium limits for an active premium subscription', () => {
    mockQuery(makeSubscription({ tier: 'premium', is_active: true }));
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.limits).toEqual({
      maxReadingHistory: -1,
      canAccessPPF: true,
      hasAIContext: true,
      hasJournal: true,
    });
  });

  it('returns free limits when there is no subscription', () => {
    mockQuery(null);
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.limits).toEqual({
      maxReadingHistory: 30,
      canAccessPPF: false,
      hasAIContext: false,
      hasJournal: false,
    });
  });

  it('returns free limits for an inactive premium subscription', () => {
    mockQuery(makeSubscription({ tier: 'premium', is_active: false }));
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.limits).toEqual({
      maxReadingHistory: 30,
      canAccessPPF: false,
      hasAIContext: false,
      hasJournal: false,
    });
  });

  it('returns free limits for a free-tier subscription', () => {
    mockQuery(makeSubscription({ tier: 'free', is_active: true }));
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.limits).toEqual({
      maxReadingHistory: 30,
      canAccessPPF: false,
      hasAIContext: false,
      hasJournal: false,
    });
  });
});

// ── subscription passthrough ──────────────────────────────────────────────────

describe('subscription', () => {
  it('returns the raw subscription row when one exists', () => {
    const sub = makeSubscription();
    mockQuery(sub);
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.subscription).toEqual(sub);
  });

  it('returns null when there is no subscription row', () => {
    mockQuery(null);
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.subscription).toBeNull();
  });
});

// ── loading ───────────────────────────────────────────────────────────────────

describe('loading', () => {
  it('is true while the query is in flight', () => {
    mockQuery(null, true);
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.loading).toBe(true);
  });

  it('is false once the query has resolved', () => {
    mockQuery(makeSubscription());
    const { result } = renderHook(() => useSubscription('user-1'));
    expect(result.current.loading).toBe(false);
  });
});

// ── disabled when userId is absent ───────────────────────────────────────────

describe('query enabled flag', () => {
  it('does not run the query when userId is null', () => {
    mockQuery(null);
    renderHook(() => useSubscription(null));
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('does not run the query when userId is undefined', () => {
    mockQuery(null);
    renderHook(() => useSubscription(undefined));
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('runs the query when userId is present', () => {
    mockQuery(null);
    renderHook(() => useSubscription('user-1'));
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: true })
    );
  });
});
