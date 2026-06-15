'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Clock, CheckCircle } from 'lucide-react';
import { CartItem } from '@/types';
import { useCartStore } from '@/stores/cartStore';

interface CartPreviewProps {
  items: CartItem[];
  cartName?: string;
  reasoning?: string;
  categories?: string[];
  estimatedCost?: number;
  estimatedDelivery?: number;
}

export function CartPreview({
  items,
  cartName,
  reasoning,
  categories,
  estimatedCost,
  estimatedDelivery,
}: CartPreviewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const total = estimatedCost ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const displayItems = items.slice(0, 5);
  const remainingCount = items.length - displayItems.length;

  function handleAddToCart() {
    for (const item of items) {
      addItem(item);
    }
    setAdded(true);
  }

  return (
    <div className="bg-white border border-[#d5d9d9] rounded-lg shadow-sm p-3 max-w-[320px]">
      {/* Cart Name */}
      {cartName && (
        <h3 className="text-sm font-bold text-[#0f1111] mb-1">{cartName}</h3>
      )}

      {/* Reasoning */}
      {reasoning && (
        <p className="text-[11px] text-[#565959] mb-2">{reasoning}</p>
      )}

      {/* Category Pills */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#fff3cd] text-[#856404] border border-[#ffc107]/30"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-1.5 mb-2">
        <ShoppingCart className="h-3.5 w-3.5 text-[#ff9900]" />
        <span className="text-xs font-semibold text-[#0f1111]">
          {items.length} items
        </span>
        {estimatedDelivery && (
          <span className="flex items-center gap-0.5 text-[10px] text-[#565959] ml-auto">
            <Clock className="h-3 w-3" />
            {estimatedDelivery} min
          </span>
        )}
      </div>

      {/* Item list */}
      <div className="space-y-1.5 mb-2">
        {displayItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <span className="text-[#0f1111] truncate flex-1 mr-2">
              {item.name} <span className="text-[#565959]">×{item.quantity}</span>
            </span>
            <span className="text-[#0f1111] font-medium flex-shrink-0">
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
        {remainingCount > 0 && (
          <p className="text-xs text-[#565959] italic">
            +{remainingCount} more item{remainingCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-[#d5d9d9]">
        <span className="text-xs font-semibold text-[#0f1111]">Estimated Total</span>
        <span className="text-sm font-bold text-[#0f1111]">₹{total}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        {!added ? (
          <>
            <button
              onClick={handleAddToCart}
              className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg btn-amazon-yellow active:scale-95 transition-all"
            >
              Add All to Cart
            </button>
            <Link
              href="/cart"
              className="text-center text-xs font-medium py-2 px-3 rounded-lg border border-[#d5d9d9] text-[#0f1111] hover:bg-[#f7f8f8] active:scale-95 transition-all"
            >
              View Cart
            </Link>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#007600]">
            <CheckCircle className="h-4 w-4" />
            Added to Cart!
            <Link href="/cart" className="ml-2 text-[#007185] hover:underline">
              View →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
