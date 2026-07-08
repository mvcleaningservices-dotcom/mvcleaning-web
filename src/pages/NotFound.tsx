import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="This page could not be found." />
      <section className="block">
        <div className="container">
          <h1>Page Not Found</h1>
          <p className="muted">The page you're looking for doesn't exist.</p>
          <Link to="/" className="cta" style={{ background: '#1f6feb', color: '#fff' }}>
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
