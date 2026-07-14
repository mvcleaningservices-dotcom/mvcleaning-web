import { useEffect } from 'react';

/**
 * Injects JSON-LD structured data into the page <head>.
 * Automatically cleaned up on unmount.
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [data]);

  return null;
}

/** LocalBusiness schema for MV Cleaning Services */
export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'MV Cleaning Services',
  description: 'Professional home cleaning services — deep cleaning, kitchen, bathroom, sofa, pest control and more. Book in minutes via our app.',
  url: 'https://mvcleaning.in',
  telephone: '+91-XXXXXXXXXX',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  priceRange: '₹149 - ₹999',
  image: '/images/hero.png',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '200',
  },
};
