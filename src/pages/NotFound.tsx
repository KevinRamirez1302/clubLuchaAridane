// Página 404 — Not Found
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/common/SEOHead';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead title="404 — Página no encontrada" />

      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          {/* Número 404 decorativo */}
          <div className="relative mb-8">
            <span className="font-display text-[200px] leading-none text-gray-100 dark:text-gray-800 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-club-blue/10 dark:bg-club-blue/20 rounded-full flex items-center justify-center">
                <span className="text-5xl"></span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t('errores.404titulo')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {t('errores.404descripcion')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="bg-club-blue text-white px-8 py-3.5 rounded-xl font-bold hover:bg-club-blue-dark transition-all active:scale-95 shadow-lg"
            >
              {t('errores.404cta')}
            </Link>
            <Link
              to="/contacto"
              className="text-club-blue dark:text-club-blue-light font-semibold hover:underline"
            >
              Contactar con el club
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
