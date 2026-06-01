import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from './storage';
import { OrderSide, OrderType, OrderStatus } from '../types/api';

export interface OrderHistoryEntry {
  id: string;
  instrumentId: number;
  ticker: string;
  name: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
  orderId: number;
  timestamp: number;
}

interface OrderHistoryState {
  orders: OrderHistoryEntry[];
  addOrder: (order: Omit<OrderHistoryEntry, 'id' | 'timestamp'>) => void;
  clearOrders: () => void;
}

export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              timestamp: Date.now(),
            },
            ...state.orders,
          ],
        })),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'cocos-order-history',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
