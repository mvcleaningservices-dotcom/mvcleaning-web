import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Wallet, Smartphone, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../../api';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../cart/CartContext';
import { serviceImage } from '../../lib/serviceImage';

const TIME_SLOTS = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];

function nextSevenDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { iso, weekday: i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' }), dayNum: d.getDate() };
  });
}

/** Review + schedule + pay the advance. Booking/payment logic mirrors the mobile
 * CheckoutScreen and uses the same backend. Dev/test payment; live Razorpay web
 * checkout lands in W6. */
export function Checkout() {
  const { profile, pincode } = useAuth();
  const { items, total, clear, remove } = useCart();

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [payFromWallet, setPayFromWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.address) setAddress(profile.address);
    api.getWallet().then((w) => setWalletBalance(w.balance)).catch(() => {});
  }, [profile]);

  // Nothing to check out (and not just-placed) → back to discovery.
  if (items.length === 0 && !placedOrder) return <Navigate to="/" replace />;

  const days = nextSevenDays();
  const valid = date.length > 5 && !!timeSlot && address.trim().length > 5;

  const placeBooking = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await api.createBooking({
        serviceIds: items.map((s) => s.id),
        scheduledDate: date,
        timeSlot,
        address: address.trim(),
        pincode: pincode || '',
        advanceMethod: payFromWallet ? 'wallet' : 'razorpay',
      });
      if (res.payment.required && res.payment.provider === 'test') {
        await api.testConfirm(res.booking.id);
      }
      // (Live Razorpay web checkout is wired in W6; in dev the provider is 'test'.)
      setPlacedOrder(res.booking.orderNumber);
      clear();
    } catch (e) {
      setError((e as Error).message || 'Booking failed.');
    } finally {
      setBusy(false);
    }
  };

  /* ── Success ── */
  if (placedOrder) {
    return (
      <div className="co-success">
        <div className="co-success-icon"><CheckCircle2 size={40} /></div>
        <h1>Booking confirmed!</h1>
        <p>Your order <strong>{placedOrder}</strong> is placed. You'll be notified once a professional is assigned.</p>
        <div className="co-success-actions">
          <Link to="/bookings" className="btn-primary">View my bookings</Link>
          <Link to="/" className="btn-secondary">Book another service</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="co">
      <h1 className="co-title">Checkout</h1>
      <div className="co-grid">
        <div className="co-main">
          {/* Schedule */}
          <section className="co-card">
            <div className="co-card-head"><Calendar size={16} /><h2>Pick a date</h2></div>
            <div className="co-chips">
              {days.map((d) => (
                <button key={d.iso} className={`co-datechip${date === d.iso ? ' sel' : ''}`} onClick={() => setDate(d.iso)}>
                  <span className="co-dc-day">{d.weekday}</span>
                  <span className="co-dc-num">{d.dayNum}</span>
                </button>
              ))}
            </div>
            <div className="co-card-head" style={{ marginTop: 20 }}><Clock size={16} /><h2>Pick a time slot</h2></div>
            <div className="co-chips">
              {TIME_SLOTS.map((s) => (
                <button key={s} className={`co-slot${timeSlot === s ? ' sel' : ''}`} onClick={() => setTimeSlot(s)}>{s}</button>
              ))}
            </div>
          </section>

          {/* Address */}
          <section className="co-card">
            <div className="co-card-head"><MapPin size={16} /><h2>Service address</h2></div>
            <textarea className="co-textarea" placeholder="Flat / house no, street, landmark" value={address} onChange={(e) => setAddress(e.target.value)} />
          </section>

          {/* Payment */}
          <section className="co-card">
            <div className="co-card-head"><Wallet size={16} /><h2>Pay advance</h2></div>
            <button className={`co-pay${payFromWallet ? ' sel' : ''}`} onClick={() => setPayFromWallet(true)}>
              <Wallet size={20} />
              <div><div className="co-pay-t">Pay from wallet</div><div className="co-pay-s">Balance ₹{walletBalance}</div></div>
              <span className="co-radio">{payFromWallet && <Check size={13} />}</span>
            </button>
            <button className={`co-pay${!payFromWallet ? ' sel' : ''}`} onClick={() => setPayFromWallet(false)}>
              <Smartphone size={20} />
              <div><div className="co-pay-t">Pay online</div><div className="co-pay-s">UPI, card or netbanking</div></div>
              <span className="co-radio">{!payFromWallet && <Check size={13} />}</span>
            </button>
            <div className="co-trust"><ShieldCheck size={16} /> You only pay the balance after the service is completed.</div>
          </section>
        </div>

        {/* Summary */}
        <aside className="co-summary">
          <h2>Your order</h2>
          {items.map((s) => (
            <div key={s.id} className="co-item">
              <div className="co-item-thumb">{serviceImage(s) ? <img src={serviceImage(s)} alt="" /> : null}</div>
              <span className="co-item-name">{s.name}</span>
              <span className="co-item-price">₹{s.price}</span>
              <button className="co-item-remove" onClick={() => remove(s.id)} aria-label={`Remove ${s.name}`}>×</button>
            </div>
          ))}
          <div className="co-sep" />
          <div className="co-total"><span>Total</span><strong>₹{total}</strong></div>
          {error && <p className="auth-error">{error}</p>}
          <button className="btn-primary co-place" disabled={!valid || busy} onClick={placeBooking}>
            {busy ? 'Placing…' : !date ? 'Select a date' : !timeSlot ? 'Select a time slot' : address.trim().length <= 5 ? 'Add your address' : 'Pay advance & confirm'}
          </button>
        </aside>
      </div>
    </div>
  );
}
