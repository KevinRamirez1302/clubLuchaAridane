// Página "Quiénes somos"
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/common/SEOHead';
import Timeline from '../components/about/Timeline';
import MediaGallery from '../components/about/MediaGallery';
import { useScrollReveal } from '../hooks/useScrollReveal';

const VALORES = [
  {
    icon: '',
    titulo: 'Excelencia',
    texto:
      'Buscamos la mejora continua en todo lo que hacemos, dentro y fuera del campo.',
  },
  {
    icon: '',
    titulo: 'Respeto',
    texto:
      'Tratamos a rivales, árbitros, aficionados y compañeros con la máxima consideración.',
  },
  {
    icon: '',
    titulo: 'Pasión',
    texto:
      'El amor por el fútbol y por nuestra comunidad es la fuerza que nos impulsa cada día.',
  },
  {
    icon: '',
    titulo: 'Equipo',
    texto:
      'El colectivo siempre por delante del individuo. Ganamos y perdemos juntos.',
  },
];

export default function About() {
  const { t } = useTranslation();
  const refHero = useScrollReveal<HTMLElement>();
  const refValores = useScrollReveal<HTMLElement>();
  const refGaleria = useScrollReveal<HTMLElement>();

  return (
    <>
      <SEOHead
        title="Quiénes somos"
        description="Conoce la historia del Club Aridane, nuestra misión, valores y la galería fotográfica de nuestra trayectoria desde 1958."
        url="/quienes-somos"
      />

      {/* Hero de la sección */}
      <section
        ref={refHero}
        className="reveal py-20 lg:py-32 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800"
        aria-label="Quiénes somos — encabezado"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-club-orange/15 text-club-orange border border-club-orange/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            Desde 1958
          </span>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-gray-900 dark:text-white mb-6">
            {t('quienesSomos.titulo')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Un club de lucha es mucho más que un equipo. Es una familia, una
            comunidad, una identidad compartida.
          </p>
        </div>
      </section>

      {/* Historia, Misión y Valores */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Historia */}
            <div>
              <div className="section-line" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('quienesSomos.historia')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {t('quienesSomos.historiaTexto')}
              </p>
            </div>

            {/* Misión y Valores */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('quienesSomos.mision')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('quienesSomos.misionTexto')}
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('quienesSomos.valores')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('quienesSomos.valoresTexto')}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjetas de valores */}
          <section
            ref={refValores}
            className="reveal grid grid-cols-2 lg:grid-cols-4 gap-5 mt-16"
            aria-label="Nuestros valores"
          >
            {VALORES.map(({ icon, titulo, texto }) => (
              <div
                key={titulo}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <span className="text-4xl block mb-3">{icon}</span>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  {titulo}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {texto}
                </p>
              </div>
            ))}
          </section>
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
        className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950"
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
              Fotos y momentos recientes del club. Haz clic para ampliar.
            </p>
          </div>
          <MediaGallery />
        </div>
      </section>
    </>
  );
}
