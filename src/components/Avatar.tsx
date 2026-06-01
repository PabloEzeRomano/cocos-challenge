import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface AvatarProps {
  ticker: string;
  size?: number;
}

export const Avatar = memo(function Avatar({ ticker, size = 40 }: AvatarProps) {
  const { colors, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius.badge + 4,
          backgroundColor: colors.surface2,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.textSecondary, fontSize: size * 0.3 }]}>
        {ticker.slice(0, 4)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '700', letterSpacing: -0.3 },
});
