import {
  aggregatePositions,
  calculatePortfolioSummary,
} from '../features/portfolio/utils/aggregation';
import { PortfolioPosition } from '../types/api';

describe('aggregatePositions', () => {
  it('aggregates multiple lots of same ticker', () => {
    const positions: PortfolioPosition[] = [
      {
        instrument_id: 1,
        ticker: 'MOLA',
        quantity: 100,
        last_price: 50,
        close_price: 48,
        avg_cost_price: 40,
      },
      {
        instrument_id: 1,
        ticker: 'MOLA',
        quantity: 200,
        last_price: 50,
        close_price: 48,
        avg_cost_price: 45,
      },
    ];

    const result = aggregatePositions(positions);
    expect(result).toHaveLength(1);
    expect(result[0].ticker).toBe('MOLA');
    expect(result[0].totalQuantity).toBe(300);
    // weighted avg: (100*40 + 200*45) / 300 = 13000/300 = 43.333...
    expect(result[0].weightedAvgCost).toBeCloseTo(43.333, 2);
    // market value: 300 * 50 = 15000
    expect(result[0].marketValue).toBe(15000);
    // pnl: 15000 - 13000 = 2000
    expect(result[0].pnl).toBe(2000);
    // return%: 2000/13000 * 100 = 15.384...
    expect(result[0].returnPct).toBeCloseTo(15.384, 2);
  });

  it('handles single position', () => {
    const positions: PortfolioPosition[] = [
      {
        instrument_id: 2,
        ticker: 'YPFD',
        quantity: 50,
        last_price: 100,
        close_price: 95,
        avg_cost_price: 80,
      },
    ];

    const result = aggregatePositions(positions);
    expect(result).toHaveLength(1);
    expect(result[0].totalQuantity).toBe(50);
    expect(result[0].weightedAvgCost).toBe(80);
    expect(result[0].marketValue).toBe(5000);
    expect(result[0].pnl).toBe(1000);
    expect(result[0].returnPct).toBe(25);
  });

  it('treats ARS as cash position', () => {
    const positions: PortfolioPosition[] = [
      {
        instrument_id: 99,
        ticker: 'ARS',
        quantity: 50000,
        last_price: 1,
        close_price: 1,
        avg_cost_price: 99.9,
      },
    ];

    const result = aggregatePositions(positions);
    expect(result).toHaveLength(1);
    expect(result[0].isCash).toBe(true);
    expect(result[0].marketValue).toBe(50000);
    expect(result[0].pnl).toBe(0);
    expect(result[0].returnPct).toBe(0);
  });

  it('handles multiple different tickers', () => {
    const positions: PortfolioPosition[] = [
      {
        instrument_id: 1,
        ticker: 'MOLA',
        quantity: 100,
        last_price: 50,
        close_price: 48,
        avg_cost_price: 40,
      },
      {
        instrument_id: 2,
        ticker: 'YPFD',
        quantity: 50,
        last_price: 100,
        close_price: 95,
        avg_cost_price: 80,
      },
    ];

    const result = aggregatePositions(positions);
    expect(result).toHaveLength(2);
  });
});

describe('calculatePortfolioSummary', () => {
  it('calculates total portfolio value including cash', () => {
    const positions = aggregatePositions([
      {
        instrument_id: 1,
        ticker: 'MOLA',
        quantity: 100,
        last_price: 50,
        close_price: 48,
        avg_cost_price: 40,
      },
      {
        instrument_id: 99,
        ticker: 'ARS',
        quantity: 10000,
        last_price: 1,
        close_price: 1,
        avg_cost_price: 99.9,
      },
    ]);

    const summary = calculatePortfolioSummary(positions);
    // total: 5000 + 10000 = 15000
    expect(summary.totalValue).toBe(15000);
    // pnl from MOLA only: 5000 - 4000 = 1000
    expect(summary.totalPnL).toBe(1000);
    // return: 1000/4000 * 100 = 25%
    expect(summary.totalReturnPct).toBe(25);
  });

  it('handles portfolio with losses', () => {
    const positions = aggregatePositions([
      {
        instrument_id: 1,
        ticker: 'MOLA',
        quantity: 100,
        last_price: 30,
        close_price: 48,
        avg_cost_price: 40,
      },
    ]);

    const summary = calculatePortfolioSummary(positions);
    expect(summary.totalPnL).toBe(-1000);
    expect(summary.totalReturnPct).toBe(-25);
  });
});
