import { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ErrorState } from '../../../components/ErrorState';
import { useTranslation } from '../../../i18n/useTranslation';
import { useTheme } from '../../../theme/useTheme';
import { Instrument } from '../../../types/api';
import { usePortfolio } from '../hooks/usePortfolio';
import {
  AggregatedPosition,
  aggregatePositions,
  calculatePortfolioSummary,
} from '../utils/aggregation';
import { PortfolioPositionCard } from './PortfolioPositionCard';
import { PortfolioSkeleton } from './PortfolioSkeleton';
import { PortfolioSummaryHeader } from './PortfolioSummary';

interface PortfolioListProps {
  onPositionPress: (instrument: Instrument) => void;
}

export function PortfolioList({ onPositionPress }: PortfolioListProps) {
  const { data, isLoading, isError, refetch, isRefetching } = usePortfolio();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const aggregated = useMemo(() => {
    if (!data) return [];
    return aggregatePositions(data);
  }, [data]);

  const cashPosition = aggregated.find((p) => p.isCash);
  const positions = aggregated.filter((p) => !p.isCash);
  const summary = useMemo(() => calculatePortfolioSummary(aggregated), [aggregated]);
  const totalCost = useMemo(
    () => positions.reduce((sum, p) => sum + p.totalQuantity * p.weightedAvgCost, 0),
    [positions],
  );

  const handlePress = useCallback(
    (position: AggregatedPosition) => {
      if (position.isCash) return;
      const instrument: Instrument = {
        id: position.instrumentId,
        ticker: position.ticker,
        name: position.ticker,
        type: 'ACCIONES',
        last_price: position.lastPrice,
        close_price: position.closePrice,
      };
      onPositionPress(instrument);
    },
    [onPositionPress],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: AggregatedPosition; index: number }) => (
      <PortfolioPositionCard position={item} onPress={handlePress} showBorder={index > 0} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: AggregatedPosition) => item.ticker, []);

  if (isLoading) return <PortfolioSkeleton />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <FlatList
      data={positions}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        <View>
          <PortfolioSummaryHeader
            summary={summary}
            cashBalance={cashPosition?.marketValue ?? 0}
            totalCost={totalCost}
          />

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            {t('portfolio.positions').toUpperCase()} · {positions.length}
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.78,
    marginTop: 22,
    marginBottom: 6,
  },
});
