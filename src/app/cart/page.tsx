'use client';

import Link from 'next/link';
import { ShoppingCart, CheckCircle, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { BuyNowButton } from '@/components/cart/BuyNowButton';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const situationLabel = useCartStore((state) => state.situationLabel);
  const isPending = useCartStore((state) => state.isPending);
  const pendingItems = useCartStore((state) => state.pendingItems);
  const pendingLabel = useCartStore((state) => state.pendingLabel);
  const confirmPending = useCartStore((state) => state.confirmPending);
  const discardPending = useCartStore((state) => state.discardPending);

  const hasConfirmedItems = items.length > 0;
  const hasPendingItems = pendingItems.length > 0;

  if (!hasConfirmedItems && !hasPendingItems) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center bg-[#eaeded]">
        <div className="w-20 h-20 rounded-full bg-white border border-[#d5d9d9] flex items-center justify-center mb-4">
          <ShoppingCart className="h-10 w-10 text-[#d5d9d9]" />
        </div>
        <h2 className="text-xl font-bold text-[#0f1111] mb-1">
          Your cart is empty
        </h2>
        <p className="text-sm text-[#565959] mb-6 max-w-[280px]">
          Describe a situation to get started — we&apos;ll build the perfect cart for you.
        </p>
        <Button asChild className="btn-amazon-yellow font-semibold px-8 py-2.5 text-sm">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#eaeded] min-h-screen px-4 py-4">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-4">
        {/* Left: Cart Items */}
        <div className="flex-1 space-y-4">
          {/* Pending confirmation banner */}
          {isPending && hasPendingItems && (
            <div className="bg-white border border-[#d5d9d9] rounded-lg p-4 shadow-sm">
              <p className="text-sm font-bold text-[#0f1111] mb-1">
                Add {pendingItems.length} items from &ldquo;{pendingLabel}&rdquo; to your cart?
              </p>
              <p className="text-xs text-[#565959] mb-3">
                {hasConfirmedItems
                  ? `You have ${items.length} items already. These will be added.`
                  : 'Review the suggested items below.'}
              </p>
              <div className="flex gap-2">
                <button onClick={confirmPending} className="flex-1 flex items-center justify-center gap-1.5 py-2 btn-amazon-yellow text-sm font-semibold rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  Add to Cart
                </button>
                <button onClick={discardPending} className="flex items-center justify-center gap-1.5 px-4 py-2 border border-[#d5d9d9] bg-white hover:bg-[#f7f8f8] text-[#0f1111] text-sm font-medium rounded-lg">
                  <X className="h-4 w-4" />
                  Discard
                </button>
              </div>

              {/* Pending items list */}
              <div className="mt-3 border-t border-[#d5d9d9] pt-3 space-y-2">
                {pendingItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0f1111] truncate">{item.name}</p>
                      <p className="text-xs text-[#565959]">{item.brand} · Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[#0f1111] ml-3">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmed cart */}
          {hasConfirmedItems && (
            <div className="bg-white border border-[#d5d9d9] rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#d5d9d9]">
                <h1 className="text-xl font-bold text-[#0f1111]">Shopping Cart</h1>
                <span className="text-sm text-[#565959]">{items.length} items</span>
              </div>
              {situationLabel && (
                <p className="text-xs text-[#565959] mb-3">
                  Situation: <span className="text-[#c45500] font-medium">{situationLabel}</span>
                </p>
              )}
              <div className="divide-y divide-[#d5d9d9]">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        {hasConfirmedItems && (
          <div className="lg:w-[300px] flex-shrink-0">
            <div className="bg-white border border-[#d5d9d9] rounded-lg p-4 shadow-sm sticky top-[110px]">
              <CartSummary />
              <div className="mt-4">
                <BuyNowButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
