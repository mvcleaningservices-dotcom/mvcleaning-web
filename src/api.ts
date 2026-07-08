/** API client for the MV Cleaning public marketing site. */
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface PublicService {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
}

export interface BlogPost extends BlogSummary {
  content: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray((data as any)?.message)
      ? (data as any).message.join(', ')
      : (data as any)?.message || 'Request failed';
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  listServices: () => request<PublicService[]>('/services/catalog'),
  listBlogPosts: () => request<BlogSummary[]>('/blog'),
  getBlogPost: (slug: string) => request<BlogPost>(`/blog/${slug}`),

  submitContact: (dto: { name: string; email: string; phone?: string; message: string }) =>
    request<{ received: boolean }>('/inquiries/contact', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  submitPartner: (dto: { name: string; email: string; phone?: string; message: string }) =>
    request<{ received: boolean }>('/inquiries/partner', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
};
