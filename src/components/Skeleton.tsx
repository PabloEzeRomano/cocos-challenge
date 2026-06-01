import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface SkeletonProps {
  width: number | string;
  height: number;
  style?: ViewStyle;
}

const canUseNativeDriver = Platform.OS !== 'web';

export function Skeleton({ width, height, style }: SkeletonProps) {
  const { colors, radius } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: canUseNativeDriver }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: canUseNativeDriver }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as number,
          height,
          backgroundColor: colors.skeleton,
          borderRadius: radius.sm,
          opacity,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {},
});
