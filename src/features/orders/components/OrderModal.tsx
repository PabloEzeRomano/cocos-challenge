import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ScrollView, TextInput, Keyboard, Platform } from 'react-native';
import { Instrument, OrderSide, OrderType } from '../../../types/api';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';
import { OrderResult } from './OrderResult';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { usePortfolio } from '../../portfolio/hooks/usePortfolio';
import { aggregatePositions } from '../../portfolio/utils/aggregation';
import { buildOrderPayload } from '../utils/payloads';
import { formatCurrency } from '../../../utils/format';
import { Avatar } from '../../../components/Avatar';
import { SummaryRow } from '../../../components/SummaryRow';
import { useOrderHistoryStore } from '../../../store/orderHistory';

interface OrderModalProps {
  visible: boolean;
  instrument: Instrument | null;
  onClose: () => void;
}

export function OrderModal({ visible, instrument, onClose }: OrderModalProps) {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();
  const mutation = useCreateOrder();
  const addOrder = useOrderHistoryStore((s) => s.addOrder);
  const { data: portfolioData } = usePortfolio();
  const inputRef = useRef<TextInput>(null);

  const { cashBalance, availableShares } = useMemo(() => {
    if (!portfolioData) return { cashBalance: 0, availableShares: 0 };
    const positions = aggregatePositions(portfolioData);
    const cash = positions.find((p) => p.isCash);
    const position = positions.find((p) => p.instrumentId === instrument?.id);
    return {
      cashBalance: cash?.marketValue ?? 0,
      availableShares: position?.totalQuantity ?? 0,
    };
  }, [portfolioData, instrument?.id]);

  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [inputMode, setInputMode] = useState<'quantity' | 'amount'>('quantity');
  const [value, setValue] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  const resetForm = () => {
    setSide('BUY');
    setOrderType('MARKET');
    setInputMode('quantity');
    setValue('');
    setLimitPrice('');
    mutation.reset();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    resetForm();
    onClose();
  };

  // Auto-focus input when modal opens
  useEffect(() => {
    if (visible && !mutation.isSuccess) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [visible, mutation.isSuccess]);

  if (!instrument) return null;

  const price = instrument.last_price;
  const effPrice = orderType === 'LIMIT' ? (parseFloat(limitPrice) || price) : price;

  const raw = parseFloat(value || '0');
  const qty = inputMode === 'quantity' ? Math.floor(raw) : (effPrice > 0 ? Math.floor(raw / effPrice) : 0);
  const notional = qty * effPrice;
  const commission = Math.round(notional * 0.005);
  const total = side === 'BUY' ? notional + commission : notional - commission;

  const isValid = qty > 0;
  const insufficientFunds = side === 'BUY' && total > cashBalance;
  const insufficientShares = side === 'SELL' && qty > availableShares;
  const hasWarning = insufficientFunds || insufficientShares;
  const hint = !isValid
    ? t('order.enterAmount')
    : insufficientFunds
      ? `${t('order.insufficient')} · ${t('order.available')}: ${formatCurrency(cashBalance)}`
      : insufficientShares
        ? `${t('order.insufficientShares')} · ${t('order.available')}: ${availableShares} ${availableShares === 1 ? t('order.share') : t('order.shares')}`
        : '';

  const handleQuick = (val: number) => {
    setValue(String(val));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    Keyboard.dismiss();
    const payload = buildOrderPayload({
      instrumentId: instrument.id,
      side,
      type: orderType,
      quantity: qty,
      price: orderType === 'LIMIT' ? effPrice : undefined,
    });
    mutation.mutate(payload, {
      onSuccess: (response) => {
        addOrder({
          instrumentId: instrument.id,
          ticker: instrument.ticker,
          name: instrument.name,
          side,
          type: orderType,
          quantity: qty,
          price: effPrice,
          total,
          status: response.status,
          orderId: response.id,
        });
      },
    });
  };

  const handleValueChange = (text: string) => {
    // Only allow numeric input
    const cleaned = text.replace(/[^0-9]/g, '');
    const max = inputMode === 'amount' ? 9 : 6;
    setValue(cleaned.slice(0, max));
  };

  const shares = qty === 1 ? t('order.share') : t('order.shares');
  const subEquiv = inputMode === 'amount'
    ? `≈ ${qty} ${shares}`
    : `≈ ${formatCurrency(notional)}`;

  const sideColor = side === 'BUY' ? colors.positive : colors.negative;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={[styles.modalContainer]}>
        <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={handleClose} />

        <View style={[styles.sheet, { backgroundColor: colors.surfaceModal, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, borderTopWidth: 1, borderTopColor: colors.border }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

          {mutation.isSuccess ? (
            <OrderResult
              response={mutation.data}
              side={side}
              ticker={instrument.ticker}
              qty={qty}
              orderType={orderType}
              total={notional}
              onClose={handleClose}
            />
          ) : (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Avatar ticker={instrument.ticker} />
                <View style={styles.headerInfo}>
                  <Text style={[styles.headerTicker, { color: colors.text }]}>{instrument.ticker}</Text>
                  <Text style={[styles.headerDetail, { color: colors.textMuted }]}>
                    {instrument.name} · {formatCurrency(price)}
                  </Text>
                </View>
                <Pressable onPress={handleClose} style={[styles.closeBtn, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                  <Text style={{ color: colors.textSecondary, fontSize: 16 }}>{'✕'}</Text>
                </Pressable>
              </View>

              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">
                {/* Buy/Sell toggle */}
                <View style={[styles.segmented, { backgroundColor: colors.surface2, borderRadius: 14 }]} accessibilityRole="tablist">
                  {(['BUY', 'SELL'] as OrderSide[]).map((s) => (
                    <Pressable key={s} onPress={() => setSide(s)}
                      style={[styles.segBtn, { borderRadius: 11, backgroundColor: side === s ? (s === 'BUY' ? colors.positive : colors.negative) : 'transparent' }]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: side === s }}
                      accessibilityLabel={s === 'BUY' ? t('order.buy') : t('order.sell')}>
                      <Text style={[styles.segText, { color: side === s ? (s === 'BUY' ? colors.buyText : colors.sellText) : colors.textSecondary }]}>
                        {s === 'BUY' ? t('order.buy') : t('order.sell')}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Order type toggle */}
                <View style={[styles.segmented, { backgroundColor: colors.surface2, borderRadius: 11, marginTop: 16 }]} accessibilityRole="tablist">
                  {(['MARKET', 'LIMIT'] as OrderType[]).map((ot) => (
                    <Pressable key={ot} onPress={() => setOrderType(ot)}
                      style={[styles.segBtn, { borderRadius: 8, backgroundColor: orderType === ot ? colors.bgElevated : 'transparent' }]}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: orderType === ot }}
                      accessibilityLabel={ot === 'MARKET' ? t('order.market') : t('order.limit')}>
                      <Text style={[styles.segTextSm, { color: orderType === ot ? colors.text : colors.textMuted }]}>
                        {ot === 'MARKET' ? t('order.market') : t('order.limit')}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* Amount input section */}
                <View style={styles.amountSection}>
                  {/* Mode toggle pill */}
                  <View style={[styles.modePill, { backgroundColor: colors.surface2 }]}>
                    {(['quantity', 'amount'] as const).map((m) => (
                      <Pressable key={m} onPress={() => { setInputMode(m); setValue(''); }}
                        style={[styles.modeBtn, { backgroundColor: inputMode === m ? colors.accent : 'transparent' }]}>
                        <Text style={[styles.modeBtnText, { color: inputMode === m ? colors.accentText : colors.textSecondary }]}>
                          {m === 'quantity' ? t('order.quantity') : t('order.amountArs')}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Native TextInput styled as big value */}
                  <Pressable onPress={() => inputRef.current?.focus()} style={styles.inputTouchable}>
                    {inputMode === 'amount' && (
                      <Text style={[styles.bigPrefix, { color: value ? colors.text : colors.textMuted }]}>$</Text>
                    )}
                    <TextInput
                      ref={inputRef}
                      style={[styles.bigInput, { color: value ? colors.text : colors.textMuted }]}
                      value={value}
                      onChangeText={handleValueChange}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      maxLength={inputMode === 'amount' ? 9 : 6}
                      caretHidden={false}
                      selectionColor={colors.accent}
                    />
                  </Pressable>

                  <Text style={[styles.subEquiv, { color: colors.textMuted }]}>
                    {inputMode === 'quantity' && qty > 0 ? `${shares} · ` : ''}{subEquiv}
                  </Text>
                </View>

                {/* Quick chips */}
                <View style={styles.quickRow}>
                  {(inputMode === 'amount' ? [1000, 5000, 10000] : [5, 10, 25]).map((n) => (
                    <Pressable key={n} onPress={() => handleQuick(n)}
                      style={[styles.quickChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <Text style={[styles.quickText, { color: colors.textSecondary }]}>
                        {inputMode === 'amount' ? `$${(n / 1000)}k` : n}
                      </Text>
                    </Pressable>
                  ))}
                  <Pressable onPress={() => handleQuick(inputMode === 'quantity' ? 999 : 999999)}
                    style={[styles.quickChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.quickText, { color: colors.textSecondary }]}>{t('order.max')}</Text>
                  </Pressable>
                </View>

                {/* Limit price input */}
                {orderType === 'LIMIT' && (
                  <View style={[styles.limitRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                    <Text style={[styles.limitLabel, { color: colors.textSecondary }]}>{t('order.limitPrice')}</Text>
                    <TextInput
                      style={[styles.limitInput, { color: colors.text }]}
                      value={limitPrice}
                      onChangeText={(text) => setLimitPrice(text.replace(/[^0-9.]/g, ''))}
                      keyboardType="decimal-pad"
                      placeholder={String(price)}
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}

                {/* Summary card */}
                <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card }]}>
                  <SummaryRow
                    label={orderType === 'LIMIT' ? t('order.limitPrice') : t('order.marketPrice')}
                    value={formatCurrency(effPrice)}
                  />
                  <SummaryRow
                    label={t('order.quantity')}
                    value={`${qty} ${shares}`}
                  />
                  <SummaryRow
                    label={t('order.estCommission')}
                    value={formatCurrency(commission)}
                  />
                  <SummaryRow
                    label={
                      <Text style={[styles.summaryLabelBold, { color: colors.text }]}>
                        {side === 'BUY' ? t('order.totalCost') : t('order.youReceive')}
                      </Text>
                    }
                    value={
                      <Text style={[styles.totalValueText, { color: colors.text }]}>
                        {formatCurrency(total)}
                      </Text>
                    }
                    last
                  />
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.bg }]}>
                <View style={[styles.hintRow, { minHeight: 16 }]}>
                  <Text style={[styles.hintText, { color: hasWarning ? colors.negative : colors.textMuted }]}>{hint}</Text>
                </View>

                <Pressable
                  onPress={handleSubmit}
                  disabled={!isValid || mutation.isPending}
                  style={[styles.submitBtn, {
                    backgroundColor: sideColor,
                    borderRadius: radius.button,
                    opacity: (!isValid || mutation.isPending) ? 0.45 : 1,
                  }]}
                  accessibilityRole="button"
                  accessibilityLabel={`${side === 'BUY' ? t('order.buy') : t('order.sell')} ${qty} ${shares} of ${instrument.ticker} for ${formatCurrency(total)}`}
                  accessibilityState={{ disabled: !isValid || mutation.isPending }}
                >
                  <Text style={[styles.submitText, { color: side === 'BUY' ? colors.buyText : colors.sellText }]}>
                    {mutation.isPending ? t('order.sending') : `${side === 'BUY' ? t('order.buy') : t('order.sell')} ${instrument.ticker}`}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: { height: '93%', overflow: 'hidden' },
  handle: { width: 40, height: 5, borderRadius: 99, alignSelf: 'center', marginTop: 10, marginBottom: 6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 22, paddingTop: 4, paddingBottom: 14 },
  headerInfo: { flex: 1, minWidth: 0 },
  headerTicker: { fontWeight: '700', fontSize: 16 },
  headerDetail: { fontSize: 12.5 },
  closeBtn: { width: 34, height: 34, borderRadius: 99, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { flex: 1, paddingHorizontal: 22 },
  segmented: { flexDirection: 'row', padding: 4 },
  segBtn: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  segText: { fontWeight: '700', fontSize: 15 },
  segTextSm: { fontWeight: '600', fontSize: 13.5 },
  amountSection: { alignItems: 'center', paddingVertical: 22 },
  modePill: { flexDirection: 'row', borderRadius: 999, padding: 3, marginBottom: 16 },
  modeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  modeBtnText: { fontSize: 12.5, fontWeight: '600' },
  inputTouchable: { alignItems: 'center', justifyContent: 'center' },
  bigPrefix: { position: 'absolute', left: -30, fontSize: 46, fontWeight: '700', letterSpacing: -1.38 },
  bigInput: { fontSize: 46, fontWeight: '700', letterSpacing: -1.38, minWidth: 40, textAlign: 'center', padding: 0 },
  subEquiv: { fontSize: 13.5, marginTop: 8 },
  quickRow: { flexDirection: 'row', gap: 8 },
  quickChip: { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  quickText: { fontSize: 13, fontWeight: '600' },
  limitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 12, padding: 14, marginTop: 16 },
  limitLabel: { fontSize: 14 },
  limitInput: { fontSize: 16, fontWeight: '600', textAlign: 'right', minWidth: 80, padding: 0 },
  summaryCard: { borderWidth: 1, marginTop: 16, marginBottom: 14, paddingHorizontal: 16, paddingVertical: 4 },
  summaryLabelBold: { fontSize: 13.5, fontWeight: '600' },
  totalValueText: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  footer: { borderTopWidth: 1, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 6 },
  hintRow: { alignItems: 'center', marginBottom: 8 },
  hintText: { fontSize: 12.5, fontWeight: '500' },
  submitBtn: { paddingVertical: 15, alignItems: 'center' },
  submitText: { fontWeight: '600', fontSize: 16 },
});
