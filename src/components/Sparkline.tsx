import { memo } from 'react';
import Svg, { Polyline } from 'react-native-svg';
import { generateSparklinePoints } from '../features/instruments/utils/sparkline';
import { useTheme } from '../theme/useTheme';

interface SparklineProps {
  ticker: string;
  closePrice: number;
  lastPrice: number;
  width?: number;
  height?: number;
  positive: boolean;
}

export const Sparkline = memo(function Sparkline({
  ticker,
  closePrice,
  lastPrice,
  width = 62,
  height = 30,
  positive,
}: SparklineProps) {
  const { colors } = useTheme();
  const points = generateSparklinePoints(ticker, closePrice, lastPrice, 20);

  const minY = Math.min(...points);
  const maxY = Math.max(...points);
  const range = maxY - minY || 1;
  const pad = 3;

  const svgPoints = points
    .map((y, i) => {
      const x = pad + (i / (points.length - 1)) * (width - pad * 2);
      const normalizedY = height - pad - ((y - minY) / range) * (height - pad * 2);
      return `${x},${normalizedY}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline
        points={svgPoints}
        fill="none"
        stroke={positive ? colors.positive : colors.negative}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
