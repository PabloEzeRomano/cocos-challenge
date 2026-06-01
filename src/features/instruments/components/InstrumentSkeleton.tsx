import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../../../components/Skeleton';
import { useTheme } from '../../../theme/useTheme';

export function InstrumentSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: 7 }).map((_, i) => (
        <View key={i} style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <Skeleton width={40} height={40} borderRadius={12} />
          <View style={styles.info}>
            <Skeleton width="46%" height={13} />
            <Skeleton width="64%" height={11} style={{ marginTop: 7 }} />
          </View>
          <Skeleton width={56} height={26} borderRadius={6} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 22, paddingTop: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  info: { flex: 1 },
});
