import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases';
import {
  mockPremiumCustomerInfo,
  mockFreeCustomerInfo,
  mockAnnualPackage,
} from '../../__mocks__/react-native-purchases';
import { useRevenueCat } from '@hooks/useRevenueCat';
import { renderHook, act } from '@testing-library/react-native';

// Typed reference to the mock so TypeScript understands jest.fn() methods.
const mockPurchases = jest.mocked(Purchases);

beforeEach(() => {
  jest.clearAllMocks();
  // Restore defaults before each test so overrides don't bleed across.
  mockPurchases.getOfferings.mockResolvedValue({
    current: {
      identifier: 'default',
      serverDescription: 'Default offering',
      annual: mockAnnualPackage,
      availablePackages: [mockAnnualPackage],
    },
    all: {},
  } as never);
  mockPurchases.purchasePackage.mockResolvedValue({
    customerInfo: mockPremiumCustomerInfo,
    transaction: { transactionIdentifier: 'mock-transaction-id' },
  } as never);
  mockPurchases.restorePurchases.mockResolvedValue(mockFreeCustomerInfo as never);
});

// ── purchasePremium ───────────────────────────────────────────────────────────

describe('purchasePremium', () => {
  it('returns success:true when premium entitlement is active', async () => {
    const { result } = renderHook(() => useRevenueCat());

    let purchaseResult: Awaited<ReturnType<typeof result.current.purchasePremium>>;
    await act(async () => {
      purchaseResult = await result.current.purchasePremium();
    });

    expect(purchaseResult!.success).toBe(true);
    expect(purchaseResult!.cancelled).toBe(false);
    expect(purchaseResult!.error).toBeUndefined();
  });

  it('calls purchasePackage with the annual package', async () => {
    const { result } = renderHook(() => useRevenueCat());

    await act(async () => {
      await result.current.purchasePremium();
    });

    expect(mockPurchases.purchasePackage).toHaveBeenCalledWith(mockAnnualPackage);
  });

  it('returns success:false when entitlement is not active after purchase', async () => {
    mockPurchases.purchasePackage.mockResolvedValueOnce({
      customerInfo: mockFreeCustomerInfo,
      transaction: null,
    } as never);

    const { result } = renderHook(() => useRevenueCat());

    let purchaseResult: Awaited<ReturnType<typeof result.current.purchasePremium>>;
    await act(async () => {
      purchaseResult = await result.current.purchasePremium();
    });

    expect(purchaseResult!.success).toBe(false);
    expect(purchaseResult!.cancelled).toBe(false);
  });

  it('returns cancelled:true when user cancels the native IAP sheet', async () => {
    const cancelError = { code: PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR };
    mockPurchases.purchasePackage.mockRejectedValueOnce(cancelError);

    const { result } = renderHook(() => useRevenueCat());

    let purchaseResult: Awaited<ReturnType<typeof result.current.purchasePremium>>;
    await act(async () => {
      purchaseResult = await result.current.purchasePremium();
    });

    expect(purchaseResult!.success).toBe(false);
    expect(purchaseResult!.cancelled).toBe(true);
    expect(purchaseResult!.error).toBeUndefined();
  });

  it('returns error when a non-cancellation error occurs', async () => {
    const networkError = new Error('Network request failed');
    mockPurchases.purchasePackage.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useRevenueCat());

    let purchaseResult: Awaited<ReturnType<typeof result.current.purchasePremium>>;
    await act(async () => {
      purchaseResult = await result.current.purchasePremium();
    });

    expect(purchaseResult!.success).toBe(false);
    expect(purchaseResult!.cancelled).toBe(false);
    expect(purchaseResult!.error).toBe(networkError);
  });

  it('returns error when no offerings are available', async () => {
    mockPurchases.getOfferings.mockResolvedValueOnce({ current: null, all: {} } as never);

    const { result } = renderHook(() => useRevenueCat());

    let purchaseResult: Awaited<ReturnType<typeof result.current.purchasePremium>>;
    await act(async () => {
      purchaseResult = await result.current.purchasePremium();
    });

    expect(purchaseResult!.success).toBe(false);
    expect(purchaseResult!.error?.message).toBe('No annual package found in RevenueCat offerings.');
  });

  it('returns error when annual package is missing from current offering', async () => {
    mockPurchases.getOfferings.mockResolvedValueOnce({
      current: { identifier: 'default', annual: null, availablePackages: [] },
      all: {},
    } as never);

    const { result } = renderHook(() => useRevenueCat());

    let purchaseResult: Awaited<ReturnType<typeof result.current.purchasePremium>>;
    await act(async () => {
      purchaseResult = await result.current.purchasePremium();
    });

    expect(purchaseResult!.success).toBe(false);
    expect(purchaseResult!.error?.message).toMatch(/No annual package/);
  });
});

// ── restorePurchases ──────────────────────────────────────────────────────────

describe('restorePurchases', () => {
  it('returns success:false when no premium entitlement is found', async () => {
    const { result } = renderHook(() => useRevenueCat());

    let restoreResult: Awaited<ReturnType<typeof result.current.restorePurchases>>;
    await act(async () => {
      restoreResult = await result.current.restorePurchases();
    });

    expect(restoreResult!.success).toBe(false);
    expect(restoreResult!.cancelled).toBe(false);
  });

  it('returns success:true when a premium entitlement is restored', async () => {
    mockPurchases.restorePurchases.mockResolvedValueOnce(mockPremiumCustomerInfo as never);

    const { result } = renderHook(() => useRevenueCat());

    let restoreResult: Awaited<ReturnType<typeof result.current.restorePurchases>>;
    await act(async () => {
      restoreResult = await result.current.restorePurchases();
    });

    expect(restoreResult!.success).toBe(true);
    expect(restoreResult!.cancelled).toBe(false);
  });

  it('returns error when restore throws', async () => {
    const networkError = new Error('Network request failed');
    mockPurchases.restorePurchases.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useRevenueCat());

    let restoreResult: Awaited<ReturnType<typeof result.current.restorePurchases>>;
    await act(async () => {
      restoreResult = await result.current.restorePurchases();
    });

    expect(restoreResult!.success).toBe(false);
    expect(restoreResult!.error).toBe(networkError);
  });
});
