import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface SummaryRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  last?: boolean;
}

export function SummaryRow({ label, value, last }: SummaryRowProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, last && { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 2 }]}>
      <View>{typeof label === 'string' ? <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text> : label}</View>
      <View>{typeof value === 'string' ? <Text style={[styles.value, { color: colors.text }]}>{value}</Text> : value}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  label: { fontSize: 13.5 },
  value: { fontSize: 13.5, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
