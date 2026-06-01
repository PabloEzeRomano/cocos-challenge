import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { useTranslation } from '../../../i18n/useTranslation';
import { Instrument } from '../../../types/api';
import { InstrumentCard } from '../../instruments/components/InstrumentCard';
import { InstrumentSkeleton } from '../../instruments/components/InstrumentSkeleton';
import { useSearch } from '../hooks/useSearch';

interface SearchResultsProps {
  query: string;
  onInstrumentPress: (instrument: Instrument) => void;
}

export function SearchResults({ query, onInstrumentPress }: SearchResultsProps) {
  const { data, isLoading, isError, refetch } = useSearch(query);
  const { t } = useTranslation();

  const results = data?.filter((i) => i.type !== 'MONEDA') ?? [];

  const renderItem = useCallback(
    ({ item, index }: { item: Instrument; index: number }) => (
      <InstrumentCard instrument={item} onPress={onInstrumentPress} showBorder={index > 0} />
    ),
    [onInstrumentPress],
  );

  const keyExtractor = useCallback((item: Instrument) => item.id.toString(), []);

  if (isLoading) return <InstrumentSkeleton />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (results.length === 0)
    return <EmptyState title={t('search.empty')} subtitle={t('search.emptyHint')} />;

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 14 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
