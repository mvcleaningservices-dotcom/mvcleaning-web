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

/** My bookings — list with a status stepper (from real order status). */
export function Bookings() {
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.myBookings().then(setList).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
                {due > 0 && <span className="bk-due">₹{due} due after service</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
