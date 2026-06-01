import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../../../components/Skeleton';
import { useTheme } from '../../../theme/useTheme';

export function PortfolioSkeleton() {
  const { spacing, radius, colors } = useTheme();

  return (
    <View style={{ padding: spacing.md }}>
      <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md }}>
        <Skeleton width={80} height={12} />
        <Skeleton width={150} height={28} style={{ marginTop: 8 }} />
        <Skeleton width={120} height={16} style={{ marginTop: 8 }} />
      </View>
      {Array.from({ length: 5 }).map((_, i) => (
        <View
          key={i}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            padding: spacing.md,
            marginBottom: spacing.sm,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Skeleton width={50} height={16} />
            <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Skeleton width={80} height={16} />
            <Skeleton width={50} height={12} style={{ marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  );
}
