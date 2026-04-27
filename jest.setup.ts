// Global mock for useAppTheme — returns the real light theme so components
// can access token values without needing a ThemeProvider in tests.
jest.mock('@/hooks/useAppTheme', () => {
  const { getTheme } = jest.requireActual('./src/theme') as typeof import('./src/theme');
  return { useAppTheme: () => getTheme('light') };
});

// Same mock under the @hooks/ alias used by some components (e.g. UpgradeSheet).
jest.mock('@hooks/useAppTheme', () => {
  const { getTheme } = jest.requireActual('./src/theme') as typeof import('./src/theme');
  return { useAppTheme: () => getTheme('light') };
});

// Mock ThemeContext so any component calling useTheme() directly works
// without a ThemeProvider wrapper in tests.
jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    activeColorScheme: 'light' as const,
    colorScheme: 'auto' as const,
    setColorScheme: jest.fn(),
    toggleColorScheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));
