import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from './ScrollReveal';

/**
 * Animated counter that counts up from 0 to `end` when it scrolls into view.
 */
export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 1800,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [ref, visible] = useScrollReveal<HTMLSpanElement>();
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!visible || animatedRef.current) return;
    animatedRef.current = true;

    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [visible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
