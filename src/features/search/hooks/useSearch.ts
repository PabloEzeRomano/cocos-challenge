import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../../hooks/useDebounce';
import { searchInstruments } from '../../../services/api';
import { Instrument } from '../../../types/api';

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query.trim().toUpperCase(), 300);

  return useQuery<Instrument[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchInstruments(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 60_000,
  });
}
