// Suscripción al boletín de noticias
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const ref = useScrollReveal<HTMLElement>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('errores.emailInvalido'));
      return;
    }

    setCargando(true);

    // ── INTEGRACIÓN BACKEND: enviar email a la API ──
    // Ejemplo: await fetch('/api/newsletter/suscribir', { method: 'POST', body: JSON.stringify({ email }) })
    await new Promise((r) => setTimeout(r, 800));

    setCargando(false);
    setEnviado(true);
  };

  return (
    <section
      ref={ref}
      className="reveal py-20 lg:py-28 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
      aria-labelledby="newsletter-titulo"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        {/* Icono */}
        <div className="w-16 h-16 bg-club-blue/10 dark:bg-club-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-club-blue dark:text-club-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Línea decorativa */}
        <div className="section-line mx-auto inline-block mb-2" />

        <h2
          id="newsletter-titulo"
          className="font-display text-4xl sm:text-5xl text-gray-900 dark:text-white mb-3"
        >
          {t('home.newsletter.titulo')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
          {t('home.newsletter.subtitulo')}
        </p>

        {enviado ? (
          <div className="bg-club-green/10 border border-club-green/30 rounded-2xl px-8 py-6">
            <div className="w-12 h-12 bg-club-green rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-xl text-gray-900 dark:text-white">{t('home.newsletter.exito')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t('home.newsletter.placeholder')}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('home.newsletter.placeholder')}
                  required
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  aria-invalid={!!error}
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-club-blue dark:focus:border-club-blue-light transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={cargando}
                className="bg-club-orange text-white px-7 py-3.5 rounded-xl font-bold hover:bg-club-orange-dark transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap flex items-center gap-2 justify-center shadow-lg"
              >
                {cargando && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {t('home.newsletter.boton')}
              </button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="text-red-500 text-sm mt-2 text-left">
                {error}
              </p>
            )}
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">{t('home.newsletter.aviso')}</p>
          </form>
        )}
      </div>
    </section>
  );
}
