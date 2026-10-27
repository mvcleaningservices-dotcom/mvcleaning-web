import { useState, useEffect } from 'react';
import { Settings, Image, Type, CheckCircle2, ChevronRight } from 'lucide-react';
import { useHeroBanner, type HeroBannerConfig } from '../../context/HeroBannerContext';

export function AdminSettings() {
  const { config, save } = useHeroBanner();
  const [form, setForm] = useState<HeroBannerConfig>(config);
  const [saved, setSaved] = useState(false);

  // Keep form in sync if config changes externally
  useEffect(() => { setForm(config); }, [config]);

  const set = (key: keyof HeroBannerConfig, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    save(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="adm-page">
      {/* Breadcrumb */}
      <div className="adm-breadcrumb">
        <span>MV Cleaning</span>
        <ChevronRight size={14} />
        <span>Settings</span>
      </div>

      <h1 className="adm-page-title">Platform Settings</h1>
      <p className="adm-page-sub">Super Admin only — applies to all new bookings</p>

      {/* Advance Booking Amount — existing card (read-only display, backend handles it) */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div className="adm-card-icon"><Settings size={20} /></div>
          <div>
            <h2 className="adm-card-title">Advance Booking Amount</h2>
            <p className="adm-card-desc">The advance charged to confirm a booking. Set to ₹0 to make bookings free to confirm (scope §3.2.5).</p>
          </div>
        </div>
        <div className="adm-note">Manage via the Advance Amount setting below (backend controlled).</div>
      </div>

      {/* ── Hero Banner Editor ── */}
      <div className="adm-card" style={{ marginTop: 24 }}>
        <div className="adm-card-header">
          <div className="adm-card-icon"><Image size={20} /></div>
          <div>
            <h2 className="adm-card-title">Home Page — Hero Banner</h2>
            <p className="adm-card-desc">Edit the heading, subtext, button label and trust badges shown in the homepage hero section.</p>
          </div>
        </div>

        {/* Live preview */}
        <div className="adm-hero-preview">
          <div className="adm-hero-preview-inner">
            <h3 className="adm-preview-heading">{form.heading || <em style={{ opacity: 0.4 }}>Heading…</em>}</h3>
            <p className="adm-preview-sub">{form.subtext || <em style={{ opacity: 0.4 }}>Subtext…</em>}</p>
            <div className="adm-preview-btn">{form.buttonText || 'Button'} →</div>
            <div className="adm-preview-badges">
              {[form.badge1, form.badge2, form.badge3, form.badge4].filter(Boolean).map(b => (
                <span key={b} className="adm-preview-badge">{b}</span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="adm-settings-form">
          <div className="adm-form-row">
            <div className="adm-field">
              <label><Type size={14} /> Heading</label>
              <input value={form.heading} onChange={e => set('heading', e.target.value)} placeholder="e.g. Sparkling homes, booked in minutes" />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label>Subtext</label>
              <textarea
                value={form.subtext}
                onChange={e => set('subtext', e.target.value)}
                placeholder="Short description under the heading"
                rows={2}
              />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field" style={{ maxWidth: 280 }}>
              <label>Button Text</label>
              <input value={form.buttonText} onChange={e => set('buttonText', e.target.value)} placeholder="e.g. Explore services" />
            </div>
          </div>

          <p className="adm-form-section-label">Trust Badges (shown below the button)</p>
          <div className="adm-form-row adm-form-row--4">
            {(['badge1', 'badge2', 'badge3', 'badge4'] as const).map((k, i) => (
              <div className="adm-field" key={k}>
                <label>Badge {i + 1}</label>
                <input value={form[k]} onChange={e => set(k, e.target.value)} placeholder={`Badge ${i + 1}`} />
              </div>
            ))}
          </div>

          <div className="adm-form-actions">
            <button type="submit" className="adm-btn-primary">Save Setting</button>
            {saved && (
              <span className="adm-saved-msg">
                <CheckCircle2 size={16} />
                Saved — hero banner updated.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
