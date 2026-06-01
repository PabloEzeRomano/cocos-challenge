import { createContext, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { usePreferencesStore } from '../store/preferences';
import { colors, radius, spacing, typography } from './tokens';

export type ThemeColors = { [K in keyof typeof colors.light]: string };

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  typography: typeof typography;
  radius: typeof radius;
  isDark: boolean;
}

export const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const themePreference = usePreferencesStore((s) => s.theme);

  const isDark =
    themePreference === 'system' ? systemScheme === 'dark' : themePreference === 'dark';

  const theme = useMemo<Theme>(
    () => ({
      colors: isDark ? colors.dark : colors.light,
      spacing,
      typography,
      radius,
      isDark,
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
