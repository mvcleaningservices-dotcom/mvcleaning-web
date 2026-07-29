import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ScrollReveal';
import { api } from '../api';

interface Post { id: string; title: string; content: string; coverImage?: string; publishedAt: string; }



export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    api.getBlogPost(slug)
      .then(setPost)
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="skeleton" style={{ height: 340, borderRadius: 'var(--radius-xl)', marginBottom: 40 }} />
          <div className="skeleton skeleton-text-lg" style={{ width: '70%', marginBottom: 16 }} />
          <div className="skeleton skeleton-text" style={{ marginBottom: 12 }} />
          <div className="skeleton skeleton-text" style={{ width: '85%' }} />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <BookOpen size={40} style={{ margin: '0 auto 16px', color: 'var(--color-text-muted)' }} />
          <h2 style={{ marginBottom: 12 }}>Article not found</h2>
          <Link to="/blog" className="btn-primary" style={{ display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title={post.title} description={post.content.slice(0, 150)} />

      <Reveal>
        <div className="section">
          <div className="container">
            <div className="blog-post-header">
              <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--color-primary-600)', textDecoration: 'none', marginBottom: 24, fontWeight: 600 }}>
                <ArrowLeft size={16} aria-hidden="true" /> Back to Blog
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', justifyContent: 'center', marginBottom: 16 }}>
                <Clock size={13} aria-hidden="true" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>{post.title}</h1>
            </div>

            <div className="blog-post-cover">
              {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-400)' }}>
                  <BookOpen size={64} aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="blog-post-body">{post.content}</div>

            <div style={{ textAlign: 'center', marginTop: 64 }}>
              <Link to="/blog" className="btn-secondary">
                <ArrowLeft size={16} aria-hidden="true" /> Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}
