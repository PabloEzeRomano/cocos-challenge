import { StyleSheet, Text, View } from 'react-native';
import { BalanceChart } from '../../../components/BalanceChart';
import { useTranslation } from '../../../i18n/useTranslation';
import { useTheme } from '../../../theme/useTheme';
import { formatCurrency, formatPercentage } from '../../../utils/format';
import { PortfolioSummaryData } from '../utils/aggregation';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryData;
  cashBalance: number;
  totalCost?: number;
}

export function PortfolioSummaryHeader({ summary, cashBalance, totalCost }: PortfolioSummaryProps) {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();
  const isPositive = summary.totalPnL >= 0;

  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>{t('portfolio.title')}</Text>

      {/* Summary card */}
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
        <Text style={[styles.label, { color: colors.textMuted }]}>{t('portfolio.totalValue')}</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          {formatCurrency(summary.totalValue)}
        </Text>

        <View style={styles.pnlRow}>
          <Text style={[styles.pnlText, { color: isPositive ? colors.positive : colors.negative }]}>
            {isPositive ? '↑' : '↓'} {formatCurrency(Math.abs(summary.totalPnL))}
          </Text>
          <View
            style={[
              styles.pctBadge,
              {
                backgroundColor: isPositive ? colors.positiveBg : colors.negativeBg,
              },
            ]}
          >
            <Text
              style={[styles.pctText, { color: isPositive ? colors.positive : colors.negative }]}
            >
              {formatPercentage(summary.totalReturnPct)}
            </Text>
          </View>
          <Text style={[styles.alltime, { color: colors.textMuted }]}>
            {t('portfolio.alltime')}
          </Text>
        </View>

        <View style={styles.chartWrap}>
          <BalanceChart
            positive={isPositive}
            totalValue={summary.totalValue}
            totalCost={totalCost ?? summary.totalValue - summary.totalPnL}
          />
        </View>
      </View>

      {/* Cash row */}
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
        <Text style={[styles.cashLabel, { color: colors.textSecondary }]}>
          {t('portfolio.availableTrade')}
        </Text>
        <Text style={[styles.cashValue, { color: colors.text }]}>
          {formatCurrency(cashBalance)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.84,
    marginTop: 6,
    marginBottom: 18,
  },
  card: { borderWidth: 1, padding: 20, paddingBottom: 8 },
  label: { fontSize: 13, fontWeight: '500' },
  totalValue: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.68,
    marginTop: 3,
  },
  pnlRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  pnlText: { fontWeight: '600', fontSize: 15 },
  pctBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 7 },
  pctText: { fontSize: 13, fontWeight: '600' },
  alltime: { fontSize: 12.5 },
  chartWrap: { marginTop: 14, marginHorizontal: -4 },
  cashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    padding: 14,
    paddingHorizontal: 18,
    marginTop: 12,
  },
  cashLabel: { fontSize: 14 },
  cashValue: { fontWeight: '600', fontSize: 15 },
});
