import React, { memo } from 'react';
import Svg, { Polyline } from 'react-native-svg';
import { generateSparklinePoints } from '../features/instruments/utils/sparkline';

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
  width = 60,
  height = 24,
  positive,
}: SparklineProps) {
  const points = generateSparklinePoints(ticker, closePrice, lastPrice, 20);

  const minY = Math.min(...points);
  const maxY = Math.max(...points);
  const range = maxY - minY || 1;

  const svgPoints = points
    .map((y, i) => {
      const x = (i / (points.length - 1)) * width;
      const normalizedY = height - ((y - minY) / range) * height;
      return `${x},${normalizedY}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={svgPoints}
        fill="none"
        stroke={positive ? '#10B981' : '#EF4444'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});
