import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Instrument } from '../../../types/api';
import { useSearch } from '../hooks/useSearch';
import { InstrumentCard } from '../../instruments/components/InstrumentCard';
import { InstrumentSkeleton } from '../../instruments/components/InstrumentSkeleton';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';

interface SearchResultsProps {
  query: string;
  onInstrumentPress: (instrument: Instrument) => void;
}

export function SearchResults({ query, onInstrumentPress }: SearchResultsProps) {
  const { data, isLoading, isError, refetch } = useSearch(query);
  const { spacing } = useTheme();
  const { t } = useTranslation();

  const results = data?.filter((i) => i.type !== 'MONEDA') ?? [];

  const renderItem = useCallback(
    ({ item }: { item: Instrument }) => (
      <InstrumentCard instrument={item} onPress={onInstrumentPress} />
    ),
    [onInstrumentPress]
  );

  const keyExtractor = useCallback((item: Instrument) => item.id.toString(), []);

  if (isLoading) return <InstrumentSkeleton />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (results.length === 0) return <EmptyState message={t('search.empty')} />;

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ padding: spacing.md }}
      showsVerticalScrollIndicator={false}
    />
  );
}
