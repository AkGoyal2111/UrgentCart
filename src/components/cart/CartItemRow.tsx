'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types';
import { useCartStore } from '@/stores/cartStore';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex items-start gap-3 py-4">
      {/* Product image */}
      <div className="w-[80px] h-[80px] rounded-md bg-[#f7f8f8] border border-[#d5d9d9] flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">📦</span>
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-[#0f1111] leading-tight line-clamp-2 hover:text-[#c45500] cursor-default">
          {item.name}
        </h3>
        <p className="text-xs text-[#565959] mt-0.5">{item.brand} · {item.unit}</p>
        {item.reason && (
          <p className="text-xs text-[#007600] mt-0.5 truncate">
            {item.reason}
          </p>
        )}
        <p className="text-base font-bold text-[#0f1111] mt-1">
          ₹{item.price.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-[#007600] mt-0.5">In Stock</p>

        {/* Quantity controls + delete */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-[#d5d9d9] rounded-md overflow-hidden shadow-sm">
            <button
              onClick={() =>
                item.quantity === 1
                  ? removeItem(item.id)
                  : updateQuantity(item.id, item.quantity - 1)
              }
              className="w-8 h-8 flex items-center justify-center bg-[#f0f2f2] hover:bg-[#e3e6e6] transition-colors"
              aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
            >
              {item.quantity === 1 ? (
                <Trash2 className="h-3.5 w-3.5 text-[#cc0c39]" />
              ) : (
                <Minus className="h-3.5 w-3.5 text-[#0f1111]" />
              )}
            </button>
            <span className="w-10 text-center text-sm font-semibold text-[#0f1111] bg-white border-x border-[#d5d9d9]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-[#f0f2f2] hover:bg-[#e3e6e6] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5 text-[#0f1111]" />
            </button>
          </div>

          <span className="text-[#d5d9d9]">|</span>

          <button
            onClick={() => removeItem(item.id)}
            className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
