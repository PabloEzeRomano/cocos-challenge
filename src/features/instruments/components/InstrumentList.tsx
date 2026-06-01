import React, { useCallback } from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import { Instrument } from '../../../types/api';
import { useInstruments } from '../hooks/useInstruments';
import { InstrumentCard } from './InstrumentCard';
import { InstrumentSkeleton } from './InstrumentSkeleton';
import { ErrorState } from '../../../components/ErrorState';
import { useTheme } from '../../../theme/useTheme';

interface InstrumentListProps {
  onInstrumentPress: (instrument: Instrument) => void;
}

export function InstrumentList({ onInstrumentPress }: InstrumentListProps) {
  const { data, isLoading, isError, refetch, isRefetching } = useInstruments();
  const { colors, spacing } = useTheme();

  const instruments = data?.filter((i) => i.type !== 'MONEDA') ?? [];

  const renderItem = useCallback(
    ({ item }: { item: Instrument }) => (
      <InstrumentCard instrument={item} onPress={onInstrumentPress} />
    ),
    [onInstrumentPress]
  );

  const keyExtractor = useCallback((item: Instrument) => item.id.toString(), []);

  if (isLoading) return <InstrumentSkeleton />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <FlatList
      data={instruments}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
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
