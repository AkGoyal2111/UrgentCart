declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color: string };
  modal?: { ondismiss: () => void };
}

export function openRazorpayCheckout(options: RazorpayOptions): void {
  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not loaded');
  }
  const rzp = new window.Razorpay(options);
  rzp.open();
}

export function isRazorpayLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.Razorpay;
}

/**
 * Wait for Razorpay SDK to load (up to 5 seconds).
 * Returns true if loaded, false if timed out.
 */
export function waitForRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (isRazorpayLoaded()) {
        clearInterval(interval);
        resolve(true);
      } else if (attempts >= 25) {
        // 5 seconds (25 * 200ms)
        clearInterval(interval);
        resolve(false);
      }
    }, 200);
  });
}
