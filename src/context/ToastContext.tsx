import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Toast } from '@components/ui/Toast';
import type { ToastConfig } from '@/types/announcement';

interface ToastContextValue {
  showToast: (config: Omit<ToastConfig, never>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<ToastConfig[]>([]);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((config: ToastConfig) => {
    setQueue((prev) => {
      if (prev.some((t) => t.id === config.id)) return prev;
      return [...prev, config];
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    gapTimerRef.current = setTimeout(() => {
      setQueue((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const current = queue[0] ?? null;

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {current && (
        <Toast
          key={current.id}
          {...current}
          onDismiss={() => dismissToast(current.id)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
