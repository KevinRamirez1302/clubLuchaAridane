// Imagen con lazy loading y fallback
import { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: string;
}

export default function LazyImage({
  src,
  alt,
  fallback = 'https://placehold.co/400x300/0B3D91/white?text=Club+Aridane',
  className = '',
  aspectRatio,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden w-full h-full ${aspectRatio ? `aspect-[${aspectRatio}]` : ''}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder mientras carga */}
      {!loaded && !error && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  );
}
