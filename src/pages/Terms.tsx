import { FileText, ShieldAlert, CreditCard, RefreshCcw, Handshake, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const SECTIONS = [
  { id: 'services', icon: FileText, title: 'Services & Booking' },
  { id: 'payments', icon: CreditCard, title: 'Payments & Wallet' },
  { id: 'cancellations', icon: RefreshCcw, title: 'Cancellations & Refunds' },
  { id: 'responsibilities', icon: Handshake, title: 'User Responsibilities' },
  { id: 'liability', icon: ShieldAlert, title: 'Liability & Damage' },
  { id: 'changes', icon: AlertTriangle, title: 'Changes to Terms' },
];

export function Terms() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Seo title="Terms of Service" description="Terms and conditions for using MV Cleaning Services." />
      
      <section className="bg-surface-subtle" style={{ padding: 'var(--space-16) 0 var(--space-8)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 800 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', marginBottom: 'var(--space-6)' }}>
            <FileText size={32} />
          </div>
          <h1 className="text-4xl text-primary" style={{ marginBottom: 'var(--space-4)' }}>Terms of Service</h1>
          <p className="text-lg text-secondary">
            The rules, guidelines, and agreements for using our platform and services.
          </p>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-6)', fontWeight: 500 }}>
            Last updated: July 1, 2026
          </p>
        </div>
      </section>

      <section className="container legal-layout">
        
        {/* TOC Sidebar */}
        <aside className="legal-toc">
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-lg text-primary" style={{ marginBottom: 'var(--space-4)' }}>Contents</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <button 
                    onClick={() => scrollTo(sec.id)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 'var(--space-3)', 
                      background: 'none', border: 'none', padding: 'var(--space-2) 0', 
                      color: 'var(--color-text-secondary)', fontFamily: 'var(--font-medium)',
                      cursor: 'pointer', textAlign: 'left', width: '100%'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary-600)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    <sec.icon size={16} />
                    {sec.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div style={{ maxWidth: '800px' }}>
          
          <div id="services" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <FileText size={24} className="text-primary-600" />
              Services and Booking
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              MV Cleaning Services connects customers with professional cleaning service providers. By booking a service through our app or website, you agree to provide accurate information regarding the service location, scope, and requested time slot.
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.7 }}>
              We reserve the right to decline or cancel bookings if the location is outside our serviceable areas, or if the requested service violates our safety policies.
            </p>
          </div>

          <div id="payments" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <CreditCard size={24} className="text-primary-600" />
              Payments and Wallet
            </h2>
            <ul className="text-secondary" style={{ lineHeight: 1.7, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><strong>Advance Payments:</strong> A partial advance payment is required to confirm a booking. This can be paid online via our payment gateway or using your MV Wallet balance.</li>
              <li><strong>Final Payments:</strong> The remaining balance must be paid upon successful completion of the service. You may settle this using your digital wallet, or directly via cash to the service professional.</li>
              <li><strong>Wallet Usage:</strong> Wallet funds are non-transferable to other users but can be used for any future service bookings.</li>
            </ul>
          </div>

          <div id="cancellations" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <RefreshCcw size={24} className="text-primary-600" />
              Cancellations and Refunds
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              You may cancel your booking prior to the assigned service professional's departure. Cancellations made within an acceptable timeframe will result in a full refund of the advance to your original payment method or wallet.
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.7 }}>
              Late cancellations may be subject to a nominal cancellation fee to compensate our professionals for their blocked time. Refunds are generally processed within 5-7 business days.
            </p>
          </div>

          <div id="responsibilities" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Handshake size={24} className="text-primary-600" />
              User Responsibilities
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              To ensure a safe and effective service environment, you agree to:
            </p>
            <ul className="text-secondary" style={{ lineHeight: 1.7, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li>Provide a safe working environment for our service professionals.</li>
              <li>Securely store away valuables, cash, and fragile items prior to the start of the service.</li>
              <li>Ensure an adult is present to grant access and verify the completed work.</li>
            </ul>
          </div>

          <div id="liability" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <ShieldAlert size={24} className="text-primary-600" />
              Liability and Damage
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              While our professionals exercise the utmost care, MV Cleaning Services liability for any accidental damage directly caused by our professionals during the service is limited.
            </p>
            <div style={{ backgroundColor: 'var(--color-warning-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #f59e0b' }}>
              <p style={{ color: '#b45309', fontFamily: 'var(--font-medium)' }}>
                Please report any damage or service quality issues to our support team within 24 hours of service completion to be eligible for review or compensation.
              </p>
            </div>
          </div>

          <div id="changes" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <AlertTriangle size={24} className="text-primary-600" />
              Changes to Terms
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
              We may update these terms periodically. Continued use of the platform after updates constitutes your acceptance of the revised terms.
            </p>
            <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Contact Legal Team
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
