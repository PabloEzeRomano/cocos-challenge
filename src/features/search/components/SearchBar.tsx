import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/useTheme';
import { useTranslation } from '../../../i18n/useTranslation';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  const { colors, spacing, typography, radius } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
      <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.textSecondary}
          style={[typography.body, styles.input, { color: colors.text, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel={t('search.placeholder')}
        />
        {value.length > 0 && (
          <Pressable onPress={onClear} style={[styles.clearButton, { marginRight: spacing.sm }]} hitSlop={8}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>✕</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1 },
  clearButton: { padding: 4 },
});
