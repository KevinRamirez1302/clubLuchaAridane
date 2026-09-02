// =============================================================================
// CookieBanner.tsx — Banner de consentimiento de cookies (RGPD / GDPR)
// Guarda la preferencia del usuario en localStorage.
// Se muestra sólo si el usuario aún no ha tomado una decisión.
// =============================================================================

import { useState, useEffect } from 'react';

const COOKIE_KEY = 'club_aridane_cookie_consent';

type ConsentValue = 'accepted' | 'rejected' | null;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Comprueba si el usuario ya tomó una decisión
  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY) as ConsentValue;
    if (!stored) {
      // Pequeño delay para que la animación sea visible al cargar
      const timer = setTimeout(() => {
        setVisible(true);
        setTimeout(() => setAnimate(true), 50);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(COOKIE_KEY, value);
    setAnimate(false);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay sutil */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px] transition-opacity duration-400 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Banner principal */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Aviso de cookies"
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-400 ease-out ${
          animate ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Panel con glassmorphism */}
        <div className="relative overflow-hidden bg-gray-950/95 dark:bg-gray-900/98 backdrop-blur-xl border-t border-white/10 shadow-2xl">
          {/* Línea de acento superior */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-club-blue via-club-orange to-club-green" />

          {/* Brillo decorativo */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-club-blue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">

              {/* Texto principal */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-base mb-1">
                    Utilizamos cookies en esta web
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    Usamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar el contenido.
                    Puedes aceptar todas las cookies o rechazar las no esenciales.{' '}
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-club-orange hover:text-club-orange-light underline underline-offset-2 transition-colors duration-200 cursor-pointer"
                    >
                      {showDetails ? 'Ocultar detalles' : 'Más información'}
                    </button>
                  </p>

                  {/* Detalle expandible */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      showDetails ? 'max-h-64 mt-3' : 'max-h-0'
                    }`}
                  >
                    <div className="border border-white/10 rounded-xl p-3 sm:p-4 bg-white/5 space-y-3">
                      <CookieType
                        title="Cookies esenciales"
                        description="Necesarias para el funcionamiento básico de la web. No se pueden desactivar."
                        always
                      />
                      <CookieType
                        title="Cookies analíticas"
                        description="Nos permiten entender cómo interactúas con el sitio para mejorarlo (Google Analytics, etc.)."
                      />
                      <CookieType
                        title="Cookies de preferencias"
                        description="Recuerdan tus ajustes como el tema oscuro/claro y el idioma seleccionado."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 shrink-0">
                <button
                  id="cookie-reject-btn"
                  onClick={() => handleConsent('rejected')}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/20 text-gray-300 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  Rechazar no esenciales
                </button>
                <button
                  id="cookie-accept-btn"
                  onClick={() => handleConsent('accepted')}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-club-orange to-club-orange-dark text-white hover:from-club-orange-light hover:to-club-orange shadow-lg shadow-club-orange/25 hover:shadow-club-orange/40 transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Subcomponente para cada tipo de cookie ──────────────────────────────────
interface CookieTypeProps {
  title: string;
  description: string;
  always?: boolean;
}

function CookieType({ title, description, always }: CookieTypeProps) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white text-xs font-semibold">{title}</span>
          {always ? (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-club-green/20 text-club-green-light border border-club-green/30">
              Siempre activas
            </span>
          ) : null}
        </div>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ── Hook exportable para que otros componentes lean el consentimiento ────────
export function useCookieConsent(): ConsentValue {
  const stored = localStorage.getItem(COOKIE_KEY) as ConsentValue;
  return stored;
}
