function seedFromTicker(ticker: string): number {
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = ((hash << 5) - hash + ticker.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

export function generateSparklinePoints(
  ticker: string,
  closePrice: number,
  lastPrice: number,
  count: number
): number[] {
  const seed = seedFromTicker(ticker);
  const random = seededRandom(seed);
  const points: number[] = [];

  const range = Math.abs(lastPrice - closePrice) * 0.3 || closePrice * 0.01;

  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    const baseValue = closePrice + (lastPrice - closePrice) * progress;
    const noise = (random() - 0.5) * 2 * range;
    points.push(baseValue + noise);
  }

  points[0] = closePrice;
  points[count - 1] = lastPrice;

  return points;
}
