import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { Instrument, OrderSide, OrderType } from '../../../types/api';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';
import { OrderForm } from './OrderForm';
import { OrderResult } from './OrderResult';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { buildOrderPayload } from '../utils/payloads';
import { validateOrderForm, calculateQuantityFromAmount } from '../utils/validation';
import { formatCurrency } from '../../../utils/format';

interface OrderModalProps {
  visible: boolean;
  instrument: Instrument | null;
  onClose: () => void;
}

export function OrderModal({ visible, instrument, onClose }: OrderModalProps) {
  const { colors, spacing, typography, radius, shadows } = useTheme();
  const { t } = useTranslation();
  const mutation = useCreateOrder();

  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [inputMode, setInputMode] = useState<'quantity' | 'amount'>('quantity');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setSide('BUY');
    setOrderType('MARKET');
    setInputMode('quantity');
    setQuantity('');
    setAmount('');
    setPrice('');
    setError(null);
    mutation.reset();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!instrument) return;

    const validation = validateOrderForm({
      quantity,
      amount,
      price,
      inputMode,
      orderType,
      lastPrice: instrument.last_price,
    });

    if (!validation.isValid) {
      setError(validation.error ?? null);
      return;
    }

    setError(null);

    const finalQuantity = inputMode === 'quantity'
      ? Number(quantity)
      : calculateQuantityFromAmount(Number(amount), instrument.last_price);

    const payload = buildOrderPayload({
      instrumentId: instrument.id,
      side,
      type: orderType,
      quantity: finalQuantity,
      price: orderType === 'LIMIT' ? Number(price) : undefined,
    });

    mutation.mutate(payload);
  };

  if (!instrument) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={handleClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={[styles.sheet, { backgroundColor: colors.background, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, ...shadows.modal }]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.lg }} bounces={false}>
              {/* Header */}
              <View style={[styles.header, { marginBottom: spacing.lg }]}>
                <Text style={[typography.h2, { color: colors.text }]}>{instrument.ticker}</Text>
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>{instrument.name}</Text>
                <Text style={[typography.body, { color: colors.text, marginTop: spacing.xs }]}>
                  {formatCurrency(instrument.last_price)}
                </Text>
              </View>

              {mutation.isSuccess ? (
                <OrderResult
                  response={mutation.data}
                  onClose={handleClose}
                  onRetry={resetForm}
                />
              ) : (
                <OrderForm
                  side={side}
                  orderType={orderType}
                  inputMode={inputMode}
                  quantity={quantity}
                  amount={amount}
                  price={price}
                  lastPrice={instrument.last_price}
                  error={error}
                  isSubmitting={mutation.isPending}
                  onSideChange={setSide}
                  onOrderTypeChange={setOrderType}
                  onInputModeChange={setInputMode}
                  onQuantityChange={(v) => { setQuantity(v); setError(null); }}
                  onAmountChange={(v) => { setAmount(v); setError(null); }}
                  onPriceChange={(v) => { setPrice(v); setError(null); }}
                  onSubmit={handleSubmit}
                />
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  keyboardView: { justifyContent: 'flex-end' },
  sheet: { maxHeight: '80%' },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 8, marginBottom: 8 },
  header: { alignItems: 'center' },
});
