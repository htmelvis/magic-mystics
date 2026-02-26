export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  birthDate: string | null;
  birthTime: string | null;
  birthLocation: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  startDate: string;
  expiryDate: string | null; // null for free tier
  isActive: boolean;
  autoRenew: boolean;
}

export interface UserLimits {
  maxReadingHistory: number; // -1 for unlimited
  canAccessPPF: boolean;
  hasAIContext: boolean; // Whether AI uses historical context
}
