import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorScheme = 'light' | 'dark' | 'auto';
export type ActiveColorScheme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
  activeColorScheme: ActiveColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@magic_mystics_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('auto');

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Determine the active color scheme based on user preference and system setting
  const activeColorScheme: ActiveColorScheme =
    colorScheme === 'auto' ? (systemColorScheme ?? 'light') : colorScheme;

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
        setColorSchemeState(saved as ColorScheme);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
  };

  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      setColorSchemeState(scheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const toggleColorScheme = () => {
    // Toggle between light and dark (skip auto for simple toggle)
    const newScheme = activeColorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        activeColorScheme,
        setColorScheme,
        toggleColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
