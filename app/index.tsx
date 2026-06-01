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
import { OrderHistoryList } from '../src/features/orders/components/OrderHistoryList';
import { OrderModal } from '../src/features/orders/components/OrderModal';
import { TabBar } from '../src/components/TabBar';
import { SettingsHeader } from '../src/components/SettingsHeader';

type TabKey = 'instruments' | 'portfolio' | 'orders';

export default function HomeScreen() {
  const { colors } = useTheme();
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

  const handlePositionPress = useCallback((instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setOrderModalVisible(true);
  }, []);

  const tabs = [
    { key: 'instruments', label: t('tabs.instruments') },
    { key: 'portfolio', label: t('tabs.portfolio') },
    { key: 'orders', label: t('tabs.orders') },
  ];

  const isSearching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <SettingsHeader />

      {activeTab === 'instruments' && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
        />
      )}

      <View style={styles.content}>
        {isSearching && activeTab === 'instruments' ? (
          <SearchResults query={searchQuery} onInstrumentPress={handleInstrumentPress} />
        ) : activeTab === 'instruments' ? (
          <InstrumentList onInstrumentPress={handleInstrumentPress} />
        ) : activeTab === 'portfolio' ? (
          <PortfolioList onPositionPress={handlePositionPress} />
        ) : (
          <OrderHistoryList />
        )}
      </View>

      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as TabKey)}
      />

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
