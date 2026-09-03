// Página "Nuestra Historia"
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/common/SEOHead';
import Timeline from '../components/about/Timeline';
import MediaGallery from '../components/about/MediaGallery';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function History() {
  const { t } = useTranslation();
  const refHero = useScrollReveal<HTMLElement>();
  const refGaleria = useScrollReveal<HTMLElement>();

  return (
    <>
      <SEOHead
        title="Nuestra historia"
        description="Conoce la trayectoria del Club Aridane, desde su fundación en 1946 hasta hoy. Hitos, campeonatos y galería de imágenes."
        url="/nuestra-historia"
      />

      {/* Hero de la sección */}
      <section
        ref={refHero}
        className="reveal py-20 lg:py-32 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800"
        aria-label="Nuestra historia — encabezado"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-gray-900 dark:text-white mb-6">
            Desde 1946
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t('quienesSomos.historiaTexto')}
          </p>
        </div>
      </section>

      {/* Línea de tiempo */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Timeline />
        </div>
      </section>

      {/* Galería multimedia */}
      <section
        ref={refGaleria}
        className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800"
        aria-labelledby="galeria-titulo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="section-line" />
            <h2
              id="galeria-titulo"
              className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white"
            >
              {t('quienesSomos.galeria')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Fotos y momentos históricos y recientes del club. Haz clic para ampliar.
            </p>
          </div>
          <MediaGallery />
        </div>
      </section>
    </>
  );
}
