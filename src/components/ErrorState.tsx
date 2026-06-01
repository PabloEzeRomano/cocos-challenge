import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { useTranslation } from '../i18n/useTranslation';

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{t('common.error')}</Text>
      <Pressable
        onPress={onRetry}
        style={[styles.button, { backgroundColor: colors.accent, borderRadius: radius.button }]}
      >
        <Text style={[styles.buttonText, { color: colors.accentText }]}>{t('common.retry')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  message: { fontSize: 16, marginBottom: 16 },
  button: { paddingHorizontal: 24, paddingVertical: 12 },
  buttonText: { fontWeight: '600', fontSize: 15 },
});
