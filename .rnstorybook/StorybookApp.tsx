import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { ThemeProvider } from '@/context/ThemeContext';
import { UpgradeSheetProvider } from '@/context/UpgradeSheetContext';
import { ToastProvider } from '@/context/ToastContext';
import { config } from '../gluestack-ui.config';
import StorybookUIRoot from './index';

const queryClient = new QueryClient();

export default function StorybookApp() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GluestackUIProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <UpgradeSheetProvider>
              <ToastProvider>
                <StorybookUIRoot />
              </ToastProvider>
            </UpgradeSheetProvider>
          </QueryClientProvider>
        </GluestackUIProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
