import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { BannerItem } from '../../api';
import '../../styles/banners.css';

const AUTO_MS = 5000;

/**
 * Admin-managed banners (client V2). One banner shows on its own; several slide
 * (dots, or automatically every 5 s — paused while the pointer is over it).
 * Computers get the desktop image, phones (≤760px) the mobile one.
 *
 * `leading` is an optional built-in first slide (the home hero photo).
 * `variant` sets the shape: "hero" fills the existing hero photo box,
 * "strip" is a wide banner (category / promo).
 */
export function BannerSlider({
  banners,
  leading,
  variant,
  onSelect,
  className = '',
}: {
  banners: BannerItem[];
  leading?: ReactNode;
  variant: 'hero' | 'strip';
  onSelect: (b: BannerItem) => void;
  className?: string;
}) {
  const count = banners.length + (leading ? 1 : 0);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    setIndex(0);
    if (count < 2) return;
    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;

  return (
    <div
      className={`bnr bnr--${variant} ${className}`}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      aria-roledescription="carousel"
    >
      <div className="bnr-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {leading && (
          <div className="bnr-slide" aria-hidden={index !== 0}>{leading}</div>
        )}
        {banners.map((b, i) => {
          const pos = i + (leading ? 1 : 0);
          const img = (
            <picture>
              <source media="(max-width: 760px)" srcSet={b.imageMobile || b.imageDesktop} />
              <img src={b.imageDesktop} alt={b.alt} loading={pos === 0 ? 'eager' : 'lazy'} />
            </picture>
          );
          return (
            <div key={b.id} className="bnr-slide" aria-hidden={index !== pos}>
              {b.linkType === 'none' ? (
                img
              ) : (
                <button
                  type="button"
                  className="bnr-link"
                  onClick={() => onSelect(b)}
                  tabIndex={index === pos ? 0 : -1}
                  aria-label={b.alt}
                >
                  {img}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {count > 1 && (
        <div className="bnr-dots">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`bnr-dot${i === index ? ' active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Show banner ${i + 1} of ${count}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
