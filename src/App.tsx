import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreLayout } from './components/StoreLayout';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import { HeroBannerProvider } from './context/HeroBannerContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { AdminRequireAuth } from './admin/AdminRequireAuth';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminSettings } from './admin/pages/AdminSettings';
import { AdminCustomers } from './admin/pages/AdminCustomers';
import { AdminPlaceholder } from './admin/pages/AdminPlaceholder';
import './App.css';

// The homepage IS the booking product (discovery). Marketing/legal pages are
// secondary (footer links). Booking/account pages are login-gated.
const AppHome = lazy(() => import('./pages/app/AppHome').then(m => ({ default: m.AppHome })));
const Checkout = lazy(() => import('./pages/app/Checkout').then(m => ({ default: m.Checkout })));
const Bookings = lazy(() => import('./pages/app/Bookings').then(m => ({ default: m.Bookings })));
const Wallet = lazy(() => import('./pages/app/Wallet').then(m => ({ default: m.Wallet })));
const Account = lazy(() => import('./pages/app/Account').then(m => ({ default: m.Account })));
const Login = lazy(() => import('./pages/app/Login').then(m => ({ default: m.Login })));

// Marketing / legal (footer)
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Faq = lazy(() => import('./pages/Faq').then(m => ({ default: m.Faq })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Refunds = lazy(() => import('./pages/Refunds').then(m => ({ default: m.Refunds })));
const Partner = lazy(() => import('./pages/Partner').then(m => ({ default: m.Partner })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
    </div>
  );
}

function App() {
  return (
    <HeroBannerProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Admin panel ── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminRequireAuth />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/orders" element={<AdminPlaceholder title="Orders" />} />
                  <Route path="/admin/service-partners" element={<AdminPlaceholder title="Service Partners" />} />
                  <Route path="/admin/services" element={<AdminPlaceholder title="Services" />} />
                  <Route path="/admin/customers" element={<AdminCustomers />} />
                  <Route path="/admin/leads" element={<AdminPlaceholder title="Leads" />} />
                  <Route path="/admin/sub-admins" element={<AdminPlaceholder title="Sub Admins" />} />
                  <Route path="/admin/reports" element={<AdminPlaceholder title="Reports" />} />
                  <Route path="/admin/activity" element={<AdminPlaceholder title="Activity" />} />
                  <Route path="/admin/blog" element={<AdminPlaceholder title="Blog" />} />
                  <Route path="/admin/inquiries" element={<AdminPlaceholder title="Inquiries" />} />
                </Route>
              </Route>

              {/* One product shell for the whole site */}
              <Route element={<StoreLayout />}>
                <Route index element={<AppHome />} />
                <Route path="services" element={<Services />} />
                <Route path="about" element={<About />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPostPage />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<Faq />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="refunds" element={<Refunds />} />
                <Route path="partner" element={<Partner />} />
                <Route element={<RequireAuth />}>
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="account" element={<Account />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Standalone full-page login */}
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </AdminAuthProvider>
    </HeroBannerProvider>
  );
}

export default App;
