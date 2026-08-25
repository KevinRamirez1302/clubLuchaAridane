// Sección de fichajes — tarjetas de nuevos jugadores
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SigningCardSkeleton, SkeletonGrid } from '../common/Skeleton';
import Badge from '../common/Badge';
import LazyImage from '../common/LazyImage';

export default function Signings() {
  const { t } = useTranslation();
  const { fichajes, cargando } = useApp();
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950"
      aria-labelledby="fichajes-titulo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="mb-12">
          <div className="section-line" />
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <h2
              id="fichajes-titulo"
              className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white"
            >
              {t('home.fichajes')}
            </h2>
            <Badge variant="orange" className="self-start sm:self-auto mb-1">
              {t('home.fichajes_temporada')}
            </Badge>
          </div>
        </div>

        {/* Grid de fichajes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cargando ? (
            <SkeletonGrid count={4}>
              <SigningCardSkeleton />
            </SkeletonGrid>
          ) : fichajes.length > 0 ? (
            fichajes.map((jugador) => (
              <div
                key={jugador.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl card-hover border border-gray-100 dark:border-gray-700"
              >
                {/* Foto con overlay */}
                <div className="relative h-56 overflow-hidden">
                  <LazyImage
                    src={jugador.foto}
                    alt={`Foto de ${jugador.nombre}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradiente inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-club-blue/80 via-transparent to-transparent" />

                  {/* Clasificación badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="orange">{jugador.clasificacion}</Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    {jugador.nombre}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span className="text-club-blue dark:text-club-blue-light font-semibold">Procedencia:</span>
                      {jugador.procedencia}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span className="text-club-blue dark:text-club-blue-light font-semibold">Edad:</span>
                      {jugador.edad} {t('comun.años')}
                    </p>
                  </div>
                  {jugador.descripcion && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                      {jugador.descripcion}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-16">
              <p className="text-gray-400 text-lg">{t('comun.sinDatos')}</p>
              <p className="text-gray-300 text-sm mt-1">Los fichajes de la nueva temporada se anunciarán próximamente.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
