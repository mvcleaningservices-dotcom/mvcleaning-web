import { useEffect, useState } from 'react';
import { api } from '../../api';
import { PasswordInput } from './PasswordInput';

export type PasswordMode = 'create' | 'reset' | 'change';

const COPY: Record<PasswordMode, { title: string; sub: string; button: string }> = {
  create: {
    title: 'Create a password',
    sub: 'Next time, log in with your mobile number (or username) and password — no OTP needed.',
    button: 'Save password',
  },
  reset: {
    title: 'Set a new password',
    sub: 'Your number is verified. Choose a new password to log in with.',
    button: 'Save new password',
  },
  change: {
    title: 'Login & password',
    sub: 'Set or change your password and username.',
    button: 'Save',
  },
};

const USERNAME_RE = /^(?!\d+$)[a-zA-Z0-9._]{3,30}$/;

/**
 * Client V2 customer password: after sign-up (create, skippable), after
 * "Forgot password?" (reset) and on the Account page (change). Same rules
 * and wording as the mobile app. The user must already be logged in.
 */
export function SetPasswordForm({
  mode,
  onDone,
  compact = false,
}: {
  mode: PasswordMode;
  onDone: () => void;
  /** Account page: no big title. */
  compact?: boolean;
}) {
  const copy = COPY[mode];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  // The username on file; null until it has loaded. An empty username clears
  // it on the server, so we only send "" when we know what was there.
  const [loadedUsername, setLoadedUsername] = useState<string | null>(null);

  // Keep the existing username when resetting / changing.
  useEffect(() => {
    api.passwordStatus()
      .then((s) => {
        setLoadedUsername(s.username);
        setUsername((cur) => cur || s.username);
      })
      .catch(() => {});
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved('');
    const u = username.trim();
    if (u && !USERNAME_RE.test(u)) {
      return setError('Username: 3–30 letters, numbers, dots or underscores (not only numbers).');
    }
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('The two passwords do not match.');
    setBusy(true);
    try {
      // Blank box + username not loaded yet → leave the saved username alone.
      await api.setPassword(password, u === '' && loadedUsername === null ? undefined : u);
      if (mode === 'change') {
        setPassword('');
        setConfirm('');
        setSaved('Saved ✓');
      }
      onDone();
    } catch (err) {
      setError((err as Error).message || 'Could not save your password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save}>
      {compact ? (
        <h2>{copy.title}</h2>
      ) : (
        <>
          <h1 className="auth-title">{copy.title}</h1>
          <p className="auth-sub">{copy.sub}</p>
        </>
      )}

      <label className="auth-label" htmlFor="pw-username">
        Username <span style={{ fontWeight: 400, color: 'var(--color-text-subtle, #94a3b8)', fontSize: 12 }}>(optional)</span>
      </label>
      <input
        id="pw-username"
        className="auth-input"
        autoComplete="username"
        autoCapitalize="none"
        placeholder="e.g. priya.k"
        maxLength={30}
        value={username}
        onChange={(e) => setUsername(e.target.value.trim())}
      />
      <p style={{ fontSize: 12, color: 'var(--color-text-subtle, #94a3b8)', margin: '4px 0 14px' }}>
        You can always log in with your mobile number too.
      </p>

      <label className="auth-label" htmlFor="pw-new">New password</label>
      <div style={{ marginBottom: 14 }}>
        <PasswordInput
          id="pw-new"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          shown={show}
          onToggle={() => setShow((v) => !v)}
        />
      </div>
      <label className="auth-label" htmlFor="pw-confirm">Confirm password</label>
      <PasswordInput
        id="pw-confirm"
        autoComplete="new-password"
        placeholder="Type it again"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        shown={show}
        onToggle={() => setShow((v) => !v)}
      />
      <div style={{ height: 8 }} />

      {error && <p className="auth-error">{error}</p>}
      {saved && <p className="acct-msg">{saved}</p>}

      <button className="btn-primary auth-submit" type="submit" disabled={busy}>
        {busy ? 'Saving…' : copy.button}
      </button>
      {mode === 'create' && (
        <button type="button" className="auth-link" style={{ marginTop: 8 }} onClick={onDone} disabled={busy}>
          Skip for now
        </button>
      )}
    </form>
  );
}
