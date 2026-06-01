import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OrderResponse, OrderSide, OrderType } from '../../../types/api';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';
import { Badge } from '../../../components/Badge';
import { SummaryRow } from '../../../components/SummaryRow';
import { formatCurrency } from '../../../utils/format';

interface OrderResultProps {
  response: OrderResponse;
  side: OrderSide;
  ticker: string;
  qty: number;
  orderType: OrderType;
  total: number;
  onClose: () => void;
}

function CheckIcon({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M3 8.5l3.2 3.2L13 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function OrderResult({ response, side, ticker, qty, orderType, total, onClose }: OrderResultProps) {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();

  const isFilled = response.status === 'FILLED';
  const statusBg = isFilled ? colors.positiveBg : colors.warnBg;
  const statusColor = isFilled ? colors.positive : colors.warn;
  const statusKey = response.status.toLowerCase() as 'filled' | 'pending' | 'rejected';
  const statusLabel = t(`order.${statusKey}`);
  const shares = qty === 1 ? t('order.share') : t('order.shares');
  const sideNoun = side === 'BUY' ? t('order.buyNoun') : t('order.sellNoun');

  // Commission display
  const commission = Math.round(total * 0.005);
  const grandTotal = side === 'BUY' ? total + commission : total - commission;

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: statusBg }]}>
        <CheckIcon color={statusColor} />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>{t('order.orderSent')}</Text>

      {/* Description */}
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {sideNoun} {t('order.ofShares')} {qty} {shares} {t('order.ofShares')} {ticker}
      </Text>

      {/* Summary card */}
      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card }]}>
        <SummaryRow label={t('order.status')} value={<Badge status={statusKey} label={statusLabel} />} />
        <SummaryRow label={t('order.orderId')} value={`#${response.id}`} />
        <SummaryRow label={t('order.typeLabel')} value={orderType === 'MARKET' ? t('order.market') : t('order.limit')} />
        <SummaryRow
          label={side === 'BUY' ? t('order.totalDebited') : t('order.totalCredited')}
          value={<Text style={[styles.totalValue, { color: colors.text }]}>{formatCurrency(grandTotal)}</Text>}
          last
        />
      </View>

      <View style={styles.spacer} />

      {/* Done button */}
      <Pressable
        onPress={onClose}
        style={[styles.doneBtn, { backgroundColor: colors.accent, borderRadius: radius.button }]}
      >
        <Text style={[styles.doneBtnText, { color: colors.accentText }]}>{t('order.done')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    letterSpacing: -0.46,
  },
  description: {
    fontSize: 14.5,
    marginTop: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryCard: {
    alignSelf: 'stretch',
    borderWidth: 1,
    marginTop: 22,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  spacer: { flex: 1 },
  doneBtn: {
    alignSelf: 'stretch',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  doneBtnText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
