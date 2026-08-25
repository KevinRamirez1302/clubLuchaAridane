// Franja de patrocinadores
import { useApp } from '../../context/AppContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function Sponsors() {
  const { patrocinadores, cargando } = useApp();
  const ref = useScrollReveal<HTMLElement>();

  const principal = patrocinadores.filter((p) => p.nivel === 'principal');
  const oficial = patrocinadores.filter((p) => p.nivel === 'oficial');
  const colaborador = patrocinadores.filter((p) => p.nivel === 'colaborador');

  return (
    <section
      ref={ref}
      className="reveal py-14 lg:py-20 bg-white dark:bg-gray-950"
      aria-labelledby="patrocinadores-titulo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="patrocinadores-titulo"
          className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-10"
        >
          Nuestros patrocinadores
        </h2>

        {cargando ? (
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-10 w-32 rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Patrocinador principal */}
            {principal.length > 0 && (
              <div>
                <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-4">Patrocinador principal</p>
                <div className="flex flex-wrap justify-center gap-8">
                  {principal.map((p) => (
                    <a
                      key={p.id}
                      href={p.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Patrocinador: ${p.nombre}`}
                      className="opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-300"
                    >
                      <img
                        src={p.logo}
                        alt={p.nombre}
                        className="h-12 object-contain"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Patrocinadores oficiales */}
            {oficial.length > 0 && (
              <div>
                <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-4">Patrocinadores oficiales</p>
                <div className="flex flex-wrap justify-center gap-6">
                  {oficial.map((p) => (
                    <a
                      key={p.id}
                      href={p.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Patrocinador: ${p.nombre}`}
                      className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-300"
                    >
                      <img
                        src={p.logo}
                        alt={p.nombre}
                        className="h-9 object-contain"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Colaboradores */}
            {colaborador.length > 0 && (
              <div>
                <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-4">Colaboradores</p>
                <div className="flex flex-wrap justify-center gap-5">
                  {colaborador.map((p) => (
                    <a
                      key={p.id}
                      href={p.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Colaborador: ${p.nombre}`}
                      className="opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-300"
                    >
                      <img
                        src={p.logo}
                        alt={p.nombre}
                        className="h-7 object-contain"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
