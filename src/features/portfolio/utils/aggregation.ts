import { PortfolioPosition } from '../../../types/api';

export interface AggregatedPosition {
  instrumentId: number;
  ticker: string;
  totalQuantity: number;
  weightedAvgCost: number;
  lastPrice: number;
  closePrice: number;
  marketValue: number;
  pnl: number;
  returnPct: number;
  isCash: boolean;
}

export function aggregatePositions(positions: PortfolioPosition[]): AggregatedPosition[] {
  const grouped = new Map<string, PortfolioPosition[]>();

  for (const pos of positions) {
    const existing = grouped.get(pos.ticker) || [];
    existing.push(pos);
    grouped.set(pos.ticker, existing);
  }

  const result: AggregatedPosition[] = [];

  for (const [ticker, lots] of grouped) {
    const isCash = ticker === 'ARS';
    const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);

    if (isCash) {
      result.push({
        instrumentId: lots[0].instrument_id,
        ticker,
        totalQuantity,
        weightedAvgCost: 1,
        lastPrice: 1,
        closePrice: 1,
        marketValue: totalQuantity,
        pnl: 0,
        returnPct: 0,
        isCash: true,
      });
      continue;
    }

    const totalCostBasis = lots.reduce(
      (sum, lot) => sum + lot.quantity * lot.avg_cost_price,
      0
    );
    const weightedAvgCost = totalCostBasis / totalQuantity;
    const lastPrice = lots[0].last_price;
    const closePrice = lots[0].close_price;
    const marketValue = totalQuantity * lastPrice;
    const pnl = marketValue - totalCostBasis;
    const returnPct = (pnl / totalCostBasis) * 100;

    result.push({
      instrumentId: lots[0].instrument_id,
      ticker,
      totalQuantity,
      weightedAvgCost,
      lastPrice,
      closePrice,
      marketValue,
      pnl,
      returnPct,
      isCash: false,
    });
  }

  return result;
}

export interface PortfolioSummaryData {
  totalValue: number;
  totalPnL: number;
  totalReturnPct: number;
}

export function calculatePortfolioSummary(positions: AggregatedPosition[]): PortfolioSummaryData {
  let totalValue = 0;
  let totalCostBasis = 0;

  for (const pos of positions) {
    totalValue += pos.marketValue;
    if (!pos.isCash) {
      totalCostBasis += pos.totalQuantity * pos.weightedAvgCost;
    }
  }

  const totalPnL = positions
    .filter((p) => !p.isCash)
    .reduce((sum, p) => sum + p.pnl, 0);

  const totalReturnPct = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;

  return { totalValue, totalPnL, totalReturnPct };
}
