import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, ClipboardList, ChevronRight, Wallet as WalletIcon } from 'lucide-react';
import { api } from '../../api';
import { useAuth } from '../../auth/AuthContext';

/** Account: profile details (edit) + logout. */
export function Account() {
  const { profile, refreshProfile, logout, setPincode } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [pincode, setPin] = useState(profile?.pincode || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const initials = (profile?.name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode && !/^\d{6}$/.test(pincode)) return setMsg('Enter a 6-digit pincode.');
    setSaving(true);
    setMsg('');
    try {
      await api.updateProfile({
        name: name.trim() || undefined,
        address: address.trim() || undefined,
        pincode: pincode.trim() || undefined,
      });
      if (pincode) setPincode(pincode);
      await refreshProfile();
      setMsg('Saved ✓');
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="acct">
      <h1 className="page-h1">Account</h1>

      <div className="acct-id">
        <div className="acct-avatar">{initials || <User size={26} />}</div>
        <div>
          <div className="acct-name">{profile?.name || 'Add your name'}</div>
          <div className="acct-mobile">{profile?.mobile}</div>
        </div>
      </div>

      {/* Bookings and Wallet had no route into them anywhere on the site — the
          only link to /bookings was the checkout success screen, and /wallet had
          none at all. Mobile carries both as bottom tabs; this is web's version,
          and it's the first place someone looks after tapping their profile. */}
      <nav className="acct-menu" aria-label="Account sections">
        <Link to="/bookings" className="acct-menu-row">
          <span className="acct-menu-icon"><ClipboardList size={18} /></span>
          <span className="acct-menu-body">
            <strong>My bookings</strong>
            <small>Track upcoming and past services</small>
          </span>
          <ChevronRight size={18} className="acct-menu-chev" />
        </Link>
        <Link to="/wallet" className="acct-menu-row">
          <span className="acct-menu-icon"><WalletIcon size={18} /></span>
          <span className="acct-menu-body">
            <strong>Wallet</strong>
            <small>Balance and transaction history</small>
          </span>
          <ChevronRight size={18} className="acct-menu-chev" />
        </Link>
      </nav>

      <form className="panel acct-form" onSubmit={save}>
        <h2>Personal details</h2>
        <label className="auth-label" htmlFor="acct-mobile">Mobile number</label>
        <input id="acct-mobile" className="auth-input" value={profile?.mobile || ''} disabled />
        <label className="auth-label" htmlFor="acct-name">Full name</label>
        <input id="acct-name" className="auth-input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <label className="auth-label" htmlFor="acct-address">Default address</label>
        <textarea id="acct-address" className="co-textarea" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Flat, street, landmark" />
        <label className="auth-label" htmlFor="acct-pincode">Pincode</label>
        <input id="acct-pincode" className="auth-input" inputMode="numeric" autoComplete="postal-code" value={pincode} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} />
        {msg && <p className="acct-msg">{msg}</p>}
        <button className="btn-primary" type="submit" disabled={saving} style={{ marginTop: 16 }}>{saving ? 'Saving…' : 'Save changes'}</button>
      </form>

      {/* Confirmed: logging back in needs a fresh SMS OTP, so an accidental tap
          costs the user a real round-trip — not just a click. */}
      <button
        className="acct-logout"
        onClick={() => {
          if (window.confirm('Log out of MV Cleaning?')) {
            logout();
            navigate('/');
          }
        }}
      >
        <LogOut size={18} /> Log out
      </button>
    </div>
  );
}
