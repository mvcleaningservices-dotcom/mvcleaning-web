import { ShieldCheck, Lock, Eye, RefreshCw, Trash2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const SECTIONS = [
  { id: 'info', icon: Eye, title: 'Information We Collect' },
  { id: 'use', icon: RefreshCw, title: 'How We Use It' },
  { id: 'payment', icon: Lock, title: 'Payment Information' },
  { id: 'sharing', icon: ShieldCheck, title: 'Data Sharing' },
  { id: 'rights', icon: Trash2, title: 'Your Rights' },
  { id: 'contact', icon: Mail, title: 'Contact Us' },
];

export function Privacy() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Seo title="Privacy Policy" description="How MV Cleaning Services collects, uses, and protects your data." />
      
      <section className="bg-surface-subtle" style={{ padding: 'var(--space-16) 0 var(--space-8)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 800 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', marginBottom: 'var(--space-6)' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl text-primary" style={{ marginBottom: 'var(--space-4)' }}>Privacy Policy</h1>
          <p className="text-lg text-secondary">
            How we protect your data, handle your information, and respect your privacy.
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
          
          <div id="info" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Eye size={24} className="text-primary-600" />
              Information We Collect
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              When you use the MV Cleaning Services app or website, we collect necessary information to provide you with the best possible service. This includes:
            </p>
            <ul className="text-secondary" style={{ lineHeight: 1.7, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><strong>Contact details:</strong> Your mobile number (for secure OTP login), and name.</li>
              <li><strong>Location details:</strong> Your address and pincode to verify service availability and route our professionals.</li>
              <li><strong>Transaction history:</strong> Booking and order details, and wallet transaction records.</li>
            </ul>
          </div>

          <div id="use" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <RefreshCw size={24} className="text-primary-600" />
              How We Use Your Information
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              We use this information strictly to deliver and improve our services:
            </p>
            <ul className="text-secondary" style={{ lineHeight: 1.7, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li>Process your bookings and safely assign verified service professionals.</li>
              <li>Manage your digital wallet balance and coordinate smooth payments.</li>
              <li>Communicate proactively about your orders and provide rapid customer support.</li>
              <li>Analyze usage to refine our app experience and service catalog.</li>
            </ul>
          </div>

          <div id="payment" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Lock size={24} className="text-primary-600" />
              Payment Information
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7 }}>
              Payments are processed securely through our trusted payment gateways (e.g., Razorpay). We <strong>do not store</strong> your full credit card numbers, UPI IDs, or direct banking details on our servers at any time. This sensitive data is handled directly and securely by our PCI-DSS compliant payment partners.
            </p>
          </div>

          <div id="sharing" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <ShieldCheck size={24} className="text-primary-600" />
              Data Sharing
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              We share your name, address, and contact number with the specific service professional assigned to your booking, solely for the purpose of successfully delivering your scheduled service.
            </p>
            <div style={{ backgroundColor: 'var(--color-primary-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary-600)' }}>
              <p className="text-primary-800" style={{ fontFamily: 'var(--font-medium)' }}>
                We strictly do not sell, rent, or trade your personal data to any third parties for marketing purposes.
              </p>
            </div>
          </div>

          <div id="rights" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Trash2 size={24} className="text-primary-600" />
              Your Rights & Data Retention
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              You have full control over your data. You can update your profile information (name, address, pincode) at any time from within the app.
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.7 }}>
              We retain your account and order history for as long as your account remains active, and as required to comply with legal, tax, and accounting obligations. If you wish to request a complete deletion of your account and associated data, please contact our support team.
            </p>
          </div>

          <div id="contact" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Mail size={24} className="text-primary-600" />
              Contact Us
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
              If you have any questions about this Privacy Policy, your rights, or our data practices, we are here to help.
            </p>
            <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Reach out to Support
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
