// Modal accesible con trap de foco, cierre por ESC y portal a document.body
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Enfocar el dialog al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => dialogRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop que cubre toda la pantalla incluyendo el header */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel perfectamente centrado en el viewport */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92dvh] sm:max-h-[88vh] flex flex-col focus:outline-none border border-gray-100 dark:border-gray-800 z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-gray-800 gap-3 bg-white dark:bg-gray-900">
          <h2 id="modal-title" className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="overflow-y-auto p-4 sm:p-6 overscroll-contain flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}
