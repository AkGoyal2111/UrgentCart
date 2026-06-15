'use client';

import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useCartStore } from '@/stores/cartStore';
import { CartItem } from '@/types';

export function ReplenishmentBanner() {
  const pastOrders = useOrderStore((state) => state.pastOrders);
  const addItem = useCartStore((state) => state.addItem);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const replenishmentItems = useMemo(() => {
    if (pastOrders.length < 3) return [];

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

    return Object.values(itemFrequency)
      .filter((entry) => entry.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((entry) => entry.item);
  }, [pastOrders]);

  if (replenishmentItems.length === 0) return null;

  function handleReorder(item: CartItem) {
    addItem({ ...item, quantity: 1, reason: 'Replenishment suggestion' });
    setCounts((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  }

  return (
    <section className="w-full bg-white rounded-lg shadow-sm border border-[#d5d9d9] p-4">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw className="h-4 w-4 text-[#007185]" />
        <h2 className="text-base font-bold text-[#0f1111]">Buy it again</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {replenishmentItems.map((item) => {
          const count = counts[item.id] || 0;
          return (
            <div
              key={item.id}
              className="flex-shrink-0 w-[140px] border border-[#d5d9d9] rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
            >
              <div className="w-full h-16 bg-[#f7f8f8] rounded flex items-center justify-center mb-2">
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-xs font-medium text-[#0f1111] line-clamp-2 leading-tight mb-1">
                {item.name}
              </p>
              <p className="text-sm font-bold text-[#0f1111] mb-2">₹{item.price}</p>
              <button
                onClick={() => handleReorder(item)}
                className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md btn-amazon-yellow transition-colors"
              >
                {count > 0 ? `Added (${count})` : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
