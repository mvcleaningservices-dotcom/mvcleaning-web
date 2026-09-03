import { useCallback, useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { api, type WalletState } from '../../api';
import { loadRazorpay, openCheckout } from '../../lib/razorpay';

const QUICK = [100, 200, 500, 1000];

/** Wallet — balance, quick top-up (test mode), transaction history. */
export function Wallet() {
  const [wallet, setWallet] = useState<WalletState>({ balance: 0, history: [] });
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setWallet(await api.getWallet());
    } catch {
      /* keep last state */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const topUp = async () => {
    const value = Math.floor(Number(amount) || 0);
    if (value < 1) return;
    setBusy(true);
    setError('');
    try {
      const res = await api.topupWallet(value);
      if (res.payment.provider === 'test') {
        await api.confirmTopupTest(res.transactionId);
      } else if (res.payment.provider === 'razorpay') {
        // Real money: open Razorpay Checkout, then let the server verify the
        // signature before the balance is credited.
        await loadRazorpay();
        const result = await openCheckout({
          keyId: res.payment.keyId!,
          orderId: res.payment.razorpayOrderId!,
          amount: res.payment.amount ?? value,
          name: 'MV Cleaning Services',
          description: `Wallet top-up of ₹${value}`,
        });
        await api.verifyTopup(result);
      }
      setAmount('');
      await load();
    } catch (e) {
      // A silent failure here looks identical to a top-up that did nothing —
      // always tell the customer what happened.
      setError((e as Error).message || 'Top-up failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="app-placeholder">Loading your wallet…</div>;

  return (
    <div className="acct">
      <h1 className="page-h1">Wallet</h1>

      <div className="wl-hero">
        <span className="wl-label">Available balance</span>
        <div className="wl-bal">₹{wallet.balance.toLocaleString('en-IN')}</div>
        <span className="wl-hint">Use it to pay the advance or the balance on any booking.</span>
      </div>

      <div className="panel">
        <h2>Add money</h2>
        <div className="wl-quick">
          {QUICK.map((q) => (
            <button key={q} className={`wl-chip${amount === String(q) ? ' sel' : ''}`} onClick={() => setAmount(String(q))}>₹{q}</button>
          ))}
        </div>
        <input className="auth-input" inputMode="numeric" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} />
        {error && <p className="auth-error">{error}</p>}
        <button className="btn-primary" style={{ marginTop: 12 }} disabled={busy || !amount} onClick={topUp}>{busy ? 'Adding…' : 'Add money'}</button>
      </div>

      <div className="panel">
        <h2>Transactions</h2>
        {wallet.history.length === 0 ? (
          <p className="acct-msg">No transactions yet.</p>
        ) : (
          wallet.history.map((t) => {
            const credit = t.type === 'topup' || t.type === 'refund';
            return (
              <div key={t.id} className="wl-txn">
                <div className={`wl-txn-icon${credit ? ' credit' : ''}`}>{credit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</div>
                <div className="wl-txn-body">
                  <div className="wl-txn-desc">{t.description || (credit ? 'Top-up' : 'Payment')}</div>
                  <div className="wl-txn-date">{new Date(t.at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} · {new Date(t.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className={`wl-amt${credit ? ' credit' : ''}`}>{credit ? '+' : '−'}₹{t.amount.toLocaleString('en-IN')}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
