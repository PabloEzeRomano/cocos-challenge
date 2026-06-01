import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useTheme } from '../theme/useTheme';

interface TabBarProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  tabs: { key: string; label: string }[];
}

function MarketIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 16l4-5 3 3 5-7 4 5"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WalletIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={6} width={17} height={13} rx={3} stroke={color} strokeWidth={1.8} />
      <Path d="M3.5 10h17" stroke={color} strokeWidth={1.8} />
      <Circle cx={16.5} cy={14.5} r={1.2} fill={color} />
    </Svg>
  );
}

function OrdersIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Rect x={9} y={3} width={6} height={4} rx={1.5} stroke={color} strokeWidth={1.8} />
      <Path d="M9 12h6M9 16h4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

const ICONS: Record<string, typeof MarketIcon> = {
  instruments: MarketIcon,
  portfolio: WalletIcon,
  orders: OrdersIcon,
};

export function TabBar({ activeTab, onTabChange, tabs }: TabBarProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.bg,
          paddingBottom: spacing['4xl'],
          paddingTop: spacing.lg,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const color = isActive ? colors.text : colors.textMuted;
        const Icon = ICONS[tab.key] || MarketIcon;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Icon color={color} />
            <Text style={[styles.label, { color, fontWeight: isActive ? '700' : '500' }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: 24 },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 11 },
});
