/**
 * API client for the MV Cleaning web app (marketing + booking).
 * Talks to the same backend as the mobile app — no server changes.
 * Endpoints/types mirror `mobile/src/api.ts` so both clients stay in lock-step.
 */
import { session } from './lib/session';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/* ── Types (mirrored from the backend / mobile client) ─────────────────── */
export interface AuthUser {
  id: string;
  mobile: string;
  name: string | null;
}

/** Marketing catalog item (public /services/catalog). */
export interface PublicService {
  id: string;
  name: string;
  description: string;
  price: number;
}

/** Bookable service (pincode-filtered discovery). */
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export interface PopularService extends ServiceItem {
  bookingCount: number;
}

export interface Profile {
  id: string;
  mobile: string;
  name: string | null;
  address: string;
  pincode: string;
}

export interface Booking {
  id: string;
  orderNumber: string;
  items: { name: string; price: number }[];
  scheduledDate: string;
  timeSlot: string;
  address: string;
  totalAmount: number;
  advanceAmount: number;
  advancePaid: boolean;
  status: string;
  assignedWorkerName?: string | null;
  remainingDue?: number;
  finalPayment?: {
    walletPaid: number;
    cashPaid: number;
    onlinePaid: number;
    settled: boolean;
  };
}

export interface WalletTxn {
  id: string;
  type: 'topup' | 'debit' | 'refund';
  amount: number;
  balanceAfter: number | null;
  description: string;
  at: string;
}

export interface WalletState {
  balance: number;
  history: WalletTxn[];
}

export interface CreateBookingResult {
  booking: Booking;
  payment: {
    required: boolean;
    provider?: 'razorpay' | 'test';
    razorpayOrderId?: string;
    keyId?: string;
    amount?: number;
    paidVia?: 'wallet';
  };
}

export interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
}

export interface BlogPost extends BlogSummary {
  content: string;
}

/* ── Request helper ────────────────────────────────────────────────────── */
async function request<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const token = auth ? session.getToken() : null;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray((data as { message?: unknown })?.message)
      ? (data as { message: string[] }).message.join(', ')
      : (data as { message?: string })?.message || 'Request failed';
    throw new Error(msg);
  }
  return data as T;
}

/* ── API ───────────────────────────────────────────────────────────────── */
export const api = {
  /* Public / marketing */
  listServices: () => request<PublicService[]>('/services/catalog'),
  listBlogPosts: () => request<BlogSummary[]>('/blog'),
  getBlogPost: (slug: string) => request<BlogPost>(`/blog/${slug}`),

  submitContact: (dto: { name: string; email: string; phone?: string; message: string }) =>
    request<{ received: boolean }>('/inquiries/contact', { method: 'POST', body: JSON.stringify(dto) }),
  submitPartner: (dto: { name: string; email: string; phone?: string; message: string }) =>
    request<{ received: boolean }>('/inquiries/partner', { method: 'POST', body: JSON.stringify(dto) }),
  submitInquiry: (dto: { name: string; email: string; phone?: string; message: string; type: 'contact' | 'partner' }) => {
    const { type, ...body } = dto;
    return type === 'partner'
      ? request<{ received: boolean }>('/inquiries/partner', { method: 'POST', body: JSON.stringify(body) })
      : request<{ received: boolean }>('/inquiries/contact', { method: 'POST', body: JSON.stringify(body) });
  },

  /* Auth */
  requestOtp: (mobile: string) =>
    request<{ message: string; devOtp?: string }>('/auth/otp/request', { method: 'POST', body: JSON.stringify({ mobile }) }),
  verifyOtp: (mobile: string, code: string) =>
    request<{ accessToken: string; user: AuthUser }>('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ mobile, code }) }),
  me: () => request<{ role: string; user: AuthUser }>('/auth/me', {}, true),

  /* Discovery */
  /**
   * Discovery listing. `pincode` is optional — without one the API returns the
   * whole catalogue, which is what a visitor (and Google) sees before they've
   * told us their area. Search is handled server-side either way, so it keeps
   * working as the catalogue grows.
   */
  listAvailableServices: (pincode?: string, search = '') => {
    const q = new URLSearchParams();
    if (pincode) q.set('pincode', pincode);
    if (search) q.set('search', search);
    const qs = q.toString();
    return request<ServiceItem[]>(`/services${qs ? `?${qs}` : ''}`);
  },
  listPopular: (pincode: string) =>
    request<PopularService[]>(`/services/popular?pincode=${encodeURIComponent(pincode)}`),

  /* Profile */
  getProfile: () => request<Profile>('/users/me', {}, true),
  updateProfile: (dto: { name?: string; address?: string; pincode?: string }) =>
    request<Profile>('/users/me', { method: 'PATCH', body: JSON.stringify(dto) }, true),

  /* Bookings */
  createBooking: (payload: {
    serviceIds: string[];
    scheduledDate: string;
    timeSlot: string;
    address: string;
    pincode?: string;
    advanceMethod?: 'razorpay' | 'wallet';
  }) => request<CreateBookingResult>('/bookings', { method: 'POST', body: JSON.stringify(payload) }, true),
  testConfirm: (bookingId: string) =>
    request<Booking>('/payments/test-confirm', { method: 'POST', body: JSON.stringify({ bookingId }) }, true),
  /** Hand Razorpay's checkout callback to the server, which verifies the
   *  signature before confirming the booking. */
  verifyPayment: (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => request<Booking>('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }, true),
  myBookings: () => request<Booking[]>('/bookings/mine', {}, true),
  payFinal: (bookingId: string, walletAmount: number) =>
    request<Booking>(`/bookings/${bookingId}/final-payment`, { method: 'POST', body: JSON.stringify({ walletAmount }) }, true),

  /* Wallet */
  getWallet: () => request<WalletState>('/wallet', {}, true),
  topupWallet: (amount: number) =>
    request<{
      transactionId: string;
      payment: {
        required: boolean;
        provider?: 'razorpay' | 'test';
        razorpayOrderId?: string;
        keyId?: string;
        amount?: number;
      };
    }>('/wallet/topup', { method: 'POST', body: JSON.stringify({ amount }) }, true),
  confirmTopupTest: (transactionId: string) =>
    request<{ balance: number }>('/wallet/topup/test-confirm', { method: 'POST', body: JSON.stringify({ transactionId }) }, true),
  /** Verify a wallet top-up paid through Razorpay Checkout (server-side signature check). */
  verifyTopup: (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => request<{ balance: number }>('/wallet/topup/verify', { method: 'POST', body: JSON.stringify(payload) }, true),
};
