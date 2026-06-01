import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../../../components/Skeleton';
import { useTheme } from '../../../theme/useTheme';

export function InstrumentSkeleton() {
  const { spacing, radius, colors } = useTheme();

  return (
    <View style={{ padding: spacing.md }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              padding: spacing.md,
              marginBottom: spacing.sm,
            },
          ]}
        >
          <View style={styles.left}>
            <Skeleton width={50} height={16} />
            <Skeleton width={100} height={12} style={{ marginTop: 4 }} />
          </View>
          <Skeleton width={60} height={24} />
          <View style={styles.right}>
            <Skeleton width={70} height={16} />
            <Skeleton width={50} height={12} style={{ marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center' },
  left: { flex: 1 },
  right: { alignItems: 'flex-end', minWidth: 90 },
});
