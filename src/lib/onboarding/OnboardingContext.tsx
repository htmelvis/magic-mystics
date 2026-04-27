import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface OnboardingDraft {
  displayName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm or '' when timeKnown=false
  timeKnown: boolean;
  birthLocation: string; // 'Not specified' when locationApproximate=true
  birthLat: number | null;
  birthLng: number | null;
  birthTimezone: string | null; // IANA, resolved on the location step
  locationApproximate: boolean;
}

const EMPTY_DRAFT: OnboardingDraft = {
  displayName: '',
  birthDate: '',
  birthTime: '',
  timeKnown: true,
  birthLocation: '',
  birthLat: null,
  birthLng: null,
  birthTimezone: null,
  locationApproximate: false,
};

interface OnboardingContextValue {
  draft: OnboardingDraft;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  resetDraft: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_DRAFT);

  const updateDraft = useCallback((patch: Partial<OnboardingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(EMPTY_DRAFT);
  }, []);

  const value = useMemo(
    () => ({ draft, updateDraft, resetDraft }),
    [draft, updateDraft, resetDraft],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingDraft(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboardingDraft must be used inside <OnboardingProvider>');
  }
  return ctx;
}
