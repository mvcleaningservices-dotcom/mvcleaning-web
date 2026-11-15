import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { api } from '../../api';
import { useAuth } from '../../auth/AuthContext';
import { SetPasswordForm, type PasswordMode } from '../../components/app/SetPasswordForm';
import { PasswordInput } from '../../components/app/PasswordInput';

/**
 * Consumer login.
 * V2: daily login is mobile number (or username) + password. New customers
 * sign up with one OTP (then create a password, skippable); "Forgot password?"
 * verifies the number by OTP and sets a new one. The OTP form below is the
 * original phone → OTP → verify flow, with a Resend OTP button (30s cooldown).
 */
export function Login() {
  const { isAuthed, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';

  const [step, setStep] = useState<'password' | 'phone' | 'otp' | 'setpw'>('password');
  // V2: password login + what the OTP is for (sign-up/login or password reset).
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [purpose, setPurpose] = useState<'login' | 'reset'>('login');
  const [pwMode, setPwMode] = useState<PasswordMode>('create');
  // Stay on this page after OTP when a password still has to be set.
  const holdRedirect = useRef(false);
  const [mobile, setMobile] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [code, setCode] = useState('');
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // Already logged in? Skip the form (unless we're setting the password).
  if (isAuthed && !holdRedirect.current) return <Navigate to={from} replace />;

  const passwordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return setError('Enter your mobile number (or username) and password.');
    setError('');
    setBusy(true);
    try {
      const res = await api.customerLogin(identifier.trim(), password);
      await login(res.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Could not log in.');
    } finally {
      setBusy(false);
    }
  };

  /** Go to the OTP form — for sign-up/login, or to reset a forgotten password. */
  const toOtp = (p: 'login' | 'reset') => {
    setPurpose(p);
    setError('');
    // A 10-digit identifier is the mobile number — carry it over.
    const digits = identifier.replace(/\D/g, '');
    if (/^\d{10}$/.test(digits) && digits === identifier.trim()) setMobile(digits);
    setStep('phone');
  };

  const backToPassword = () => {
    setStep('password');
    setCode('');
    setError('');
    setResendTimer(0);
  };

  const sendOtp = async (e?: React.FormEvent, isResend = false) => {
    if (e) e.preventDefault();
    if (mobile.length !== 10) return setError('Enter a 10-digit mobile number.');
    setError('');
    setBusy(true);
    try {
      const res = await api.requestOtp(mobile.trim());
      setDevOtp(res.devOtp);
      setStep('otp');
      if (isResend) setResendTimer(30);
    } catch (err) {
      setError((err as Error).message || 'Could not send OTP.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return setError('Enter the 6-digit code.');
    setError('');
    setBusy(true);
    try {
      const res = await api.verifyOtp(mobile.trim(), code.trim());
      // V2: reset → set a new password; first login without one → offer to create it.
      const next: PasswordMode | null =
        purpose === 'reset' ? 'reset' : res.hasPassword === false ? 'create' : null;
      if (next) holdRedirect.current = true;
      await login(res.accessToken);
      if (userLocation.trim()) {
        await api.updateProfile({ location: userLocation.trim() }).catch(() => {});
      }
      if (next) {
        setPwMode(next);
        setStep('setpw');
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Invalid OTP.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          {/* Plated mark — stays legible under browser force-dark. See StoreLayout. */}
          <Link to="/" className="app-logo" style={{ display: 'block', height: 39 }}>
            <img src="/images/logo_plate.webp" alt="MV Cleaning Services" style={{ height: 39 }} />
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          {step === 'setpw' ? (
            <SetPasswordForm
              mode={pwMode}
              onDone={() => { holdRedirect.current = false; navigate(from, { replace: true }); }}
            />
          ) : step === 'password' ? (
            <form onSubmit={passwordLogin}>
              <h1 className="auth-title">Log in</h1>
              <p className="auth-sub">Use your mobile number (or username) and password.</p>
              <label className="auth-label" htmlFor="identifier">Mobile number or username</label>
              <input
                id="identifier"
                className="auth-input"
                autoComplete="username"
                autoCapitalize="none"
                placeholder="10-digit mobile or username"
                maxLength={40}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoFocus
                style={{ marginBottom: 16 }}
              />
              <label className="auth-label" htmlFor="password">Password</label>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="auth-link" onClick={() => toOtp('reset')}>
                  Forgot password?
                </button>
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button className="btn-primary auth-submit" type="submit" disabled={busy || !identifier.trim() || !password}>
                {busy ? 'Logging in…' : 'Log in'}
              </button>
              <p className="auth-sub" style={{ textAlign: 'center', margin: '18px 0 8px' }}>
                New here, or never set a password?
              </p>
              <button type="button" className="btn-secondary auth-submit" style={{ marginTop: 0 }} onClick={() => toOtp('login')}>
                Continue with OTP
              </button>
            </form>
          ) : step === 'phone' ? (
            <form onSubmit={sendOtp}>
              <h1 className="auth-title">{purpose === 'reset' ? 'Reset your password' : 'Log in or sign up'}</h1>
              <p className="auth-sub">
                {purpose === 'reset'
                  ? 'Enter your registered mobile number. We’ll send you an OTP.'
                  : 'Enter your mobile number to continue.'}
              </p>
              {purpose === 'login' && (
                <>
              <label className="auth-label" htmlFor="location">Location <span style={{ fontWeight: 400, color: 'var(--color-text-subtle, #94a3b8)', fontSize: 12 }}>(optional)</span></label>
              <input
                id="location"
                className="auth-input"
                type="text"
                autoComplete="address-level2"
                placeholder="e.g. Koramangala, Bengaluru"
                maxLength={120}
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                style={{ marginBottom: 16 }}
              />
                </>
              )}
              <label className="auth-label" htmlFor="mobile">Mobile number</label>
              <div className="auth-phone">
                <span className="auth-cc">+91</span>
                <input
                  id="mobile"
                  className="auth-input"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  autoFocus
                />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button className="btn-primary auth-submit" type="submit" disabled={busy || mobile.length < 10}>
                {busy ? 'Sending…' : 'Continue'}
              </button>
              <button type="button" className="auth-link" style={{ marginTop: 8 }} onClick={backToPassword}>
                Log in with password instead
              </button>
            </form>
          ) : (
            <form onSubmit={verify}>
              <h1 className="auth-title">Verify your number</h1>
              <p className="auth-sub">Enter the 6-digit code sent to +91 {mobile}.</p>
              
              {devOtp && (
                <div className="auth-devhint">Dev mode: your OTP is <strong>{devOtp}</strong></div>
              )}
              
              <label className="auth-label" htmlFor="otp">OTP</label>
              <input
                id="otp"
                className="auth-input auth-otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                autoFocus
              />
              {error && <p className="auth-error">{error}</p>}
              
              <button className="btn-primary auth-submit" type="submit" disabled={busy || code.length < 6}>
                {busy ? 'Verifying…' : 'Verify & continue'}
              </button>
              
              <div className="auth-resend">
                <span>Didn't receive it?</span>
                <button 
                  type="button" 
                  disabled={resendTimer > 0 || busy} 
                  onClick={() => sendOtp(undefined, true)}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="button"
                className="auth-link"
                style={{ marginTop: 8 }}
                onClick={() => { setStep('phone'); setCode(''); setError(''); setResendTimer(0); }}
              >
                Change mobile number
              </button>
            </form>
          )}

          {step !== 'setpw' && <div className="auth-trust">
            <ShieldCheck size={14} /> Secure, encrypted login
          </div>}
        </div>
      </main>
    </div>
  );
}
