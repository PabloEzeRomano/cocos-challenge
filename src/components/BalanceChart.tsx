import { memo, useMemo } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useTheme } from '../theme/useTheme';

interface BalanceChartProps {
  positive: boolean;
  width?: number;
  height?: number;
  /** Array of portfolio value data points over time. If not provided, generates from totalValue */
  dataPoints?: number[];
  totalValue?: number;
  totalCost?: number;
}

/**
 * Generate realistic-looking portfolio value curve from cost basis to current value.
 * Uses deterministic noise so chart is stable across re-renders.
 */
function generatePortfolioCurve(totalCost: number, totalValue: number, count: number): number[] {
  const points: number[] = [];
  const seed = Math.round(totalCost * 100) + Math.round(totalValue * 100);

  // Simple seeded PRNG
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };

  const diff = totalValue - totalCost;
  const volatility = Math.abs(diff) * 0.15 || totalCost * 0.01;

  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    // Smooth trend from cost to value with some randomness
    const trend = totalCost + diff * progress;
    // Add noise that's stronger in middle, weaker at ends
    const noiseScale = Math.sin(progress * Math.PI) * volatility;
    const noise = (rand() - 0.5) * 2 * noiseScale;
    points.push(trend + noise);
  }

  // Pin endpoints
  points[0] = totalCost;
  points[count - 1] = totalValue;

  return points;
}

export const BalanceChart = memo(function BalanceChart({
  positive,
  width = 320,
  height = 72,
  dataPoints,
  totalValue,
  totalCost,
}: BalanceChartProps) {
  const { colors } = useTheme();
  const pad = 2;

  const points = useMemo(() => {
    if (dataPoints && dataPoints.length > 1) return dataPoints;
    if (totalValue && totalCost) {
      return generatePortfolioCurve(totalCost, totalValue, 24);
    }
    // Fallback static curve
    return [0.22, 0.3, 0.26, 0.42, 0.38, 0.55, 0.5, 0.68, 0.62, 0.8, 0.74, 0.92];
  }, [dataPoints, totalValue, totalCost]);

  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;

  const pts = points.map((v, i) => {
    const x = pad + (i / (points.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - minVal) / range) * (height - pad * 2 - 6);
    return [x, y] as const;
  });

  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width - pad} ${height} L${pad} ${height} Z`;
  const gradId = positive ? 'gu' : 'gd';
  const color = positive ? colors.positive : colors.negative;

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.18} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={area} fill={`url(#${gradId})`} />
      <Path
        d={line}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
});
