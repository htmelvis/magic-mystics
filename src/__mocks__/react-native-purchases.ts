/**
 * Manual Jest mock for react-native-purchases (RevenueCat SDK).
 *
 * Default behaviour simulates a successful premium purchase.
 * Override individual methods in tests with jest.mocked(Purchases.xxx).mockResolvedValueOnce(...)
 */

export enum LOG_LEVEL {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export enum PURCHASES_ERROR_CODE {
  PURCHASE_CANCELLED_ERROR = 'PURCHASE_CANCELLED',
  PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR = 'PRODUCT_NOT_AVAILABLE_FOR_PURCHASE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export const mockAnnualPackage = {
  identifier: '$rc_annual',
  packageType: 'ANNUAL',
  product: {
    identifier: 'magic_mystics_premium_annual',
    title: 'Premium Annual',
    description: 'Full access to Magic Mystics premium features',
    price: 49.0,
    priceString: '$49.00',
    currencyCode: 'USD',
  },
};

export const mockPremiumCustomerInfo = {
  entitlements: {
    active: {
      premium: {
        identifier: 'premium',
        isActive: true,
        willRenew: true,
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    all: {},
  },
  activeSubscriptions: ['magic_mystics_premium_annual'],
  originalAppUserId: 'test-user-id',
};

export const mockFreeCustomerInfo = {
  entitlements: {
    active: {},
    all: {},
  },
  activeSubscriptions: [],
  originalAppUserId: 'test-user-id',
};

const Purchases = {
  setLogLevel: jest.fn(),
  configure: jest.fn(),

  getOfferings: jest.fn().mockResolvedValue({
    current: {
      identifier: 'default',
      serverDescription: 'Default offering',
      annual: mockAnnualPackage,
      availablePackages: [mockAnnualPackage],
    },
    all: {},
  }),

  purchasePackage: jest.fn().mockResolvedValue({
    customerInfo: mockPremiumCustomerInfo,
    transaction: { transactionIdentifier: 'mock-transaction-id' },
  }),

  restorePurchases: jest.fn().mockResolvedValue(mockFreeCustomerInfo),

  getCustomerInfo: jest.fn().mockResolvedValue(mockFreeCustomerInfo),
};

export default Purchases;
