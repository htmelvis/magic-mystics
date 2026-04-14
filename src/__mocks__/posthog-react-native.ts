/**
 * Manual Jest mock for posthog-react-native.
 *
 * Provides a mock PostHog client instance returned by usePostHog().
 * Override individual methods in tests with mockPostHogClient.capture.mockImplementation(...)
 */

export const mockPostHogClient = {
  capture: jest.fn(),
  identify: jest.fn(),
  reset: jest.fn(),
};

export const usePostHog = jest.fn(() => mockPostHogClient);
