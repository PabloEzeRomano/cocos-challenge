import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from '../../../i18n/useTranslation';
import { useTheme } from '../../../theme/useTheme';
import { OrderSide, OrderType } from '../../../types/api';
import { formatCurrency } from '../../../utils/format';
import { calculateQuantityFromAmount } from '../utils/validation';

interface OrderFormProps {
  side: OrderSide;
  orderType: OrderType;
  inputMode: 'quantity' | 'amount';
  quantity: string;
  amount: string;
  price: string;
  lastPrice: number;
  error: string | null;
  isSubmitting: boolean;
  onSideChange: (side: OrderSide) => void;
  onOrderTypeChange: (type: OrderType) => void;
  onInputModeChange: (mode: 'quantity' | 'amount') => void;
  onQuantityChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSubmit: () => void;
}

export function OrderForm({
  side,
  orderType,
  inputMode,
  quantity,
  amount,
  price,
  lastPrice,
  error,
  isSubmitting,
  onSideChange,
  onOrderTypeChange,
  onInputModeChange,
  onQuantityChange,
  onAmountChange,
  onPriceChange,
  onSubmit,
}: OrderFormProps) {
  const { colors, spacing, typography, radius } = useTheme();
  const { t } = useTranslation();

  const computedQuantity =
    inputMode === 'amount'
      ? calculateQuantityFromAmount(Number(amount) || 0, lastPrice)
      : Number(quantity) || 0;

  const estimatedTotal =
    inputMode === 'quantity'
      ? (Number(quantity) || 0) * (orderType === 'LIMIT' ? Number(price) || lastPrice : lastPrice)
      : computedQuantity * (orderType === 'LIMIT' ? Number(price) || lastPrice : lastPrice);

  return (
    <View>
      {/* Side toggle */}
      <View
        style={[
          styles.toggleRow,
          {
            backgroundColor: colors.surface2,
            borderRadius: radius.input,
            padding: spacing.xs,
            marginBottom: spacing.md,
          },
        ]}
      >
        <ToggleButton
          label={t('order.buy')}
          active={side === 'BUY'}
          onPress={() => onSideChange('BUY')}
          activeColor={colors.positive}
        />
        <ToggleButton
          label={t('order.sell')}
          active={side === 'SELL'}
          onPress={() => onSideChange('SELL')}
          activeColor={colors.negative}
        />
      </View>

      {/* Type toggle */}
      <View
        style={[
          styles.toggleRow,
          {
            backgroundColor: colors.surface2,
            borderRadius: radius.input,
            padding: spacing.xs,
            marginBottom: spacing.md,
          },
        ]}
      >
        <ToggleButton
          label={t('order.market')}
          active={orderType === 'MARKET'}
          onPress={() => onOrderTypeChange('MARKET')}
          activeColor={colors.accent}
        />
        <ToggleButton
          label={t('order.limit')}
          active={orderType === 'LIMIT'}
          onPress={() => onOrderTypeChange('LIMIT')}
          activeColor={colors.accent}
        />
      </View>

      {/* Input mode toggle */}
      <View
        style={[
          styles.toggleRow,
          {
            backgroundColor: colors.surface2,
            borderRadius: radius.input,
            padding: spacing.xs,
            marginBottom: spacing.md,
          },
        ]}
      >
        <ToggleButton
          label={t('order.quantity')}
          active={inputMode === 'quantity'}
          onPress={() => onInputModeChange('quantity')}
          activeColor={colors.accent}
        />
        <ToggleButton
          label={t('order.amountArs')}
          active={inputMode === 'amount'}
          onPress={() => onInputModeChange('amount')}
          activeColor={colors.accent}
        />
      </View>

      {/* Quantity or Amount input */}
      {inputMode === 'quantity' ? (
        <View style={{ marginBottom: spacing.md }}>
          <Text
            style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}
          >
            {t('order.quantity')}
          </Text>
          <TextInput
            value={quantity}
            onChangeText={onQuantityChange}
            keyboardType="number-pad"
            style={[
              styles.input,
              {
                backgroundColor: colors.field,
                borderColor: colors.border,
                borderRadius: radius.input,
                color: colors.text,
                ...typography.body,
                padding: spacing.lg,
              },
            ]}
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel={t('order.quantity')}
          />
        </View>
      ) : (
        <View style={{ marginBottom: spacing.md }}>
          <Text
            style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}
          >
            {t('order.amount')}
          </Text>
          <TextInput
            value={amount}
            onChangeText={onAmountChange}
            keyboardType="decimal-pad"
            style={[
              styles.input,
              {
                backgroundColor: colors.field,
                borderColor: colors.border,
                borderRadius: radius.input,
                color: colors.text,
                ...typography.body,
                padding: spacing.lg,
              },
            ]}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel={t('order.amount')}
          />
          {computedQuantity > 0 && (
            <Text
              style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.xs }]}
            >
              ≈ {computedQuantity} {t('order.shares')}
            </Text>
          )}
        </View>
      )}

      {/* Price input for LIMIT orders */}
      {orderType === 'LIMIT' && (
        <View style={{ marginBottom: spacing.md }}>
          <Text
            style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}
          >
            {t('order.price')}
          </Text>
          <TextInput
            value={price}
            onChangeText={onPriceChange}
            keyboardType="decimal-pad"
            style={[
              styles.input,
              {
                backgroundColor: colors.field,
                borderColor: colors.border,
                borderRadius: radius.input,
                color: colors.text,
                ...typography.body,
                padding: spacing.lg,
              },
            ]}
            placeholder={lastPrice.toString()}
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel={t('order.price')}
          />
        </View>
      )}

      {/* Order summary */}
      {computedQuantity > 0 && (
        <View
          style={[
            styles.summary,
            {
              backgroundColor: colors.surface2,
              borderRadius: radius.input,
              padding: spacing.md,
              marginBottom: spacing.md,
            },
          ]}
        >
          <SummaryRow
            label={side === 'BUY' ? t('order.buy') : t('order.sell')}
            value={side === 'BUY' ? t('order.buy') : t('order.sell')}
          />
          <SummaryRow
            label={t('order.market')}
            value={orderType === 'MARKET' ? t('order.market') : t('order.limit')}
          />
          <SummaryRow
            label={t('order.quantity')}
            value={`${computedQuantity} ${t('order.shares')}`}
          />
          {orderType === 'LIMIT' && price && (
            <SummaryRow label={t('order.limitPrice')} value={formatCurrency(Number(price))} />
          )}
          <SummaryRow label={t('order.totalCost')} value={formatCurrency(estimatedTotal)} bold />
        </View>
      )}

      {/* Error message */}
      {error && (
        <Text
          style={[
            typography.caption,
            {
              color: colors.negative,
              marginBottom: spacing.md,
              textAlign: 'center',
            },
          ]}
        >
          {t(error)}
        </Text>
      )}

      {/* Submit button */}
      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={[
          styles.submitButton,
          {
            backgroundColor: side === 'BUY' ? colors.positive : colors.negative,
            borderRadius: radius.button,
            paddingVertical: spacing.md,
            opacity: isSubmitting ? 0.7 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={t('order.submit')}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text
            style={[typography.body, { color: '#FFFFFF', fontWeight: '600', textAlign: 'center' }]}
          >
            {t('order.submit')}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

function ToggleButton({
  label,
  active,
  onPress,
  activeColor,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor: string;
}) {
  const { colors, spacing, typography, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.toggleButton,
        {
          backgroundColor: active ? activeColor : 'transparent',
          borderRadius: radius.badge,
          paddingVertical: spacing.sm,
        },
      ]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
    >
      <Text
        style={[
          typography.sm,
          {
            color: active ? '#FFFFFF' : colors.textSecondary,
            fontWeight: active ? '600' : '400',
            textAlign: 'center',
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.summaryRow, { marginBottom: spacing.xs }]}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[typography.sm, { color: colors.text, fontWeight: bold ? '600' : '400' }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row' },
  toggleButton: { flex: 1 },
  input: { borderWidth: 1 },
  summary: {},
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {},
});
