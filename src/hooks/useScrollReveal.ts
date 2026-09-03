import { useCallback, useRef } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: T | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      if (typeof IntersectionObserver === 'undefined') {
        node.classList.add('visible');
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target); // Solo animar una vez
            }
          });
        },
        {
          threshold: options.threshold ?? 0.15,
          rootMargin: options.rootMargin ?? '0px',
        }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [options.threshold, options.rootMargin]
  );

  return ref;
}

// Hook para revelar múltiples elementos hijos
export function useScrollRevealChildren(
  containerSelector: string,
  options: ScrollRevealOptions = {}
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px',
      }
    );

    const elements = document.querySelectorAll(containerSelector);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [containerSelector, options.threshold, options.rootMargin]);
}
