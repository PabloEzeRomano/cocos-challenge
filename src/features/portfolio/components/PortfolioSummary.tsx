import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';
import { PortfolioSummaryData } from '../utils/aggregation';
import { formatCurrency, formatPercentage } from '../../../utils/format';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryData;
}

export function PortfolioSummaryHeader({ summary }: PortfolioSummaryProps) {
  const { colors, spacing, typography, radius } = useTheme();
  const { t } = useTranslation();
  const isPositive = summary.totalPnL >= 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md }]}>
      <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
        {t('portfolio.totalValue')}
      </Text>
      <Text style={[typography.h1, { color: colors.text, marginBottom: spacing.sm }]}>
        {formatCurrency(summary.totalValue)}
      </Text>
      <View style={styles.row}>
        <Text style={[typography.bodySmall, { color: isPositive ? colors.positive : colors.negative, fontWeight: '600' }]}>
          {formatCurrency(summary.totalPnL)}
        </Text>
        <Text style={[typography.bodySmall, { color: isPositive ? colors.positive : colors.negative, marginLeft: spacing.sm }]}>
          ({formatPercentage(summary.totalReturnPct)})
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  row: { flexDirection: 'row', alignItems: 'center' },
});
