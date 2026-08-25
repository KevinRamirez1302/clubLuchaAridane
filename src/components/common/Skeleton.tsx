import { Fragment } from 'react';
import type { ReactNode } from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

// Skeleton de tarjeta de noticia
export function NewsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

// Skeleton de tarjeta de jugador
export function PlayerCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm text-center">
      <Skeleton className="h-56 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-3 w-1/2 mx-auto" />
      </div>
    </div>
  );
}

// Skeleton de tarjeta de fichaje
export function SigningCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

// Grid de skeletons
export function SkeletonGrid({ count = 6, children }: { count?: number; children: ReactNode }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Fragment key={i}>{children}</Fragment>
      ))}
    </>
  );
}

export default Skeleton;
