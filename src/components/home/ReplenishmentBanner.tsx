'use client';

import { useMemo } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useCartStore } from '@/stores/cartStore';
import { CartItem } from '@/types';

export function ReplenishmentBanner() {
  const pastOrders = useOrderStore((state) => state.pastOrders);
  const reorderCounts = useOrderStore((state) => state.reorderCounts);
  const incrementReorder = useOrderStore((state) => state.incrementReorder);
  const addItem = useCartStore((state) => state.addItem);

  const replenishmentItems = useMemo(() => {
    if (pastOrders.length < 3) return [];

    // Count item frequency across orders
    const itemFrequency: Record<string, { item: CartItem; count: number }> = {};

    for (const order of pastOrders) {
      for (const item of order.items) {
        if (itemFrequency[item.id]) {
          itemFrequency[item.id].count++;
        } else {
          itemFrequency[item.id] = { item, count: 1 };
        }
      }
    }

    // Items that appear in 2+ orders are candidates for replenishment
    return Object.values(itemFrequency)
      .filter((entry) => entry.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((entry) => entry.item);
  }, [pastOrders]);

  if (replenishmentItems.length === 0) return null;

  function handleReorder(item: CartItem) {
    addItem({ ...item, quantity: 1, reason: 'Replenishment suggestion' });
    // Use item.id as the key for per-item reorder count (persisted)
    incrementReorder(`item_${item.id}`);
  }

  return (
    <section className="w-full animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Reorder
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3">
          Based on your order history, you might need these again:
        </p>

        {/* Items */}
        <div className="space-y-2">
          {replenishmentItems.map((item) => {
            const count = reorderCounts[`item_${item.id}`] || 0;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">₹{item.price}</p>
                </div>
                <button
                  onClick={() => handleReorder(item)}
                  className="ml-3 flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-amazon-orange text-white hover:bg-amazon-orange/90 transition-colors"
                >
                  Reorder
                  {count > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[10px] font-bold">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
