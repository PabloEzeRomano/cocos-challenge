import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'system' | 'light' | 'dark';
export type Locale = 'es' | 'en';

interface PreferencesState {
  theme: ThemePreference;
  locale: Locale;
  setTheme: (theme: ThemePreference) => void;
  setLocale: (locale: Locale) => void;
}

// Resilient storage wrapper — falls back to no-op if AsyncStorage native module missing
const safeStorage: StateStorage = {
  getItem: async (name: string) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // Silently fail — preferences won't persist but app still works
    }
  },
  removeItem: async (name: string) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // no-op
    }
  },
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      locale: 'es',
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'cocos-preferences',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
