import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreLayout } from './components/StoreLayout';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
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
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* One product shell for the whole site */}
          <Route element={<StoreLayout />}>
            {/* Homepage = booking discovery (browsable without login) */}
            <Route index element={<AppHome />} />

            {/* Marketing / legal (footer links) */}
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

            {/* Login-gated — the only login wall is at checkout/account */}
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
  );
}

export default App;
