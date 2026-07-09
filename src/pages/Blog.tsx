import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Seo } from '../components/Seo';
import { api } from '../api';

interface Post { id: string; slug: string; title: string; excerpt: string; publishedAt: string; }

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listBlogPosts().then(setPosts).catch(() => {}).finally(() => setLoading(false));
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
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
              <Calendar size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: 16 }}>No articles yet — check back soon!</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(p => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="blog-card">
                  <div className="blog-card-cover">
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-400)' }}>
                      <Calendar size={40} />
                    </div>
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-date">
                      <Clock size={12} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      {new Date(p.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="blog-card-title">{p.title}</div>
                    <div className="blog-card-excerpt">{p.excerpt || 'Read the full article for tips and insights.'}</div>
                    <div className="blog-card-read-more">Read article <ArrowRight size={13} aria-hidden="true" /></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
