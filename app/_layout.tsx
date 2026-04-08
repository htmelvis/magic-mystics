import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../gluestack-ui.config';
import { useAuth } from '@hooks/useAuth';
import { useOnboarding } from '@hooks/useOnboarding';
import { ThemeProvider } from '@/context/ThemeContext';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, loading: onboardingLoading } = useOnboarding(user?.id);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || (!!user && onboardingLoading)) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!user && !inAuthGroup) {
      // Redirect to sign in if not authenticated
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      // User just signed in, check if they need onboarding
      if (onboardingCompleted) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(onboarding)/welcome');
      }
    } else if (user && !onboardingCompleted && !inOnboardingGroup) {
      // User is authenticated but hasn't completed onboarding
      router.replace('/(onboarding)/welcome');
    } else if (user && onboardingCompleted && inOnboardingGroup) {
      // User completed onboarding but is still in onboarding group
      router.replace('/(tabs)/home');
    }
  }, [user, authLoading, onboardingCompleted, onboardingLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { paddingTop: insets.top } }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="draw" options={{ headerShown: false, presentation: 'card' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GluestackUIProvider config={config}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <RootLayoutNav />
            </ErrorBoundary>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </ThemeProvider>
  );
}
