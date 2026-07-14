import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/ScrollReveal';
import { api } from '../api';

interface Post { id: string; title: string; content: string; publishedAt: string; }

const FALLBACK_POST_CONTENT: Record<string, Post> = {
  'top-5-kitchen-cleaning-hacks': {
    id: 'f1', title: 'Top 5 Kitchen Cleaning Hacks for Indian Homes',
    publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    content: `The kitchen is the heart of an Indian home, but the heavy use of oil and spices means it gets dirty fast. Here are 5 hacks to keep it spotless:

1. Baking Soda & Vinegar for Chimneys
Chimney filters collect stubborn grease. Soak them in boiling water with baking soda and a dash of vinegar for 30 minutes. The grease will melt right off!

2. Lemon for Microwave Odors
Slice a lemon, put it in a bowl of water, and microwave it on high for 3 minutes. The steam loosens dried food, and the lemon neutralizes curry odors.

3. Oil to Remove Oil
It sounds counterintuitive, but rubbing a few drops of vegetable oil on a paper towel and wiping greasy cabinets will dissolve sticky buildup. Follow up with a mild soap wipe.

4. Newspaper for Glass
Instead of cloth, use old newspaper with a glass cleaner for your kitchen windows and oven doors. It leaves zero lint and a streak-free shine.

5. Hire Professionals for Deep Cleaning
Sometimes, home hacks aren't enough. A professional deep clean every 3-6 months reaches places you can't and sanitizes your entire cooking space.`
  },
  'why-deep-cleaning-matters': {
    id: 'f2', title: 'Why Deep Cleaning Before Festivals is Essential',
    publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    content: `Diwali and other festivals bring joy, light, and a lot of guests. While regular cleaning keeps things tidy, a professional deep clean is necessary preparation.

Here's why you should book a deep clean before the festive season:

Hidden Dust: Dust accumulates on fan blades, top shelves, and behind heavy furniture. Deep cleaning ensures every hidden corner is addressed.

Sanitization: A deep clean goes beyond dusting. It involves sanitizing bathrooms, kitchens, and high-touch areas, ensuring a hygienic environment for your family and guests.

Saves Time: Preparing for festivals is exhausting. Outsourcing the cleaning to professionals gives you time to focus on shopping, cooking, and decorating.

Protect Your Investment: Regular deep cleaning extends the life of your furniture, carpets, and appliances by removing abrasive dirt and grime.`
  }
};

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    api.getBlogPost(slug)
      .then(setPost)
      .catch(() => {
        const fallback = FALLBACK_POST_CONTENT[slug];
        if (fallback) setPost(fallback);
        else setError('Article not found.');
      })
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
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-400)' }}>
                <BookOpen size={64} aria-hidden="true" />
              </div>
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
