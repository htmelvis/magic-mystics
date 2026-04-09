/**
 * Minimal type declarations for react-native-purchases (RevenueCat SDK).
 *
 * These cover only the subset used by this app. When the real package is
 * installed via `npx expo install react-native-purchases`, delete this file —
 * the package ships its own complete declarations.
 */
declare module 'react-native-purchases' {
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

  export interface PurchasesStoreProduct {
    identifier: string;
    title: string;
    description: string;
    price: number;
    priceString: string;
    currencyCode: string;
  }

  export interface PurchasesPackage {
    identifier: string;
    packageType: string;
    product: PurchasesStoreProduct;
  }

  export interface PurchasesOffering {
    identifier: string;
    serverDescription: string;
    annual: PurchasesPackage | null;
    availablePackages: PurchasesPackage[];
  }

  export interface PurchasesOfferings {
    current: PurchasesOffering | null;
    all: Record<string, PurchasesOffering>;
  }

  export interface EntitlementInfo {
    identifier: string;
    isActive: boolean;
    willRenew: boolean;
    expirationDate: string | null;
  }

  export interface CustomerInfo {
    entitlements: {
      active: Record<string, EntitlementInfo>;
      all: Record<string, EntitlementInfo>;
    };
    activeSubscriptions: string[];
    originalAppUserId: string;
  }

  export interface MakePurchaseResult {
    customerInfo: CustomerInfo;
    transaction: { transactionIdentifier: string } | null;
  }

  export interface PurchasesError {
    code: PURCHASES_ERROR_CODE;
    message: string;
  }

  interface PurchasesClass {
    setLogLevel(level: LOG_LEVEL): void;
    configure(options: { apiKey: string; appUserID?: string }): void;
    getOfferings(): Promise<PurchasesOfferings>;
    purchasePackage(pkg: PurchasesPackage): Promise<MakePurchaseResult>;
    restorePurchases(): Promise<CustomerInfo>;
    getCustomerInfo(): Promise<CustomerInfo>;
  }

  const Purchases: PurchasesClass;
  export default Purchases;
}
