import { useState } from 'react';

interface Props {
  onSubmit: (dto: { name: string; email: string; phone?: string; message: string; website?: string }) => Promise<unknown>;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
}

/** Contact/Partner inquiry form. Includes a honeypot field for spam protection
 * (hidden from real users via CSS, invisible bots tend to auto-fill it). */
export function InquiryForm({
  onSubmit,
  messageLabel = 'Message',
  messagePlaceholder = 'How can we help?',
  submitLabel = 'Send',
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim(), website });
      setDone(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return <p className="form-success">Thanks — we've received your message and will get back to you soon.</p>;
  }

  return (
    <form className="stack" onSubmit={submit}>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <label htmlFor="name">Name</label>
      <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />

      <label htmlFor="email">Email</label>
      <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

      <label htmlFor="phone">Phone (optional)</label>
      <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

      <label htmlFor="message">{messageLabel}</label>
      <textarea id="message" required placeholder={messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} />

      {error && <p className="form-error">{error}</p>}
      <button type="submit" disabled={busy}>
        {busy ? 'Sending…' : submitLabel}
      </button>
    </form>
  );
}
