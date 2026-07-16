import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { api } from '../../api';
import { useAuth } from '../../auth/AuthContext';

/**
 * Consumer login — phone number → OTP → verify → land in /app.
 * Includes a Resend OTP button with a 30s cooldown.
 */
export function Login() {
  const { isAuthed, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobile, setMobile] = useState('');
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

  // Already logged in? Skip the form.
  if (isAuthed) return <Navigate to={from} replace />;

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
      await login(res.accessToken);
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
          <Link to="/" className="app-logo" style={{ display: 'block', height: 34 }}>
            <img src="/images/logo_light.webp" alt="MV Cleaning Services" style={{ height: 34, borderRadius: 4 }} />
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          {step === 'phone' ? (
            <form onSubmit={sendOtp}>
              <h1 className="auth-title">Log in or sign up</h1>
              <p className="auth-sub">Enter your mobile number to continue.</p>
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

          <div className="auth-trust">
            <ShieldCheck size={14} /> Secure, encrypted login
          </div>
        </div>
      </main>
    </div>
  );
}
