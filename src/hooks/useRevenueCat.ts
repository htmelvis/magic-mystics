import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases';

// ── Initialisation ────────────────────────────────────────────────────────────

/**
 * Call once from the root layout after the user is authenticated.
 * Uses the Supabase user ID as the RevenueCat appUserID so both systems
 * stay in sync — no separate RevenueCat login required.
 */
export function initRevenueCat(userId: string): void {
  const key =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

  if (!key) {
    console.warn('[RevenueCat] API key not set — purchases will not work.');
    return;
  }

  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  Purchases.configure({ apiKey: key, appUserID: userId });
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PurchaseResult {
  success: boolean;
  /** True when the user cancelled the native IAP sheet — not an error worth surfacing. */
  cancelled: boolean;
  error?: Error;
}

export interface RevenueCatHook {
  purchasePremium: () => Promise<PurchaseResult>;
  restorePurchases: () => Promise<PurchaseResult>;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Provides RevenueCat purchase actions.
 * Returns a stable result shape so callers never need to catch — check
 * `result.success` and `result.cancelled` instead.
 */
export function useRevenueCat(): RevenueCatHook {
  const purchasePremium = async (): Promise<PurchaseResult> => {
    try {
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.annual;

      if (!pkg) {
        throw new Error('No annual package found in RevenueCat offerings.');
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const success = !!customerInfo.entitlements.active['premium'];

      return { success, cancelled: false };
    } catch (err) {
      const rcErr = err as { code?: string; message?: string };
      if (rcErr.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return { success: false, cancelled: true };
      }
      return { success: false, cancelled: false, error: err as Error };
    }
  };

  const restorePurchases = async (): Promise<PurchaseResult> => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const success = !!customerInfo.entitlements.active['premium'];
      return { success, cancelled: false };
    } catch (err) {
      return { success: false, cancelled: false, error: err as Error };
    }
  };

  return { purchasePremium, restorePurchases };
}
