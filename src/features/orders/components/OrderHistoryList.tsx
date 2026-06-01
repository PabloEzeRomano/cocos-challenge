import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../../components/Avatar';
import { Badge } from '../../../components/Badge';
import { EmptyState } from '../../../components/EmptyState';
import { useTranslation } from '../../../i18n/useTranslation';
import { OrderHistoryEntry, useOrderHistoryStore } from '../../../store/orderHistory';
import { useTheme } from '../../../theme/useTheme';
import { formatCurrency } from '../../../utils/format';

export function OrderHistoryList() {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();
  const orders = useOrderHistoryStore((s) => s.orders);
  const clearOrders = useOrderHistoryStore((s) => s.clearOrders);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = useCallback(
    ({ item, index }: { item: OrderHistoryEntry; index: number }) => {
      const isBuy = item.side === 'BUY';
      const shares = item.quantity === 1 ? t('order.share') : t('order.shares');
      const statusKey = item.status.toLowerCase() as 'filled' | 'pending' | 'rejected';

      return (
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
          <View style={styles.cardHeader}>
            <Avatar ticker={item.ticker} size={36} />
            <View style={styles.cardInfo}>
              <View style={styles.cardTitleRow}>
                <Text style={[styles.ticker, { color: colors.text }]}>{item.ticker}</Text>
                <Badge status={statusKey} label={t(`order.${statusKey}`)} />
              </View>
              <Text style={[styles.detail, { color: colors.textMuted }]}>
                {isBuy ? t('order.buy') : t('order.sell')} · {item.quantity} {shares} ·{' '}
                {item.type === 'MARKET' ? t('order.market') : t('order.limit')}
              </Text>
            </View>
          </View>

          <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerLabel, { color: colors.textMuted }]}>
              {formatDate(item.timestamp)}
            </Text>
            <Text
              style={[styles.footerValue, { color: isBuy ? colors.negative : colors.positive }]}
            >
              {isBuy ? '-' : '+'}
              {formatCurrency(item.total)}
            </Text>
          </View>
        </View>
      );
    },
    [colors, radius, t],
  );

  const keyExtractor = useCallback((item: OrderHistoryEntry) => item.id, []);

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState title={t('orders.emptyTitle')} subtitle={t('orders.emptySubtitle')} />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={[styles.title, { color: colors.text }]}>{t('orders.title')}</Text>
          <Text style={[styles.count, { color: colors.textMuted }]}>
            {orders.length} {orders.length === 1 ? t('orders.order') : t('orders.orderPlural')}
          </Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  list: { paddingHorizontal: 22, paddingBottom: 24 },
  listHeader: { marginTop: 6, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.84 },
  count: { fontSize: 13, marginTop: 4 },
  card: { borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  cardInfo: { flex: 1 },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticker: { fontWeight: '700', fontSize: 15 },
  detail: { fontSize: 12.5, marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  footerLabel: { fontSize: 12.5 },
  footerValue: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
