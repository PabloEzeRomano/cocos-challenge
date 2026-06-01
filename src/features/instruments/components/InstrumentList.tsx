import React, { useCallback } from 'react';
import { FlatList, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { Instrument } from '../../../types/api';
import { useInstruments } from '../hooks/useInstruments';
import { InstrumentCard } from './InstrumentCard';
import { InstrumentSkeleton } from './InstrumentSkeleton';
import { ErrorState } from '../../../components/ErrorState';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';

interface InstrumentListProps {
  onInstrumentPress: (instrument: Instrument) => void;
}

export function InstrumentList({ onInstrumentPress }: InstrumentListProps) {
  const { data, isLoading, isError, refetch, isRefetching } = useInstruments();
  const { colors, typography } = useTheme();
  const { t } = useTranslation();

  const instruments = data?.filter((i) => i.type !== 'MONEDA') ?? [];

  const renderItem = useCallback(
    ({ item, index }: { item: Instrument; index: number }) => (
      <InstrumentCard instrument={item} onPress={onInstrumentPress} showBorder={index > 0} />
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
      ListHeaderComponent={
        <Text style={[styles.title, typography.h1, { color: colors.text }]}>
          {t('instruments.title')}
        </Text>
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
  title: { marginTop: 6, marginBottom: 14 },
});
