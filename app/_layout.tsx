import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useOnboarding } from '@hooks/useOnboarding';

export default function RootLayout() {
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, loading: onboardingLoading } = useOnboarding(user?.id);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || onboardingLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inTabsGroup = segments[0] === '(tabs)';

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

  if (authLoading || onboardingLoading) {
    return null; // Or a loading screen component
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
