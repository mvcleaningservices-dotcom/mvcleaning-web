import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
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

      <form className="panel acct-form" onSubmit={save}>
        <h2>Personal details</h2>
        <label className="auth-label">Mobile number</label>
        <input className="auth-input" value={profile?.mobile || ''} disabled />
        <label className="auth-label">Full name</label>
        <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <label className="auth-label">Default address</label>
        <textarea className="co-textarea" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Flat, street, landmark" />
        <label className="auth-label">Pincode</label>
        <input className="auth-input" value={pincode} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} />
        {msg && <p className="acct-msg">{msg}</p>}
        <button className="btn-primary" type="submit" disabled={saving} style={{ marginTop: 16 }}>{saving ? 'Saving…' : 'Save changes'}</button>
      </form>

      <button className="acct-logout" onClick={() => { logout(); navigate('/'); }}>
        <LogOut size={18} /> Log out
      </button>
    </div>
  );
}
