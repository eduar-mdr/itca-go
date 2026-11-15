import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../styles/theme';

const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  colorScheme: 'light',
});

export function ThemeProvider({ children }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const value = useMemo(() => ({
    theme: isDark ? darkTheme : lightTheme,
    isDark,
    colorScheme: colorScheme || 'light',
  }), [colorScheme, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
