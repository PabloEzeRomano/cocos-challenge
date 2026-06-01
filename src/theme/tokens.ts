export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceSecondary: '#F1F3F5',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    positive: '#10B981',
    negative: '#EF4444',
    accent: '#2563EB',
    border: '#E5E7EB',
    skeleton: '#E5E7EB',
    overlay: 'rgba(0, 0, 0, 0.5)',
    inputBackground: '#F8F9FA',
  },
  dark: {
    background: '#0F0F14',
    surface: '#1A1A24',
    surfaceSecondary: '#252530',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    positive: '#34D399',
    negative: '#F87171',
    accent: '#60A5FA',
    border: '#2D2D3A',
    skeleton: '#2D2D3A',
    overlay: 'rgba(0, 0, 0, 0.7)',
    inputBackground: '#1A1A24',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  mono: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20, fontFamily: 'monospace' },
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
} as const;

export const shadows = {
  card: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  modal: {
    boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
} as const;
