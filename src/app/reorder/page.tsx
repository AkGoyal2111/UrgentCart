'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PackageOpen, Star } from 'lucide-react';
import { useOrderStore } from '@/stores/orderStore';
import { useCartStore } from '@/stores/cartStore';
import { seedDemoOrders } from '@/lib/seedOrders';
import { PastOrderCard } from '@/components/reorder/PastOrderCard';
import { Button } from '@/components/ui/button';
import { Order, CartItem } from '@/types';

export default function ReorderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [seeded, setSeeded] = useState(false);

  const pastOrders = useOrderStore((state) => state.pastOrders);
  const getOrders = useOrderStore((state) => state.getOrders);
  const addItem = useCartStore((state) => state.addItem);

  // Seed demo orders on first load if store is empty
  useEffect(() => {
    if (!seeded) {
      seedDemoOrders();
      setSeeded(true);
    }
  }, [seeded]);

  // Update local orders whenever pastOrders changes
  useEffect(() => {
    setOrders(getOrders());
  }, [pastOrders, getOrders]);

  // Compute frequently ordered items
  const frequentItems = useMemo(() => {
    if (pastOrders.length === 0) return [];

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
      .slice(0, 8)
      .map((entry) => entry.item);
  }, [pastOrders]);

  // Empty state (even after seeding attempt)
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <PackageOpen className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          No past orders yet
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-[250px]">
          Start shopping to see your orders here
        </p>
        <Button
          asChild
          className="bg-amazon-orange hover:bg-amazon-orange/90 text-white font-semibold rounded-xl px-6"
        >
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">
          📦 Your Past Orders
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          One tap to reorder your favorites
        </p>
      </div>

      {/* Frequently ordered items */}
      {frequentItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-amazon-orange" />
            <h2 className="text-sm font-semibold text-gray-900">Frequently Ordered</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {frequentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addItem({ ...item, quantity: 1, reason: 'Frequently ordered' })}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-amazon-orange/30 hover:shadow-md active:scale-95 transition-all w-[100px]"
              >
                <span className="text-xs font-medium text-gray-900 text-center line-clamp-2 leading-tight">
                  {item.name}
                </span>
                <span className="text-[11px] text-gray-500">₹{item.price}</span>
                <span className="text-[10px] text-amazon-orange font-medium">+ Add</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Order cards */}
      <div className="space-y-3">
        {orders.map((order) => (
          <PastOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
