import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Instrument } from '../../../types/api';
import { useTheme } from '../../../theme/useTheme';
import { Avatar } from '../../../components/Avatar';
import { Sparkline } from '../../../components/Sparkline';
import { ChangeTag } from '../../../components/ChangeTag';
import { formatCurrency } from '../../../utils/format';
import { useWatchlistStore } from '../../../store/watchlist';

interface InstrumentCardProps {
  instrument: Instrument;
  onPress: (instrument: Instrument) => void;
  showBorder: boolean;
}

function StarIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.7l-4.8 2.5.9-5.4L2.2 7.7l5.4-.8L10 2z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const InstrumentCard = memo(function InstrumentCard({ instrument, onPress, showBorder }: InstrumentCardProps) {
  const { colors } = useTheme();
  const toggle = useWatchlistStore((s) => s.toggle);
  const isWatched = useWatchlistStore((s) => s.tickers.includes(instrument.ticker));
  const returnPct = ((instrument.last_price - instrument.close_price) / instrument.close_price) * 100;
  const isPositive = returnPct >= 0;

  const handleStar = () => {
    toggle(instrument.ticker);
  };

  return (
    <Pressable
      onPress={() => onPress(instrument)}
      style={[
        styles.container,
        showBorder && { borderTopWidth: 1, borderTopColor: colors.border },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${instrument.ticker} ${instrument.name} price ${formatCurrency(instrument.last_price)} ${isPositive ? 'up' : 'down'} ${Math.abs(returnPct).toFixed(1)} percent`}
    >
      <Pressable onPress={handleStar} hitSlop={8} accessibilityRole="button" accessibilityLabel={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}>
        <StarIcon filled={isWatched} color={isWatched ? colors.warn : colors.textMuted} />
      </Pressable>

      <Avatar ticker={instrument.ticker} />

      <View style={styles.info}>
        <Text style={[styles.ticker, { color: colors.text }]}>{instrument.ticker}</Text>
        <Text style={[styles.name, { color: colors.textMuted }]} numberOfLines={1}>
          {instrument.name}
        </Text>
      </View>

      <Sparkline
        ticker={instrument.ticker}
        closePrice={instrument.close_price}
        lastPrice={instrument.last_price}
        positive={isPositive}
        width={62}
        height={30}
      />

      <View style={styles.priceCol}>
        <Text style={[styles.price, { color: colors.text }]}>{formatCurrency(instrument.last_price)}</Text>
        <ChangeTag pct={returnPct} size={12.5} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  info: { flex: 1, minWidth: 0 },
  ticker: { fontWeight: '600', fontSize: 15 },
  name: { fontSize: 12.5, marginTop: 1 },
  priceCol: { alignItems: 'flex-end', minWidth: 78 },
  price: { fontWeight: '600', fontSize: 14.5 },
});
