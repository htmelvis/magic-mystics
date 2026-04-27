import { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getTheme } from '@theme';

/**
 * Hook to get the current theme based on the active color scheme
 *
 * Usage:
 * ```tsx
 * const theme = useAppTheme();
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.colors.surface.background,
 *     padding: theme.spacing.lg,
 *   }
 * });
 * ```
 */
export function useAppTheme() {
  const { activeColorScheme } = useTheme();

  return useMemo(() => getTheme(activeColorScheme), [activeColorScheme]);
}
