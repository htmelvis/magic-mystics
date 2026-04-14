import { usePostHog } from 'posthog-react-native';

// Typed event catalogue — add new events here as the app grows.
export type AnalyticsEvent =
  // Auth
  | 'sign_in'
  | 'sign_up'
  | 'sign_out'
  | 'password_reset_requested'
  // Onboarding
  | 'onboarding_step_completed'
  | 'onboarding_completed'
  // Readings
  | 'reading_started'
  | 'reading_completed'
  | 'ppf_reading_started'
  | 'ppf_reading_completed'
  // Reflections
  | 'reflection_added'
  | 'reflection_edited'
  // Subscription / paywall
  | 'upgrade_sheet_viewed'
  | 'subscription_upgraded'
  // History
  | 'history_searched'
  | 'history_filtered'
  | 'screen_viewed';

export type AnalyticsProperties = Record<string, string | number | boolean | null>;

/**
 * Thin wrapper around usePostHog() that provides typed event names.
 * Use this in screens and components instead of calling usePostHog() directly.
 */
export function useAnalytics() {
  const posthog = usePostHog();

  function capture(event: AnalyticsEvent, properties?: AnalyticsProperties) {
    posthog?.capture(event, properties);
  }

  function identify(userId: string, properties?: AnalyticsProperties) {
    posthog?.identify(userId, properties);
  }

  function reset() {
    posthog?.reset();
  }

  return { capture, identify, reset };
}
