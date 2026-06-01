import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const canUseNativeDriver = Platform.OS !== 'web';

export function Skeleton({ width, height, borderRadius = 5, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: canUseNativeDriver }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: canUseNativeDriver }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width: width as number, height, backgroundColor: colors.surface2, borderRadius, opacity },
        style,
      ]}
    />
  );
}
