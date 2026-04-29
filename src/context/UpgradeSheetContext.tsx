import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { UpgradeSheet } from '@components/ui/UpgradeSheet';
import { useRevenueCat } from '@hooks/useRevenueCat';

interface UpgradeSheetContextType {
  open: () => void;
}

export const UpgradeSheetContext = createContext<UpgradeSheetContextType | undefined>(undefined);

export function UpgradeSheetProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { purchasePremium } = useRevenueCat();
  const queryClient = useQueryClient();

  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);

  const handleUpgradePress = useCallback(async () => {
    setIsPurchasing(true);
    try {
      const result = await purchasePremium();

      if (result.cancelled) return; // user dismissed the native sheet — no feedback needed

      if (result.success) {
        // Invalidate subscription so every screen reflects the new tier immediately.
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        close();
      } else {
        Alert.alert(
          'Purchase failed',
          result.error?.message ?? 'Something went wrong. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [purchasePremium, queryClient, close]);

  return (
    <UpgradeSheetContext.Provider value={{ open }}>
      {children}
      <UpgradeSheet
        isVisible={isVisible}
        onClose={close}
        onUpgradePress={handleUpgradePress}
        isPurchasing={isPurchasing}
      />
    </UpgradeSheetContext.Provider>
  );
}

export function useUpgradeSheet(): UpgradeSheetContextType {
  const context = useContext(UpgradeSheetContext);
  if (!context) {
    throw new Error('useUpgradeSheet must be used within an UpgradeSheetProvider');
  }
  return context;
}
