import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTranslation } from '../../../i18n/useTranslation';
import { useTheme } from '../../../theme/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

function SearchIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 18 18" fill="none">
      <Circle cx={8} cy={8} r={5.5} stroke={color} strokeWidth={1.7} />
      <Path d="M12.5 12.5L16 16" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.wrapper, { paddingHorizontal: 22 }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.field,
            borderColor: colors.border,
            borderRadius: radius.input,
          },
        ]}
      >
        <SearchIcon color={colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel={t('search.placeholder')}
        />
        {value.length > 0 && (
          <Pressable
            onPress={onClear}
            style={styles.clearBtn}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
              <Path
                d="M4 4l10 10M14 4L4 14"
                stroke={colors.textMuted}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingVertical: 4 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 15, padding: 0 },
  clearBtn: { padding: 0 },
});
