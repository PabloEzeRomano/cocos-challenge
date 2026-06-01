import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Instrument } from '../../../types/api';
import { useTheme } from '../../../theme/useTheme';
import { Sparkline } from '../../../components/Sparkline';
import { formatCurrency, formatPercentage } from '../../../utils/format';

interface InstrumentCardProps {
  instrument: Instrument;
  onPress: (instrument: Instrument) => void;
}

export const InstrumentCard = memo(function InstrumentCard({ instrument, onPress }: InstrumentCardProps) {
  const { colors, spacing, typography, radius, shadows } = useTheme();
  const returnPct = ((instrument.last_price - instrument.close_price) / instrument.close_price) * 100;
  const isPositive = returnPct >= 0;

  return (
    <Pressable
      onPress={() => onPress(instrument)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.sm,
          ...shadows.card,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${instrument.ticker} ${instrument.name} precio ${instrument.last_price} retorno ${returnPct.toFixed(2)} por ciento`}
    >
      <View style={styles.leftSection}>
        <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>
          {instrument.ticker}
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>
          {instrument.name}
        </Text>
      </View>

      <View style={styles.chartSection}>
        <Sparkline
          ticker={instrument.ticker}
          closePrice={instrument.close_price}
          lastPrice={instrument.last_price}
          positive={isPositive}
        />
      </View>

      <View style={styles.rightSection}>
        <Text style={[typography.body, { color: colors.text, fontWeight: '500', textAlign: 'right' }]}>
          {formatCurrency(instrument.last_price)}
        </Text>
        <Text
          style={[
            typography.caption,
            { color: isPositive ? colors.positive : colors.negative, textAlign: 'right', fontWeight: '500' },
          ]}
        >
          {formatPercentage(returnPct)}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  leftSection: { flex: 1 },
  chartSection: { marginHorizontal: 12 },
  rightSection: { alignItems: 'flex-end', minWidth: 90 },
});
