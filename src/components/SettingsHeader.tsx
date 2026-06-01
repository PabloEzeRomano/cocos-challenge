import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { usePreferencesStore, ThemePreference, Locale } from '../store/preferences';

export function SettingsHeader() {
  const { colors, spacing, typography, radius } = useTheme();
  const theme = usePreferencesStore((s) => s.theme);
  const locale = usePreferencesStore((s) => s.locale);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const setLocale = usePreferencesStore((s) => s.setLocale);

  const nextTheme = (): ThemePreference => {
    if (theme === 'system') return 'light';
    if (theme === 'light') return 'dark';
    return 'system';
  };

  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '⚙️';
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'Auto';

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.md, paddingTop: spacing.xs, paddingBottom: spacing.xs }]}>
      <Text style={[typography.h2, { color: colors.text, flex: 1 }]}>Cocos</Text>

      <Pressable
        onPress={() => setLocale(locale === 'es' ? 'en' : 'es')}
        style={[styles.pill, { backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, marginRight: spacing.sm }]}
        accessibilityRole="button"
        accessibilityLabel={`Language: ${locale.toUpperCase()}`}
      >
        <Text style={[typography.caption, { color: colors.text, fontWeight: '600' }]}>
          {locale.toUpperCase()}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setTheme(nextTheme())}
        style={[styles.pill, { backgroundColor: colors.surfaceSecondary, borderRadius: radius.lg, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }]}
        accessibilityRole="button"
        accessibilityLabel={`Theme: ${themeLabel}`}
      >
        <Text style={[typography.caption, { color: colors.text }]}>
          {themeIcon} {themeLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  pill: {},
});
