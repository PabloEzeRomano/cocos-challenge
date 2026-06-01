import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio } from '../../../services/api';
import { PortfolioPosition } from '../../../types/api';

export function usePortfolio() {
  return useQuery<PortfolioPosition[]>({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio,
    staleTime: 30_000,
  });
}
