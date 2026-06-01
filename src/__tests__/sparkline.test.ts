import { generateSparklinePoints } from '../features/instruments/utils/sparkline';

describe('generateSparklinePoints', () => {
  it('generates deterministic output', () => {
    const points1 = generateSparklinePoints('YPFD', 100, 110, 20);
    const points2 = generateSparklinePoints('YPFD', 100, 110, 20);
    expect(points1).toEqual(points2);
  });

  it('generates correct number of points', () => {
    const points = generateSparklinePoints('MOLA', 50, 55, 20);
    expect(points).toHaveLength(20);
  });

  it('starts at close price', () => {
    const points = generateSparklinePoints('TEST', 100, 120, 20);
    expect(points[0]).toBe(100);
  });

  it('ends at last price', () => {
    const points = generateSparklinePoints('TEST', 100, 120, 20);
    expect(points[19]).toBe(120);
  });

  it('produces different results for different tickers', () => {
    const points1 = generateSparklinePoints('AAAA', 100, 110, 20);
    const points2 = generateSparklinePoints('BBBB', 100, 110, 20);
    expect(points1).not.toEqual(points2);
  });

  it('handles equal close and last price', () => {
    const points = generateSparklinePoints('FLAT', 100, 100, 20);
    expect(points[0]).toBe(100);
    expect(points[19]).toBe(100);
    // points should still have variation (noise)
    const unique = new Set(points);
    expect(unique.size).toBeGreaterThan(1);
  });
});
