import React from 'react';

export type ColorScheme = 'light' | 'dark' | 'auto';
export type ActiveColorScheme = 'light' | 'dark';

export function useTheme() {
  return {
    colorScheme: 'auto' as ColorScheme,
    activeColorScheme: 'light' as ActiveColorScheme,
    setColorScheme: jest.fn(),
    toggleColorScheme: jest.fn(),
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
