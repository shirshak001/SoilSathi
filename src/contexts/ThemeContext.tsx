import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme types
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  error: string;
  warning: string;
  success: string;
  text: {
    primary: string;
    secondary: string;
    hint: string;
    disabled: string;
    inverse: string;
  };
  border: string;
  placeholder: string;
  shadow: string;
  overlay: string;
}

export interface Theme {
  colors: ThemeColors;
  dark: boolean;
}

// Light theme colors
const lightColors: ThemeColors = {
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  secondary: '#66BB6A',
  accent: '#81C784',
  background: '#F1F8E9',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  text: {
    primary: '#1B5E20',
    secondary: '#388E3C',
    hint: '#81C784',
    disabled: '#C8E6C9',
    inverse: '#FFFFFF',
  },
  border: '#C8E6C9',
  placeholder: '#A5D6A7',
  shadow: 'rgba(46, 125, 50, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Dark theme colors
const darkColors: ThemeColors = {
  primary: '#66BB6A',
  primaryLight: '#81C784',
  primaryDark: '#4CAF50',
  secondary: '#2E7D32',
  accent: '#A5D6A7',
  background: '#0D1B0F',
  surface: '#1A2E1D',
  surfaceVariant: '#263A29',
  error: '#EF5350',
  warning: '#FFA726',
  success: '#66BB6A',
  text: {
    primary: '#E8F5E8',
    secondary: '#C8E6C9',
    hint: '#81C784',
    disabled: '#4E7C51',
    inverse: '#1B5E20',
  },
  border: '#4E7C51',
  placeholder: '#66BB6A',
  shadow: 'rgba(102, 187, 106, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

// Create themes
export const lightTheme: Theme = {
  colors: lightColors,
  dark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  dark: true,
};

// Theme context
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@soilsathi_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // Use system preference if no saved theme
          const systemTheme = Appearance.getColorScheme();
          setIsDark(systemTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        // Fallback to system theme
        const systemTheme = Appearance.getColorScheme();
        setIsDark(systemTheme === 'dark');
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update if user hasn't set a preference
      AsyncStorage.getItem(THEME_STORAGE_KEY).then((savedTheme: string | null) => {
        if (savedTheme === null && colorScheme) {
          setIsDark(colorScheme === 'dark');
        }
      });
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setTheme = async (dark: boolean) => {
    setIsDark(dark);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };

  // Don't render until theme is loaded
  if (!isReady) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Backwards compatibility - export colors from current theme
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

// Static exports for backwards compatibility (will use light theme by default)
export const colors = lightColors;
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 28,
  heading: 32,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
