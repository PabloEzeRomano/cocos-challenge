import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Instrument } from '../../../types/api';
import { useTheme } from '../../../theme/useTheme';
import { Avatar } from '../../../components/Avatar';
import { Sparkline } from '../../../components/Sparkline';
import { ChangeTag } from '../../../components/ChangeTag';
import { formatCurrency } from '../../../utils/format';

interface InstrumentCardProps {
  instrument: Instrument;
  onPress: (instrument: Instrument) => void;
  showBorder: boolean;
}

export const InstrumentCard = memo(function InstrumentCard({ instrument, onPress, showBorder }: InstrumentCardProps) {
  const { colors } = useTheme();
  const returnPct = ((instrument.last_price - instrument.close_price) / instrument.close_price) * 100;
  const isPositive = returnPct >= 0;

  return (
    <Pressable
      onPress={() => onPress(instrument)}
      style={[
        styles.container,
        showBorder && { borderTopWidth: 1, borderTopColor: colors.border },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${instrument.ticker} ${instrument.name} precio ${instrument.last_price}`}
    >
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
  container: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13 },
  info: { flex: 1, minWidth: 0 },
  ticker: { fontWeight: '600', fontSize: 15 },
  name: { fontSize: 12.5, marginTop: 1 },
  priceCol: { alignItems: 'flex-end', minWidth: 78 },
  price: { fontWeight: '600', fontSize: 14.5 },
});
