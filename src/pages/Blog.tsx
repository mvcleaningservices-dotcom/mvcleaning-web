import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type BlogSummary } from '../api';
import { Seo } from '../components/Seo';

export function Blog() {
  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listBlogPosts().then(setPosts).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <Seo title="Blog" description="Cleaning tips, service updates, and news from MV Cleaning Services." />
      <section className="block">
        <div className="container">
          <h1 className="section-title">Blog</h1>
          <p className="section-sub">Cleaning tips, service updates, and company news.</p>
          {error && <p className="form-error">{error}</p>}
          <div className="blog-list">
            {posts.length === 0 && !error && <p className="muted">No posts yet — check back soon.</p>}
            {posts.map((p) => (
              <article key={p.id} className="blog-item">
                <div className="date">{new Date(p.publishedAt).toLocaleDateString()}</div>
                <h3>
                  <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                </h3>
                <p>{p.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
