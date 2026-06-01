import { useQuery } from '@tanstack/react-query';
import { searchInstruments } from '../../../services/api';
import { useDebounce } from '../../../hooks/useDebounce';
import { Instrument } from '../../../types/api';

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query.trim(), 300);

  return useQuery<Instrument[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchInstruments(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 60_000,
  });
}
