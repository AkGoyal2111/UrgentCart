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

  // Empty state - no items at all
  if (!hasConfirmedItems && !hasPendingItems) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <ShoppingCart className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Your cart is empty
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-[250px]">
          Describe a situation to get started — we&apos;ll build the perfect cart for you.
        </p>
        <Button asChild className="bg-amazon-orange hover:bg-amazon-orange/90 text-white font-semibold rounded-xl px-6">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Pending confirmation banner */}
      {isPending && hasPendingItems && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-fade-in-up">
          <p className="text-sm font-semibold text-amber-900 mb-1">
            🛒 Add {pendingItems.length} items from &ldquo;{pendingLabel}&rdquo; to your cart?
          </p>
          <p className="text-xs text-amber-700 mb-3">
            {hasConfirmedItems
              ? `You already have ${items.length} items. These will be added to your existing cart.`
              : 'Review the suggested items below.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={confirmPending}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amazon-orange hover:bg-amazon-orange/90 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Add to Cart
            </button>
            <button
              onClick={discardPending}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
            >
              <X className="h-4 w-4" />
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Pending items preview */}
      {isPending && hasPendingItems && (
        <div>
          <h2 className="text-sm font-semibold text-amber-800 mb-2 px-1">
            Suggested Items ({pendingItems.length})
          </h2>
          <div className="bg-amber-50/50 rounded-xl border border-amber-100 px-3">
            {pendingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-amber-100 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.brand} · {item.unit}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-sm font-semibold text-gray-900">₹{item.price}</p>
                  <p className="text-xs text-gray-400">×{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed cart items */}
      {hasConfirmedItems && (
        <>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
            {situationLabel && (
              <p className="text-sm text-gray-600 mt-0.5">
                Situation: <span className="text-amazon-orange font-medium">&ldquo;{situationLabel}&rdquo;</span>
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 px-3">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <CartSummary />

          <div className="pt-2 pb-4">
            <BuyNowButton />
          </div>
        </>
      )}
    </div>
  );
}
