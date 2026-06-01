import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Instrument } from '../src/types/api';
import { useTheme } from '../src/theme/useTheme';
import { useTranslation } from '../src/i18n/useTranslation';
import { SearchBar } from '../src/features/search/components/SearchBar';
import { SearchResults } from '../src/features/search/components/SearchResults';
import { InstrumentList } from '../src/features/instruments/components/InstrumentList';
import { PortfolioList } from '../src/features/portfolio/components/PortfolioList';
import { OrderModal } from '../src/features/orders/components/OrderModal';
import { TabBar } from '../src/components/TabBar';
import { SettingsHeader } from '../src/components/SettingsHeader';

type TabKey = 'instruments' | 'portfolio';

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>('instruments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  const handleInstrumentPress = useCallback((instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setOrderModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOrderModalVisible(false);
    setSelectedInstrument(null);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const tabs = [
    { key: 'instruments', label: t('tabs.instruments') },
    { key: 'portfolio', label: t('tabs.portfolio') },
  ];

  const isSearching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <SettingsHeader />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
      />

      {!isSearching && (
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.sm }}>
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(key) => setActiveTab(key as TabKey)}
          />
        </View>
      )}

      <View style={styles.content}>
        {isSearching ? (
          <SearchResults query={searchQuery} onInstrumentPress={handleInstrumentPress} />
        ) : activeTab === 'instruments' ? (
          <InstrumentList onInstrumentPress={handleInstrumentPress} />
        ) : (
          <PortfolioList onPositionPress={handleInstrumentPress} />
        )}
      </View>

      <OrderModal
        visible={orderModalVisible}
        instrument={selectedInstrument}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
