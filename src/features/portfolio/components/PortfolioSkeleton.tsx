import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../../components/Skeleton';
import { useTheme } from '../../../theme/useTheme';

export function PortfolioSkeleton() {
  const { colors, radius } = useTheme();

  return (
    <View style={styles.container}>
      {/* Summary card skeleton */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.card,
          },
        ]}
      >
        <Skeleton width={80} height={13} />
        <Skeleton width={180} height={34} style={{ marginTop: 8 }} />
        <Skeleton width={150} height={16} style={{ marginTop: 12 }} />
        <Skeleton width="100%" height={60} borderRadius={0} style={{ marginTop: 14 }} />
      </View>

      {/* Cash skeleton */}
      <View
        style={[
          styles.cashRow,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.card,
          },
        ]}
      >
        <Skeleton width={140} height={14} />
        <Skeleton width={80} height={15} />
      </View>

      {/* Position skeletons */}
      <Skeleton width={100} height={11} style={{ marginTop: 22 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <View
          key={i}
          style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
        >
          <Skeleton width={40} height={40} borderRadius={12} />
          <View style={styles.info}>
            <Skeleton width={50} height={13} />
            <Skeleton width={90} height={11} style={{ marginTop: 5 }} />
          </View>
          <View style={styles.right}>
            <Skeleton width={70} height={13} />
            <Skeleton width={80} height={11} style={{ marginTop: 5 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 22, paddingTop: 6 },
  card: { borderWidth: 1, padding: 20, paddingBottom: 8 },
  cashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 14,
    paddingHorizontal: 18,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 14,
  },
  info: { flex: 1 },
  right: { alignItems: 'flex-end' },
});
