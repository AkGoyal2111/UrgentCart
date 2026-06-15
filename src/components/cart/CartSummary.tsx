'use client';

import { useCartStore } from '@/stores/cartStore';

const DELIVERY_FEE = 30;

export function CartSummary() {
  const total = useCartStore((state) => state.total);
  const deliveryEstimate = useCartStore((state) => state.deliveryEstimate);
  const items = useCartStore((state) => state.items);

  if (items.length === 0) return null;

  const grandTotal = total + DELIVERY_FEE;

  return (
    <div className="space-y-3">
      {deliveryEstimate > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-[#007600] font-medium">
          <span>✓</span>
          <span>Delivery in {deliveryEstimate} minutes</span>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[#565959]">
          <span>Items ({items.length}):</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-[#565959]">
          <span>Delivery:</span>
          <span>₹{DELIVERY_FEE}</span>
        </div>
      </div>

      <div className="border-t border-[#d5d9d9] pt-3">
        <div className="flex justify-between">
          <span className="text-lg font-bold text-[#0f1111]">Order Total:</span>
          <span className="text-lg font-bold text-[#0f1111]">₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
