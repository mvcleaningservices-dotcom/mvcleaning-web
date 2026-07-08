import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, type BlogPost } from '../api';
import { Seo } from '../components/Seo';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    api.getBlogPost(slug).then(setPost).catch((e) => setError(e.message));
  }, [slug]);

  if (error) {
    return (
      <section className="block">
        <div className="container">
          <p className="form-error">{error}</p>
          <Link to="/blog">Back to Blog</Link>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="block">
        <div className="container">
          <p className="muted">Loading…</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo title={post.title} description={post.excerpt} />
      <section className="block">
        <div className="container">
          <Link to="/blog" className="muted small">
            ← Back to Blog
          </Link>
          <h1 style={{ marginTop: 16 }}>{post.title}</h1>
          <p className="muted small">{new Date(post.publishedAt).toLocaleDateString()}</p>
          <div className="blog-content">{post.content}</div>
        </div>
      </section>
    </>
  );
}
