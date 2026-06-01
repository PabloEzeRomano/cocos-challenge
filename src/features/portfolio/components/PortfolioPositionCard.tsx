import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AggregatedPosition } from '../utils/aggregation';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';
import { formatCurrency, formatPercentage, formatQuantity } from '../../../utils/format';

interface PortfolioPositionCardProps {
  position: AggregatedPosition;
  onPress: (position: AggregatedPosition) => void;
}

export const PortfolioPositionCard = memo(function PortfolioPositionCard({
  position,
  onPress,
}: PortfolioPositionCardProps) {
  const { colors, spacing, typography, radius, shadows } = useTheme();
  const { t } = useTranslation();
  const isPositive = position.pnl >= 0;

  if (position.isCash) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadows.card },
        ]}
      >
        <View style={styles.leftSection}>
          <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>
            {t('portfolio.cash')}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>ARS</Text>
        </View>
        <Text style={[typography.body, { color: colors.text, fontWeight: '500' }]}>
          {formatCurrency(position.marketValue)}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => onPress(position)}
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadows.card },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${position.ticker} ${formatQuantity(position.totalQuantity)} acciones valor ${formatCurrency(position.marketValue)}`}
    >
      <View style={styles.leftSection}>
        <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>
          {position.ticker}
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {formatQuantity(position.totalQuantity)} {t('order.shares')}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={[typography.body, { color: colors.text, fontWeight: '500', textAlign: 'right' }]}>
          {formatCurrency(position.marketValue)}
        </Text>
        <Text
          style={[
            typography.caption,
            { color: isPositive ? colors.positive : colors.negative, textAlign: 'right', fontWeight: '500' },
          ]}
        >
          {formatPercentage(position.returnPct)}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  leftSection: { flex: 1 },
  rightSection: { alignItems: 'flex-end', minWidth: 100 },
});
