import { Stack } from 'expo-router';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { OnboardingProvider } from '@lib/onboarding/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <ErrorBoundary>
      <OnboardingProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#fff' },
          }}
        >
          <Stack.Screen name="welcome" />
          <Stack.Screen name="name" />
          <Stack.Screen name="birth-date" />
          <Stack.Screen name="birth-location" />
          <Stack.Screen name="birth-time" />
          <Stack.Screen name="calculating" />
          <Stack.Screen name="tarot-reveal" />
        </Stack>
      </OnboardingProvider>
    </ErrorBoundary>
  );
}
