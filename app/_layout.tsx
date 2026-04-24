import { useEffect } from 'react';
import { Linking } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useNavigationContainerRef, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { PostHogProvider, useNavigationTracker } from 'posthog-react-native';
import { config } from '../gluestack-ui.config';
import { useAuth } from '@hooks/useAuth';
import { useOnboarding } from '@hooks/useOnboarding';
import { initRevenueCat } from '@hooks/useRevenueCat';
import { useAnalytics } from '@hooks/useAnalytics';
import { useAppTheme } from '@hooks/useAppTheme';
import { ThemeProvider } from '@/context/ThemeContext';
import { UpgradeSheetProvider } from '@/context/UpgradeSheetContext';
import { ToastProvider } from '@/context/ToastContext';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { supabase } from '@lib/supabase/client';
import { posthog } from '@lib/analytics/posthog';

SplashScreen.preventAutoHideAsync();

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
  const appTheme = useAppTheme();
  const { user, loading: authLoading, isPasswordRecovery } = useAuth();
  const { onboardingCompleted, loading: onboardingLoading } = useOnboarding(user?.id);
  const { identify, reset } = useAnalytics();
  const segments = useSegments();
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  // Track screen views automatically via the navigation container ref.
  useNavigationTracker(undefined, navigationRef);

  // Initialise RevenueCat once the user is known. Using user.id as the
  // appUserID keeps RevenueCat and Supabase identities in sync automatically.
  useEffect(() => {
    if (user?.id) initRevenueCat(user.id);
  }, [user?.id]);

  // Identify or reset the PostHog user whenever auth state changes.
  useEffect(() => {
    if(!user) return
    if (user?.id) {
      identify(user.id, { email: user.email ?? null });
    } else {
      reset();
    }
  }, [user?.id]);

  // Handle deep links for password reset (magic-mystics://reset-password?code=...)
  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      const parsed = new URL(url);
      const code = parsed.searchParams.get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => subscription.remove();
  }, []);

  // Hide the splash once we know where to route the user
  useEffect(() => {
    if (!authLoading && !(user && onboardingLoading)) {
      SplashScreen.hideAsync();
    }
  }, [authLoading, onboardingLoading, user]);

  useEffect(() => {
    // Wait until the navigation container is ready before routing
    if (!navigationRef.isReady()) return;

    // When Storybook is enabled, skip all auth/onboarding routing
    if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
      if (segments[0] !== 'storybook') {
        router.replace('/storybook');
      }
      return;
    }

    if (authLoading || (!!user && onboardingLoading)) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const onResetPassword = (segments as string[])[1] === 'reset-password';

    if (!user && !inAuthGroup) {
      // Redirect to sign in if not authenticated
      router.replace('/(auth)/sign-in');
    } else if (user && isPasswordRecovery) {
      // Deep link from password reset email — send to the new password screen
      if (!onResetPassword) {
        router.replace('/(auth)/reset-password');
      }
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
  }, [user, authLoading, onboardingCompleted, onboardingLoading, isPasswordRecovery, segments]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { paddingTop: insets.top, backgroundColor: appTheme.colors.surface.background } }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="daily-draw" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="journal-entry" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Protected guard={__DEV__}>
        <Stack.Screen name="storybook" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PostHogProvider client={posthog} autocapture={{ captureScreens: false }}>
      <ThemeProvider>
        <GluestackUIProvider config={config}>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <UpgradeSheetProvider>
                <ToastProvider>
                  <ErrorBoundary>
                    <RootLayoutNav />
                  </ErrorBoundary>
                </ToastProvider>
              </UpgradeSheetProvider>
            </QueryClientProvider>
          </SafeAreaProvider>
        </GluestackUIProvider>
      </ThemeProvider>
    </PostHogProvider>
  );
}
