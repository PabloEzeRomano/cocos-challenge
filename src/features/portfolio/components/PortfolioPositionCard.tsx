import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AggregatedPosition } from '../utils/aggregation';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';
import { Avatar } from '../../../components/Avatar';
import { formatCurrency, formatQuantity } from '../../../utils/format';

interface PortfolioPositionCardProps {
  position: AggregatedPosition;
  onPress: (position: AggregatedPosition) => void;
  showBorder: boolean;
}

export const PortfolioPositionCard = memo(function PortfolioPositionCard({
  position, onPress, showBorder,
}: PortfolioPositionCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isPositive = position.pnl >= 0;
  const shares = position.totalQuantity === 1 ? t('order.share') : t('order.shares');

  return (
    <Pressable
      onPress={() => onPress(position)}
      style={[styles.container, showBorder && { borderTopWidth: 1, borderTopColor: colors.border }]}
      accessibilityRole="button"
      accessibilityLabel={`${position.ticker} ${formatQuantity(position.totalQuantity)} ${shares}`}
    >
      <Avatar ticker={position.ticker} />

      <View style={styles.info}>
        <Text style={[styles.ticker, { color: colors.text }]}>{position.ticker}</Text>
        <Text style={[styles.detail, { color: colors.textMuted }]}>
          {formatQuantity(position.totalQuantity)} {shares} · {formatCurrency(position.lastPrice)}
        </Text>
      </View>

      <View style={styles.valueCol}>
        <Text style={[styles.marketValue, { color: colors.text }]}>{formatCurrency(position.marketValue)}</Text>
        <Text style={[styles.pnl, { color: isPositive ? colors.positive : colors.negative }]}>
          {isPositive ? '+' : ''}{formatCurrency(position.pnl)} · {Math.abs(position.returnPct).toFixed(2)}%
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  info: { flex: 1, minWidth: 0 },
  ticker: { fontWeight: '600', fontSize: 15 },
  detail: { fontSize: 12.5, marginTop: 1 },
  valueCol: { alignItems: 'flex-end' },
  marketValue: { fontWeight: '600', fontSize: 14.5 },
  pnl: { fontSize: 12.5, fontWeight: '600', marginTop: 2 },
});
