import { renderHook } from '@testing-library/react-native';
import { useAnalytics } from '@hooks/useAnalytics';
import { usePostHog } from 'posthog-react-native';
import { mockPostHogClient } from '../../__mocks__/posthog-react-native';

const mockUsePostHog = jest.mocked(usePostHog);

beforeEach(() => {
  jest.clearAllMocks();
  mockUsePostHog.mockReturnValue(mockPostHogClient as never);
});

// ── capture ───────────────────────────────────────────────────────────────────

describe('capture', () => {
  it('calls posthog.capture with the event name', () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.capture('sign_in');

    expect(mockPostHogClient.capture).toHaveBeenCalledWith('sign_in', undefined);
  });

  it('forwards properties to posthog.capture', () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.capture('reading_completed', { reading_type: 'draw', card_count: 3 });

    expect(mockPostHogClient.capture).toHaveBeenCalledWith('reading_completed', {
      reading_type: 'draw',
      card_count: 3,
    });
  });

  it('does not throw when posthog client is undefined', () => {
    mockUsePostHog.mockReturnValueOnce(undefined as never);
    const { result } = renderHook(() => useAnalytics());

    expect(() => result.current.capture('sign_out')).not.toThrow();
    expect(mockPostHogClient.capture).not.toHaveBeenCalled();
  });
});

// ── identify ──────────────────────────────────────────────────────────────────

describe('identify', () => {
  it('calls posthog.identify with the userId', () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.identify('user-123');

    expect(mockPostHogClient.identify).toHaveBeenCalledWith('user-123', undefined);
  });

  it('forwards properties to posthog.identify', () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.identify('user-123', { email: 'test@example.com', tier: 'premium' });

    expect(mockPostHogClient.identify).toHaveBeenCalledWith('user-123', {
      email: 'test@example.com',
      tier: 'premium',
    });
  });

  it('does not throw when posthog client is undefined', () => {
    mockUsePostHog.mockReturnValueOnce(undefined as never);
    const { result } = renderHook(() => useAnalytics());

    expect(() => result.current.identify('user-123')).not.toThrow();
    expect(mockPostHogClient.identify).not.toHaveBeenCalled();
  });
});

// ── reset ─────────────────────────────────────────────────────────────────────

describe('reset', () => {
  it('calls posthog.reset', () => {
    const { result } = renderHook(() => useAnalytics());

    result.current.reset();

    expect(mockPostHogClient.reset).toHaveBeenCalledTimes(1);
  });

  it('does not throw when posthog client is undefined', () => {
    mockUsePostHog.mockReturnValueOnce(undefined as never);
    const { result } = renderHook(() => useAnalytics());

    expect(() => result.current.reset()).not.toThrow();
    expect(mockPostHogClient.reset).not.toHaveBeenCalled();
  });
});
