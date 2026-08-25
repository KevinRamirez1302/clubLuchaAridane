// Sección "Quiénes somos" — Galería multimedia con lightbox
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import LazyImage from '../common/LazyImage';

export default function MediaGallery() {
  const { galeria } = useApp();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Cerrar lightbox con ESC
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i !== null ? Math.min(i + 1, galeria.length - 1) : i));
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i !== null ? Math.max(i - 1, 0) : i));
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIdx, galeria.length]);

  const imagenActual = lightboxIdx !== null ? galeria[lightboxIdx] : null;

  return (
    <div>
      {/* Grid de fotos */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        role="list"
        aria-label="Galería multimedia del club"
      >
        {galeria.map((item, idx) => (
          <button
            key={item.id}
            role="listitem"
            onClick={() => setLightboxIdx(idx)}
            aria-label={`Ver imagen: ${item.titulo}`}
            className="group relative aspect-square overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange"
          >
            <LazyImage
              src={item.url}
              alt={item.titulo}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-club-blue/0 group-hover:bg-club-blue/50 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center px-3">
                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <p className="text-xs font-semibold line-clamp-1">{item.titulo}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && imagenActual && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Lightbox: ${imagenActual.titulo}`}
          onClick={() => setLightboxIdx(null)}
        >
          {/* Contenido — stopPropagation para no cerrar al hacer clic en la imagen */}
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setLightboxIdx(null)}
              aria-label="Cerrar lightbox"
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Imagen */}
            <img
              src={imagenActual.url}
              alt={imagenActual.titulo}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />

            {/* Info */}
            <div className="mt-3 text-center">
              <p className="text-white font-bold">{imagenActual.titulo}</p>
              {imagenActual.descripcion && (
                <p className="text-white/60 text-sm mt-1">{imagenActual.descripcion}</p>
              )}
            </div>

            {/* Navegación */}
            <div className="absolute inset-y-0 left-0 flex items-center -ml-12">
              <button
                onClick={() => setLightboxIdx((i) => (i !== null ? Math.max(i - 1, 0) : 0))}
                aria-label="Imagen anterior"
                disabled={lightboxIdx === 0}
                className="p-2 text-white/70 hover:text-white disabled:opacity-30 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center -mr-12">
              <button
                onClick={() => setLightboxIdx((i) => (i !== null ? Math.min(i + 1, galeria.length - 1) : 0))}
                aria-label="Imagen siguiente"
                disabled={lightboxIdx === galeria.length - 1}
                className="p-2 text-white/70 hover:text-white disabled:opacity-30 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Contador */}
            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs">
              {lightboxIdx + 1} / {galeria.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
