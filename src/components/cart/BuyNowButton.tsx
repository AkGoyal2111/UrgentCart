'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/userStore';

export function BuyNowButton() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const address = useUserStore((state) => state.address);

  const isDisabled = items.length === 0;

  const handleBuyNow = () => {
    router.push('/checkout');
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuyNow}
        disabled={isDisabled}
        className="w-full h-10 btn-amazon-yellow font-semibold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-[0.97] transition-all"
      >
        Proceed to Checkout
      </button>

      {!isDisabled && (
        <p className="text-xs text-[#565959] text-center">
          📍 Delivering to {address.street}, {address.city}
        </p>
      )}
    </div>
  );
}
