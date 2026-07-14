import { useState, useEffect } from 'react';
import { X, Smartphone, Star, CheckCircle } from 'lucide-react';

export function AppDownloadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to trigger CSS transition
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'auto';
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${animateIn ? 'show' : ''}`} onClick={onClose} role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, transition: 'opacity 0.3s ease', opacity: animateIn ? 1 : 0 }}>
      
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 800, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'row', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', transform: animateIn ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        {/* Close button */}
        <button onClick={onClose} aria-label="Close modal" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'background 0.2s' }}>
          <X size={20} color="#333" />
        </button>

        {/* Left side: Visuals */}
        <div className="modal-left" style={{ flex: '1', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Mobile App
              </div>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              The best way to book a clean home.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, marginBottom: 32 }}>
              Download the MV Cleaning app for instant booking, wallet top-ups, and real-time tracking.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'One-tap instant booking',
              'Real-time professional tracking',
              'Digital wallet & easy refunds',
              'Exclusive app-only discounts'
            ].map(feature => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 500 }}>
                <CheckCircle size={18} color="var(--color-primary-200)" />
                {feature}
              </div>
            ))}
          </div>

          {/* Decorative background circle */}
          <div style={{ position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 1 }} />
        </div>

        {/* Right side: Download action */}
        <div className="modal-right" style={{ flex: '1.2', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, background: 'var(--color-primary-50)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--color-primary-600)' }}>
              <Smartphone size={40} />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Get the App
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
              Scan the QR code or click the buttons below to download the app to your phone.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="#" className="app-store-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <Smartphone size={24} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Download on the</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>App Store</div>
              </div>
            </a>
            
            <a href="#" className="app-store-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <Smartphone size={24} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, opacity: 0.8 }}>GET IT ON</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Google Play</div>
              </div>
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', color: 'var(--color-warning)' }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>4.9/5 Rating</span>
          </div>

        </div>

      </div>
    </div>
  );
}
