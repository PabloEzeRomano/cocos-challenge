import React, { memo } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../../theme/useTheme';

interface KeypadProps {
  onPress: (key: string) => void;
}

function BackIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path d="M13 5l-6 6 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'del'] as const;

export const Keypad = memo(function Keypad({ onPress }: KeypadProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {KEYS.map((k) => (
        <Pressable
          key={k}
          onPress={() => onPress(k)}
          style={({ pressed }) => [
            styles.key,
            pressed && { backgroundColor: colors.surface2 },
          ]}
        >
          {k === 'del' ? (
            <BackIcon color={colors.text} />
          ) : (
            <Text style={[styles.keyText, { color: colors.text }]}>{k}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 16,
  },
  key: {
    width: '33.333%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
  },
  keyText: {
    fontSize: 23,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});
