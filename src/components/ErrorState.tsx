import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n/useTranslation';

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const { colors, spacing, typography, radius } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Text style={[typography.body, { color: colors.textSecondary, marginBottom: spacing.md }]}>
        {t('common.error')}
      </Text>
      <Pressable
        onPress={onRetry}
        style={[styles.button, { backgroundColor: colors.accent, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }]}
      >
        <Text style={[typography.body, { color: '#FFFFFF', fontWeight: '600' }]}>
          {t('common.retry')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: {},
});
