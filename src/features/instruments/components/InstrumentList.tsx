import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View, Text, Pressable, StyleSheet } from 'react-native';
import { Instrument } from '../../../types/api';
import { useInstruments } from '../hooks/useInstruments';
import { usePortfolio } from '../../portfolio/hooks/usePortfolio';
import { aggregatePositions, calculatePortfolioSummary } from '../../portfolio/utils/aggregation';
import { InstrumentCard } from './InstrumentCard';
import { InstrumentSkeleton } from './InstrumentSkeleton';
import { ErrorState } from '../../../components/ErrorState';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';
import { formatCurrency, formatPercentage } from '../../../utils/format';
import { useWatchlistStore } from '../../../store/watchlist';

interface InstrumentListProps {
  onInstrumentPress: (instrument: Instrument) => void;
}

export function InstrumentList({ onInstrumentPress }: InstrumentListProps) {
  const { data, isLoading, isError, refetch, isRefetching } = useInstruments();
  const { data: portfolioData } = usePortfolio();
  const { colors, radius } = useTheme();
  const { t } = useTranslation();
  const watchedTickers = useWatchlistStore((s) => s.tickers);
  const [showWatchlist, setShowWatchlist] = useState(false);

  const allInstruments = useMemo(() => data?.filter((i) => i.type !== 'MONEDA') ?? [], [data]);

  const instruments = useMemo(() => {
    if (!showWatchlist) return allInstruments;
    return allInstruments.filter((i) => watchedTickers.includes(i.ticker));
  }, [allInstruments, showWatchlist, watchedTickers]);

  const summary = useMemo(() => {
    if (!portfolioData) return null;
    const aggregated = aggregatePositions(portfolioData);
    return calculatePortfolioSummary(aggregated);
  }, [portfolioData]);

  const renderItem = useCallback(
    ({ item, index }: { item: Instrument; index: number }) => (
      <InstrumentCard instrument={item} onPress={onInstrumentPress} showBorder={index > 0} />
    ),
    [onInstrumentPress],
  );

  const keyExtractor = useCallback((item: Instrument) => item.id.toString(), []);

  if (isLoading) return <InstrumentSkeleton />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <FlatList
      data={instruments}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        <View>
          {summary && (
            <View
              style={[
                styles.valueBanner,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radius.card,
                },
              ]}
            >
              <View>
                <Text style={[styles.bannerLabel, { color: colors.textMuted }]}>
                  {t('portfolio.totalValue')}
                </Text>
                <Text style={[styles.bannerValue, { color: colors.text }]}>
                  {formatCurrency(summary.totalValue)}
                </Text>
              </View>
              <View
                style={[
                  styles.bannerPill,
                  {
                    backgroundColor: summary.totalPnL >= 0 ? colors.positiveBg : colors.negativeBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bannerPct,
                    {
                      color: summary.totalPnL >= 0 ? colors.positive : colors.negative,
                    },
                  ]}
                >
                  {formatPercentage(summary.totalReturnPct)}
                </Text>
              </View>
            </View>
          )}

          {/* Filter tabs */}
          <View style={styles.filterRow}>
            <Pressable
              onPress={() => setShowWatchlist(false)}
              accessibilityRole="tab"
              accessibilityLabel={t('instruments.all')}
              accessibilityState={{ selected: !showWatchlist }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: !showWatchlist ? colors.accent : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: !showWatchlist ? colors.accentText : colors.textSecondary,
                  },
                ]}
              >
                {t('instruments.all')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowWatchlist(true)}
              accessibilityRole="tab"
              accessibilityLabel={t('instruments.watchlist')}
              accessibilityState={{ selected: showWatchlist }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: showWatchlist ? colors.accent : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: showWatchlist ? colors.accentText : colors.textSecondary,
                  },
                ]}
              >
                ★ {t('instruments.watchlist')}{' '}
                {watchedTickers.length > 0 ? `(${watchedTickers.length})` : ''}
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            {(showWatchlist ? t('instruments.watchlist') : t('instruments.title')).toUpperCase()} ·{' '}
            {instruments.length}
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  valueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 16,
    paddingHorizontal: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  bannerLabel: { fontSize: 12.5, fontWeight: '500' },
  bannerValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.44,
    marginTop: 2,
  },
  bannerPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  bannerPct: { fontSize: 13, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontWeight: '600' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.78,
    marginBottom: 6,
  },
});
