import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/types';

interface OrderStore {
  pastOrders: Order[];
  reorderCounts: Record<string, number>; // orderId -> reorder count
  addOrder: (order: Order) => void;
  getOrders: () => Order[];
  getOrderById: (id: string) => Order | undefined;
  incrementReorder: (orderId: string) => void;
  getReorderCount: (orderId: string) => number;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      pastOrders: [],
      reorderCounts: {},

      addOrder: (order) =>
        set((state) => ({
          pastOrders: [order, ...state.pastOrders],
        })),

      getOrders: () => {
        const { pastOrders } = get();
        return [...pastOrders].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },

      getOrderById: (id) => {
        const { pastOrders } = get();
        return pastOrders.find((order) => order.id === id);
      },

      incrementReorder: (orderId) =>
        set((state) => ({
          reorderCounts: {
            ...state.reorderCounts,
            [orderId]: (state.reorderCounts[orderId] || 0) + 1,
          },
        })),

      getReorderCount: (orderId) => {
        const { reorderCounts } = get();
        return reorderCounts[orderId] || 0;
      },
    }),
    {
      name: 'urgentcart-orders',
    }
  )
);
