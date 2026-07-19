import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Booking } from '../../api';

const STEPS = ['Placed', 'Assigned', 'Ongoing', 'Done'];
function stepIndex(status: string) {
  if (['pending', 'confirmed'].includes(status)) return 0;
  if (status === 'assigned') return 1;
  if (['in_progress', 'started'].includes(status)) return 2;
  if (status === 'completed') return 3;
  return -1;
}

/** My bookings — list with a status stepper, and settling the balance due after
 *  service (wallet + cash split), mirroring the mobile BookingsScreen. */
export function Bookings() {
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  // Per-booking wallet-amount input and the id currently settling.
  const [walletAmt, setWalletAmt] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.myBookings().then(setList).catch(() => {}).finally(() => setLoading(false));
    api.getWallet().then((w) => setWalletBalance(w.balance)).catch(() => {});
  }, []);

  const settle = async (b: Booking) => {
    const due = b.remainingDue || 0;
    // Clamp to [0, due]: the server enforces this too, but keeping the UI honest
    // means the "cash to pay" line below always matches what will happen.
    const amt = Math.min(Math.max(0, Math.floor(Number(walletAmt[b.id]) || 0)), due);
    setBusyId(b.id);
    setError('');
    try {
      const updated = await api.payFinal(b.id, amt);
      setList((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      // Reflect the wallet spend without a refetch.
      setWalletBalance((bal) => Math.max(0, bal - amt));
    } catch (e) {
      setError((e as Error).message || 'Could not settle payment.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="app-placeholder">Loading your bookings…</div>;

  if (list.length === 0) {
    return (
      <div className="acct">
        <h1 className="page-h1">My bookings</h1>
        <div className="app-placeholder">
          <h1>No bookings yet</h1>
          <p>Book a service and it'll show up here.</p>
          <Link to="/" className="btn-primary" style={{ marginTop: 12 }}>Book a service</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="acct">
      <h1 className="page-h1">My bookings</h1>
      <div className="bk-list">
        {list.map((b) => {
          const idx = stepIndex(b.status);
          const cancelled = b.status === 'cancelled';
          const due = b.remainingDue || 0;
          const settled = b.finalPayment?.settled;
          const wa = Math.min(Math.max(0, Math.floor(Number(walletAmt[b.id]) || 0)), due);
          const cash = due - wa;
          return (
            <div key={b.id} className="bk-card">
              <div className="bk-top">
                <div>
                  <div className="bk-order">{b.orderNumber}</div>
                  <div className="bk-items">{b.items.map((i) => i.name).join(', ')}</div>
                  <div className="bk-date">{b.scheduledDate} · {b.timeSlot}</div>
                </div>
                <div className="bk-right">
                  <div className="bk-price">₹{b.totalAmount}</div>
                  <span className={`bk-badge s-${b.status}`}>{b.status.replace('_', ' ')}</span>
                </div>
              </div>

              {cancelled ? (
                <div className="bk-cancel">This booking was cancelled.</div>
              ) : (
                <div className="bk-steps">
                  {STEPS.map((s, i) => (
                    <div key={s} className={`bk-step${i <= idx ? ' done' : ''}`}>
                      <span className="bk-dot" />
                      <span className="bk-step-label">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bk-foot">
                <span>Advance ₹{b.advanceAmount} {b.advancePaid ? '· paid' : '· unpaid'}</span>
                {!settled && due > 0 && <span className="bk-due">₹{due} due after service</span>}
              </div>

              {/* Settle the balance — only once there is something owed and it
                  isn't already settled. Mirrors the mobile flow: pay part/all
                  from wallet, the rest is collected in cash by the professional. */}
              {settled ? (
                <div className="bk-settled">
                  Final payment settled ✓ &nbsp;Wallet ₹{b.finalPayment!.walletPaid} · Cash ₹{b.finalPayment!.cashPaid}
                </div>
              ) : due > 0 ? (
                <div className="bk-pay">
                  <div className="bk-pay-title">Pay remaining ₹{due}</div>
                  <div className="bk-pay-sub">
                    Choose how much to pay from your wallet (balance ₹{walletBalance}). The rest is paid in cash.
                  </div>
                  <div className="bk-pay-row">
                    <input
                      type="number"
                      min={0}
                      max={due}
                      inputMode="numeric"
                      placeholder="Wallet amount (0 = all cash)"
                      value={walletAmt[b.id] ?? ''}
                      onChange={(e) => setWalletAmt((m) => ({ ...m, [b.id]: e.target.value }))}
                      disabled={busyId === b.id}
                    />
                    <button
                      className="btn-primary"
                      onClick={() => settle(b)}
                      disabled={busyId === b.id}
                    >
                      {busyId === b.id ? 'Settling…' : 'Settle payment'}
                    </button>
                  </div>
                  <div className="bk-pay-calc">Cash to pay: ₹{cash}</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {error && <p className="form-error-msg" style={{ marginTop: 12 }}>{error}</p>}
    </div>
  );
}
