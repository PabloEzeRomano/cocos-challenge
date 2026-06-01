import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { OrderResponse } from '../../../types/api';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';

interface OrderResultProps {
  response: OrderResponse;
  onClose: () => void;
  onRetry: () => void;
}

export function OrderResult({ response, onClose, onRetry }: OrderResultProps) {
  const { colors, spacing, typography, radius } = useTheme();
  const { t } = useTranslation();

  const isRejected = response.status === 'REJECTED';
  const statusColor = isRejected ? colors.negative : colors.positive;
  const statusLabel = t(`order.${response.status.toLowerCase()}`);

  return (
    <View style={styles.container}>
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginBottom: spacing.lg }]}>
        <Text style={[typography.h2, { color: statusColor, textAlign: 'center' }]}>
          {statusLabel}
        </Text>
      </View>

      <View style={[styles.infoRow, { marginBottom: spacing.sm }]}>
        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>{t('order.orderId')}</Text>
        <Text style={[typography.mono, { color: colors.text }]}>#{response.id}</Text>
      </View>

      <View style={[styles.infoRow, { marginBottom: spacing.lg }]}>
        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>{t('order.status')}</Text>
        <Text style={[typography.bodySmall, { color: statusColor, fontWeight: '600' }]}>{statusLabel}</Text>
      </View>

      <View style={styles.actions}>
        {isRejected && (
          <Pressable
            onPress={onRetry}
            style={[styles.button, { borderColor: colors.accent, borderWidth: 1, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, marginRight: spacing.sm }]}
          >
            <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: '600' }]}>{t('order.tryAgain')}</Text>
          </Pressable>
        )}
        <Pressable
          onPress={onClose}
          style={[styles.button, { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, flex: 1 }]}
        >
          <Text style={[typography.bodySmall, { color: '#FFFFFF', fontWeight: '600', textAlign: 'center' }]}>{t('order.close')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  statusBadge: { alignSelf: 'stretch', alignItems: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' },
  actions: { flexDirection: 'row', alignSelf: 'stretch' },
  button: {},
});
