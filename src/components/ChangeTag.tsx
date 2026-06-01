import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface ChangeTagProps {
  pct: number;
  size?: number;
}

export const ChangeTag = memo(function ChangeTag({ pct, size = 13 }: ChangeTagProps) {
  const { colors } = useTheme();
  const up = pct >= 0;
  const arrow = up ? '↑' : '↓';

  return (
    <Text style={[styles.text, { color: up ? colors.positive : colors.negative, fontSize: size }]}>
      {arrow} {Math.abs(pct).toFixed(2)}%
    </Text>
  );
});

const styles = StyleSheet.create({
  text: { fontWeight: '600' },
});
