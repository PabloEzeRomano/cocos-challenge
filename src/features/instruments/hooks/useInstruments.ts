import { useQuery } from '@tanstack/react-query';
import { fetchInstruments } from '../../../services/api';
import { Instrument } from '../../../types/api';

export function useInstruments() {
  return useQuery<Instrument[]>({
    queryKey: ['instruments'],
    queryFn: fetchInstruments,
    staleTime: 30_000,
  });
}
