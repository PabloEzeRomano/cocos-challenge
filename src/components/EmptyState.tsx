import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../theme/useTheme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  const { colors, radius } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.icon, { borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
        <Svg width={24} height={24} viewBox="0 0 18 18" fill="none">
          <Circle cx={8} cy={8} r={5.5} stroke={colors.textMuted} strokeWidth={1.7} />
          <Path d="M12.5 12.5L16 16" stroke={colors.textMuted} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 52, paddingHorizontal: 20 },
  icon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontWeight: '600', fontSize: 16 },
  subtitle: { fontSize: 13.5, marginTop: 5, lineHeight: 19, textAlign: 'center' },
});
