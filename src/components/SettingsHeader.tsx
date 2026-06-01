import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../theme/useTheme';
import { usePreferencesStore } from '../store/preferences';

function SunIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 18 18" fill="none">
      <Circle cx={9} cy={9} r={3.6} stroke={color} strokeWidth={1.6} />
      <Path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 18 18" fill="none">
      <Path d="M15 10.5A6.2 6.2 0 017.5 3a6.2 6.2 0 103.2 11.7 6.2 6.2 0 004.3-4.2z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

function GlobeIcon({ color }: { color: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Circle cx={8} cy={8} r={6} stroke={color} strokeWidth={1.4} />
      <Path d="M2 8h12M8 2c1.8 1.7 1.8 10.3 0 12M8 2c-1.8 1.7-1.8 10.3 0 12" stroke={color} strokeWidth={1.4} />
    </Svg>
  );
}

function StarIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 26 26" fill="none">
      <Path d="M13 1.5 L15 11 L24.5 13 L15 15 L13 24.5 L11 15 L1.5 13 L11 11 Z" fill={color} />
    </Svg>
  );
}

export function SettingsHeader() {
  const { colors, spacing, radius, isDark } = useTheme();
  const theme = usePreferencesStore((s) => s.theme);
  const locale = usePreferencesStore((s) => s.locale);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const setLocale = usePreferencesStore((s) => s.setLocale);

  return (
    <View style={[styles.container, { paddingHorizontal: 22, paddingTop: spacing.sm, paddingBottom: spacing.lg }]}>
      <View style={styles.brand}>
        <StarIcon color={colors.text} />
        <Text style={[styles.brandText, { color: colors.text }]}>Austral</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => setTheme(isDark ? 'light' : 'dark')}
          style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.badge + 3 }]}
          accessibilityLabel="Toggle theme"
        >
          {isDark ? <MoonIcon color={colors.textSecondary} /> : <SunIcon color={colors.textSecondary} />}
        </Pressable>

        <Pressable
          onPress={() => setLocale(locale === 'es' ? 'en' : 'es')}
          style={[styles.langBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.badge + 3 }]}
          accessibilityLabel={`Language: ${locale.toUpperCase()}`}
        >
          <GlobeIcon color={colors.textSecondary} />
          <Text style={[styles.langText, { color: colors.textSecondary }]}>{locale.toUpperCase()}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandText: { fontWeight: '700', fontSize: 19, letterSpacing: -0.38 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 38, height: 38, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  langBtn: { height: 38, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 12 },
  langText: { fontWeight: '700', fontSize: 13 },
});
