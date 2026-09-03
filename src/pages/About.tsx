// Página "Quiénes somos"
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/common/SEOHead';
import { useScrollReveal } from '../hooks/useScrollReveal';

const VALORES = [
  {
    icon: (
      <svg className="w-8 h-8 text-club-orange mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    titulo: 'Nobleza',
    texto:
      'Luchamos con honor en la arena, respetando siempre las reglas y al adversario.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-club-blue mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    ),
    titulo: 'Respeto',
    texto:
      'Tratamos a rivales, árbitros, aficionados y compañeros con la máxima consideración.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-club-orange mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    titulo: 'Esfuerzo',
    texto:
      'El compromiso diario con el entrenamiento y la superación personal en cada luchada.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-club-blue mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5-3.512M9 20H4v-2a3 3 0 015-3.512M12 14a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
    titulo: 'Equipo',
    texto:
      'El colectivo siempre por delante del individuo. Apoyo constante en el terrero.',
  },
];

export default function About() {
  const { t } = useTranslation();
  const refHero = useScrollReveal<HTMLElement>();
  const refValores = useScrollReveal<HTMLElement>();

  return (
    <>
      <SEOHead
        title="Quiénes somos"
        description="Conoce la misión, valores y la identidad del Club de Lucha Aridane."
        url="/quienes-somos"
      />

      {/* Hero de la sección */}
      <section
        ref={refHero}
        className="reveal py-20 lg:py-32 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800"
        aria-label="Quiénes somos — encabezado"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-gray-900 dark:text-white mb-6">
            {t('quienesSomos.titulo')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Un club de lucha es mucho más que un equipo. Es una familia, una
            comunidad, una identidad compartida.
          </p>
        </div>
      </section>

      {/* Misión y Valores */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Misión */}
            <div>
              <div className="section-line" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('quienesSomos.mision')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {t('quienesSomos.misionTexto')}
              </p>
            </div>

            {/* Valores principales */}
            <div>
              <div className="section-line" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('quienesSomos.valores')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {t('quienesSomos.valoresTexto')}
              </p>
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
                {icon}
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
    </>
  );
}
