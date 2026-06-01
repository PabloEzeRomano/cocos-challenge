import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

type BadgeStatus = 'filled' | 'pending' | 'rejected';

interface BadgeProps {
  status: BadgeStatus;
  label: string;
}

export const Badge = memo(function Badge({ status, label }: BadgeProps) {
  const { colors } = useTheme();

  const statusMap = {
    filled: { bg: colors.positiveBg, color: colors.positive },
    pending: { bg: colors.warnBg, color: colors.warn },
    rejected: { bg: colors.negativeBg, color: colors.negative },
  };

  const s = statusMap[status] || statusMap.pending;

  return (
    <View style={[styles.container, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.color }]} />
      <Text style={[styles.text, { color: s.color }]}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 99 },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
});
