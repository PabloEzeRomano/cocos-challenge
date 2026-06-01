import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeStorage } from './storage';

interface WatchlistState {
  tickers: string[];
  toggle: (ticker: string) => void;
  isWatched: (ticker: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      tickers: [],
      toggle: (ticker: string) =>
        set((state) => ({
          tickers: state.tickers.includes(ticker)
            ? state.tickers.filter((t) => t !== ticker)
            : [...state.tickers, ticker],
        })),
      isWatched: (ticker: string) => get().tickers.includes(ticker),
    }),
    {
      name: 'cocos-watchlist',
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);
