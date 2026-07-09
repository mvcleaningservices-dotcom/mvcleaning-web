import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFound() {
  return (
    <>
      <Seo title="Page Not Found — 404" description="The page you're looking for doesn't exist." />
      <div className="not-found">
        <div className="not-found-inner">
          <div className="not-found-code" aria-hidden="true">404</div>
          <h1>Page not found</h1>
          <p>The page you're looking for has moved, or doesn't exist. Let's get you back on track.</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>
            <Home size={16} aria-hidden="true" /> Go to Home
          </Link>
        </div>
      </div>
    </>
  );
}
