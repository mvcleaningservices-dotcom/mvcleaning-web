import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/password.css';

/**
 * Password box with an eye icon inside to show/hide what was typed.
 * Pass `shown`/`onToggle` to share one eye state across several boxes.
 */
export function PasswordInput({
  shown,
  onToggle,
  className = 'auth-input',
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  shown?: boolean;
  onToggle?: () => void;
}) {
  const [own, setOwn] = useState(false);
  const visible = shown ?? own;
  const toggle = onToggle ?? (() => setOwn((v) => !v));
  return (
    <div className="pw-field">
      <input {...props} className={className} type={visible ? 'text' : 'password'} />
      {/* type="button": inside a form a plain button would submit it. */}
      <button
        type="button"
        className="pw-eye"
        onClick={toggle}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
