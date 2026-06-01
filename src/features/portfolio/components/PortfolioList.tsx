import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { usePortfolio } from '../hooks/usePortfolio';
import { aggregatePositions, calculatePortfolioSummary, AggregatedPosition } from '../utils/aggregation';
import { PortfolioPositionCard } from './PortfolioPositionCard';
import { PortfolioSummaryHeader } from './PortfolioSummary';
import { PortfolioSkeleton } from './PortfolioSkeleton';
import { ErrorState } from '../../../components/ErrorState';
import { useTheme } from '../../../theme/useTheme';
import { Instrument } from '../../../types/api';

interface PortfolioListProps {
  onPositionPress: (instrument: Instrument) => void;
}

export function PortfolioList({ onPositionPress }: PortfolioListProps) {
  const { data, isLoading, isError, refetch, isRefetching } = usePortfolio();
  const { colors, spacing } = useTheme();

  const aggregated = useMemo(() => {
    if (!data) return [];
    return aggregatePositions(data);
  }, [data]);

  const summary = useMemo(() => calculatePortfolioSummary(aggregated), [aggregated]);

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
    [onPositionPress]
  );

  const renderItem = useCallback(
    ({ item }: { item: AggregatedPosition }) => (
      <PortfolioPositionCard position={item} onPress={handlePress} />
    ),
    [handlePress]
  );

  const keyExtractor = useCallback((item: AggregatedPosition) => item.ticker, []);

  if (isLoading) return <PortfolioSkeleton />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <FlatList
      data={aggregated}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={<PortfolioSummaryHeader summary={summary} />}
      contentContainerStyle={{ padding: spacing.md }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.accent}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}
