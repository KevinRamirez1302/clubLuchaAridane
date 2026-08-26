// Página "Quiénes somos"
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/common/SEOHead';
import { useScrollReveal } from '../hooks/useScrollReveal';

const VALORES = [
  {
    icon: '🤝',
    titulo: 'Nobleza',
    texto:
      'Luchamos con honor en la arena, respetando siempre las reglas y al adversario.',
  },
  {
    icon: '🤝',
    titulo: 'Respeto',
    texto:
      'Tratamos a rivales, árbitros, aficionados y compañeros con la máxima consideración.',
  },
  {
    icon: '💪',
    titulo: 'Esfuerzo',
    texto:
      'El compromiso diario con el entrenamiento y la superación personal en cada luchada.',
  },
  {
    icon: '👥',
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
          <span className="inline-block bg-club-orange/15 text-club-orange border border-club-orange/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            Sobre nosotros
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
    </>
  );
}
