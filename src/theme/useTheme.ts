import { useContext } from 'react';
import { Theme, ThemeContext } from './ThemeProvider';

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within ThemeProvider');
  return theme;
}
