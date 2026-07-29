import { Clock, RefreshCcw, ShieldCheck, AlertCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

const SECTIONS = [
  { id: 'advance', icon: ShieldCheck, title: 'Advance Payment Model' },
  { id: 'customer-cancel', icon: AlertCircle, title: 'Cancellation by Customer' },
  { id: 'reschedule', icon: Clock, title: 'Rescheduling' },
  { id: 'refunds', icon: RefreshCcw, title: 'Refund Process & Timelines' },
  { id: 'contact', icon: Phone, title: 'Contact Support' },
];

/**
 * Cancellation & Refunds Policy.
 * This page uses the new legal-layout for a premium 3x better look.
 */
export function Refunds() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Seo 
        title="Cancellation & Refunds Policy — MV Cleaning Services" 
        description="Read our policies on booking cancellations, rescheduling, and refunds for home cleaning services." 
      />

      <section className="bg-surface-subtle" style={{ padding: 'var(--space-16) 0 var(--space-8)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 800 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', marginBottom: 'var(--space-6)' }}>
            <RefreshCcw size={32} />
          </div>
          <h1 className="text-4xl text-primary" style={{ marginBottom: 'var(--space-4)' }}>Cancellation & Refunds</h1>
          <p className="text-lg text-secondary">
            Transparent and flexible booking policies designed to be fair for you and our professionals.
          </p>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-6)', fontWeight: 500 }}>
            Last updated: July 14, 2026
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
          
          <div id="advance" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <ShieldCheck size={24} className="text-primary-600" />
              Advance Payment Model
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              To confirm a booking and secure a verified professional, we require a nominal advance payment (typically ₹49, though this may vary based on the specific service). 
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.7 }}>
              The remaining balance is collected only after the service is successfully completed. You may pay this final balance using cash, UPI, or your MV Cleaning in-app wallet.
            </p>
          </div>

          <div id="customer-cancel" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <AlertCircle size={24} className="text-primary-600" />
              Cancellation by the Customer
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              We understand that plans can change. Our cancellation policy is designed to offer flexibility while remaining fair to our service professionals who block their time for you.
            </p>
            <ul className="text-secondary" style={{ lineHeight: 1.7, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><strong>Free Cancellation:</strong> You can cancel your booking for free up to <strong>2 hours</strong> before your scheduled time slot. In this case, your full advance payment will be automatically refunded.</li>
              <li><strong>Late Cancellation:</strong> If you cancel within <strong>2 hours</strong> of your scheduled time, the advance payment will be forfeited as a cancellation fee to compensate the professional for their blocked time and travel.</li>
            </ul>
          </div>

          <div id="reschedule" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Clock size={24} className="text-primary-600" />
              Rescheduling
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              You may reschedule your booking without any penalty up to <strong>2 hours</strong> before the scheduled time slot. 
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.7 }}>
              Rescheduling requests made closer to the service time may be treated as a late cancellation, and a new advance payment may be required to book a new slot.
            </p>
          </div>

          <div id="refunds" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <RefreshCcw size={24} className="text-primary-600" />
              Refund Process and Timelines
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
              When a refund is approved (e.g., due to a free cancellation or a service issue on our end):
            </p>
            <ul className="text-secondary" style={{ lineHeight: 1.7, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li>Refunds will be processed back to the original payment method used during checkout.</li>
              <li>It typically takes <strong>5-7 business days</strong> for the refunded amount to reflect in your bank account or credit card statement.</li>
              <li>If you paid using the MV Cleaning wallet, the refund will be credited <strong>instantly</strong> back to your wallet.</li>
            </ul>
            
            <div style={{ backgroundColor: 'var(--color-primary-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary-600)', marginTop: 'var(--space-6)' }}>
              <p className="text-primary-800" style={{ fontFamily: 'var(--font-medium)' }}>
                <strong>Service Quality Guarantee:</strong> We offer a free re-clean guarantee for valid complaints reported within 24 hours. If a re-clean is not possible, we will initiate a partial or full refund based on the issue.
              </p>
            </div>
          </div>

          <div id="contact" style={{ marginBottom: 'var(--space-12)', paddingTop: 'var(--space-6)' }}>
            <h2 className="text-2xl text-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Phone size={24} className="text-primary-600" />
              Contact Support
            </h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
              If you have any questions about this policy or need to request a refund, please reach out to our support team.
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
