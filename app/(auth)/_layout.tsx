import { Stack } from 'expo-router';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';

export default function AuthLayout() {
  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </ErrorBoundary>
  );
}
