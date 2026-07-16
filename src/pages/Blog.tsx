import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ScrollReveal';
import { api } from '../api';

interface Post { id: string; slug: string; title: string; excerpt: string; publishedAt: string; }

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.listBlogPosts()
      .then((fetched) => setPosts(fetched))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo title="Blog — Home Cleaning Tips & Guides" description="Expert cleaning tips, guides, and home care advice from the MV Cleaning Services team." />

      <section className="page-hero">
        <div className="container">
          <div className="section-overline" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', marginBottom: 16, display: 'inline-block' }}>Insights</div>
          <h1>Cleaning Tips & Guides</h1>
          <p>Expert advice to keep your home spotless year-round.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="blog-grid">
              {[1,2,3].map(i => (
                <div key={i} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                    <div className="skeleton skeleton-text-lg" style={{ width: '80%' }} />
                    <div className="skeleton skeleton-text" />
                    <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
              <BookOpen size={40} style={{ color: 'var(--color-primary-300)', margin: '0 auto var(--space-4)' }} />
              <h3 className="text-h3 text-primary" style={{ marginBottom: 'var(--space-2)' }}>
                Couldn't load articles
              </h3>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
                Something went wrong on our side. Please try again in a moment.
              </p>
              <button className="btn-secondary" onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : posts.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
              <BookOpen size={40} style={{ color: 'var(--color-primary-300)', margin: '0 auto var(--space-4)' }} />
              <h3 className="text-h3 text-primary" style={{ marginBottom: 'var(--space-2)' }}>
                No articles yet
              </h3>
              <p className="text-secondary">We're writing our first posts — check back soon.</p>
            </div>
          ) : (
            <div className="blog-grid reveal-stagger">
              {posts.map((p, i) => {
                const isFeatured = i === 0;
                return (
                  <Reveal key={p.id} delay={i * 100} className={isFeatured ? 'featured-post-wrap' : ''}>
                    <Link to={`/blog/${p.slug}`} className={`blog-card ${isFeatured ? 'featured' : ''}`} style={isFeatured ? { gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0, minHeight: 340 } : {}}>
                      <div className="blog-card-cover" style={isFeatured ? { height: '100%', minHeight: 300 } : {}}>
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-400)' }}>
                          <BookOpen size={isFeatured ? 64 : 40} />
                        </div>
                      </div>
                      <div className="blog-card-body" style={isFeatured ? { display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--space-8)' } : {}}>
                        <div className="blog-card-date">
                          <Clock size={12} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                          {new Date(p.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {isFeatured && <span style={{ marginLeft: 12, background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>FEATURED</span>}
                        </div>
                        <div className="blog-card-title" style={isFeatured ? { fontSize: 'clamp(20px, 3vw, 28px)', marginBottom: 16 } : {}}>{p.title}</div>
                        <div className="blog-card-excerpt" style={isFeatured ? { fontSize: 16, marginBottom: 24, lineHeight: 1.6 } : {}}>{p.excerpt || 'Read the full article for tips and insights.'}</div>
                        <div className="blog-card-read-more" style={isFeatured ? { marginTop: 'auto' } : {}}>Read article <ArrowRight size={13} aria-hidden="true" /></div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
