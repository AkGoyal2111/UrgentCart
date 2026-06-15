import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';
import { Order } from '@/types';

interface CartStore {
  // Confirmed items (user's actual cart)
  items: CartItem[];
  situationLabel: string;
  total: number;
  deliveryEstimate: number;
  isLoading: boolean;

  // Pending items (suggested, not yet confirmed)
  pendingItems: CartItem[];
  pendingLabel: string;
  isPending: boolean;

  // Actions
  setCartFromAI: (items: CartItem[], label: string) => void;
  setPendingCart: (items: CartItem[], label: string) => void;
  confirmPending: () => void;
  discardPending: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  loadFromOrder: (order: Order) => void;
  setLoading: (loading: boolean) => void;
}

function computeTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function computeDeliveryEstimate(items: CartItem[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map((item) => item.deliveryMinutes));
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      situationLabel: '',
      total: 0,
      deliveryEstimate: 0,
      isLoading: false,

      pendingItems: [],
      pendingLabel: '',
      isPending: false,

      setCartFromAI: (items, label) =>
        set({
          items,
          situationLabel: label,
          total: computeTotal(items),
          deliveryEstimate: computeDeliveryEstimate(items),
          isPending: false,
          pendingItems: [],
          pendingLabel: '',
        }),

      setPendingCart: (items, label) =>
        set({
          pendingItems: items,
          pendingLabel: label,
          isPending: true,
        }),

      confirmPending: () =>
        set((state) => {
          // Merge pending items into confirmed cart
          const merged = [...state.items];
          for (const pendingItem of state.pendingItems) {
            const existing = merged.find((i) => i.id === pendingItem.id);
            if (existing) {
              existing.quantity += pendingItem.quantity;
            } else {
              merged.push(pendingItem);
            }
          }
          const label = state.situationLabel
            ? `${state.situationLabel} + ${state.pendingLabel}`
            : state.pendingLabel;
          return {
            items: merged,
            situationLabel: label,
            total: computeTotal(merged),
            deliveryEstimate: computeDeliveryEstimate(merged),
            isPending: false,
            pendingItems: [],
            pendingLabel: '',
          };
        }),

      discardPending: () =>
        set({
          isPending: false,
          pendingItems: [],
          pendingLabel: '',
        }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          let newItems: CartItem[];
          if (existing) {
            newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            );
          } else {
            newItems = [...state.items, item];
          }
          return {
            items: newItems,
            total: computeTotal(newItems),
            deliveryEstimate: computeDeliveryEstimate(newItems),
          };
        }),

      removeItem: (itemId) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          return {
            items: newItems,
            total: computeTotal(newItems),
            deliveryEstimate: computeDeliveryEstimate(newItems),
          };
        }),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          let newItems: CartItem[];
          if (quantity <= 0) {
            newItems = state.items.filter((i) => i.id !== itemId);
          } else {
            newItems = state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            );
          }
          return {
            items: newItems,
            total: computeTotal(newItems),
            deliveryEstimate: computeDeliveryEstimate(newItems),
          };
        }),

      clearCart: () =>
        set({
          items: [],
          situationLabel: '',
          total: 0,
          deliveryEstimate: 0,
          isLoading: false,
          isPending: false,
          pendingItems: [],
          pendingLabel: '',
        }),

      loadFromOrder: (order) =>
        set({
          items: order.items,
          situationLabel: order.situationLabel,
          total: computeTotal(order.items),
          deliveryEstimate: computeDeliveryEstimate(order.items),
          isPending: false,
          pendingItems: [],
          pendingLabel: '',
        }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'urgentcart-cart',
      partialize: (state) => ({
        items: state.items,
        situationLabel: state.situationLabel,
        total: state.total,
        deliveryEstimate: state.deliveryEstimate,
      }),
    }
  )
);
