// Línea de tiempo histórica del club — iterable, no hardcodeada
import { useApp } from '../../context/AppContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import LazyImage from '../common/LazyImage';
import { Skeleton } from '../common/Skeleton';

export default function Timeline() {
  const { historia, cargando } = useApp();
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal"
      aria-labelledby="timeline-titulo"
    >
      <h3 id="timeline-titulo" className="text-2xl font-bold text-gray-900 dark:text-white mb-10">
        Nuestra historia
      </h3>

      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-club-blue via-club-orange to-club-green" />

        <div className="space-y-12">
          {cargando ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="flex gap-8 pl-12 sm:pl-0">
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ))
          ) : (
            historia.map((hito, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={hito.id}
                  className={`relative flex items-center gap-8 ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  } flex-col sm:flex-row pl-12 sm:pl-0`}
                >
                  {/* Punto en la línea */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 bg-club-orange rounded-full border-2 border-white dark:border-gray-950 shadow-lg -translate-x-1/2 z-10 top-6 sm:top-1/2 sm:-translate-y-1/2" />

                  {/* Tarjeta */}
                  <div
                    className={`flex-1 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 sm:max-w-[calc(50%-2rem)] ${
                      isLeft ? 'sm:mr-8' : 'sm:ml-8'
                    }`}
                  >
                    {hito.imagen && (
                      <div className="h-40 overflow-hidden">
                        <LazyImage
                          src={hito.imagen}
                          alt={hito.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <span className="inline-block bg-club-blue text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                        {hito.año}
                      </span>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base mb-2">
                        {hito.titulo}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        {hito.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Spacer del lado opuesto */}
                  <div className="hidden sm:block flex-1" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
