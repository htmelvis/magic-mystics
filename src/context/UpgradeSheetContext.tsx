import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { UpgradeSheet } from '@components/ui/UpgradeSheet';

interface UpgradeSheetContextType {
  open: () => void;
}

const UpgradeSheetContext = createContext<UpgradeSheetContextType | undefined>(undefined);

export function UpgradeSheetProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);

  // TODO: replace with RevenueCat purchasePremium()
  const handleUpgradePress = useCallback(() => {
    console.warn('RevenueCat purchase not yet wired');
  }, []);

  return (
    <UpgradeSheetContext.Provider value={{ open }}>
      {children}
      <UpgradeSheet
        isVisible={isVisible}
        onClose={close}
        onUpgradePress={handleUpgradePress}
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
