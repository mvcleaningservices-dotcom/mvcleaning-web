/**
 * Razorpay Checkout loader + promise wrapper.
 *
 * The script is fetched on demand (first time checkout is opened) rather than
 * from index.html, so the marketing pages — which never take a payment — don't
 * pay for it on every visit.
 */

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

let loader: Promise<void> | null = null;

/** Load checkout.js once; concurrent callers share the same promise. */
export function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => {
      // Let a later attempt retry instead of caching the failure forever.
      loader = null;
      script.remove();
      reject(new Error('Could not reach the payment gateway. Check your connection and try again.'));
    });
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
  return loader;
}

export interface CheckoutResult {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface CheckoutOptions {
  keyId: string;
  orderId: string;
  /** Rupees — converted to paise for Razorpay. */
  amount: number;
  name: string;
  description: string;
  prefill?: { name?: string; contact?: string; email?: string };
}

/**
 * Open Razorpay Checkout and resolve with the fields the server needs to verify
 * the payment. Rejects if the customer dismisses the modal or the payment
 * fails, so the caller can leave them on checkout with the cart intact.
 */
export function openCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
  return new Promise<CheckoutResult>((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Payment gateway is not ready. Please try again.'));
      return;
    }

    // Guards against a "dismiss" firing after a successful payment (Razorpay
    // calls ondismiss on some close paths) and settling the promise twice.
    let settled = false;

    const rzp = new window.Razorpay({
      key: options.keyId,
      order_id: options.orderId,
      amount: Math.round(options.amount * 100), // paise
      currency: 'INR',
      name: options.name,
      description: options.description,
      prefill: options.prefill ?? {},
      theme: { color: '#1e40af' },
      handler: (res: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        settled = true;
        resolve({
          razorpayOrderId: res.razorpay_order_id,
          razorpayPaymentId: res.razorpay_payment_id,
          razorpaySignature: res.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          if (settled) return;
          settled = true;
          reject(new Error('Payment cancelled.'));
        },
      },
    });

    rzp.open();
  });
}
