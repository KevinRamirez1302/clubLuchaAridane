// Franja de patrocinadores
import { useScrollReveal } from '../../hooks/useScrollReveal';
import sparLogo from '../../assets/Spar-Emblem.png';
import cabildoLogo from '../../assets/cabildo-Emblem.png';
import aytoLogo from '../../assets/aytoLlanos.png';
import trocaderoLogo from '../../assets/trocadero-Emblem.png';

export default function Sponsors() {
  const ref = useScrollReveal<HTMLElement>();

  const principal = [
    { id: 1, nombre: 'SPAR', logo: sparLogo, url: 'https://www.spar.es' }
  ];
  
  const oficial = [
    { id: 2, nombre: 'Cabildo de La Palma', logo: cabildoLogo, url: 'https://www.cabildodelapalma.es' },
    { id: 3, nombre: 'Ayuntamiento de Los Llanos de Aridane', logo: aytoLogo, url: 'https://www.aridane.org' }
  ];

  const colaborador = [
    { id: 4, nombre: 'Trocadero', logo: trocaderoLogo, url: 'https://www.trocadero.es' }
  ];

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

        <div className="space-y-12">
          {/* Patrocinador principal */}
          {principal.length > 0 && (
            <div>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Patrocinador principal</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {principal.map((p) => (
                  <a
                    key={p.id}
                    href={p.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Patrocinador: ${p.nombre}`}
                    className="opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
                  >
                    <img
                      src={p.logo}
                      alt={p.nombre}
                      className="h-16 md:h-20 object-contain dark:brightness-110"
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
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 font-medium">Patrocinadores oficiales</p>
              <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
                {oficial.map((p) => (
                  <a
                    key={p.id}
                    href={p.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Patrocinador: ${p.nombre}`}
                    className="opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
                  >
                    <img
                      src={p.logo}
                      alt={p.nombre}
                      className={`${
                        p.nombre.includes('Ayuntamiento')
                          ? 'h-16 md:h-22 scale-110'
                          : 'h-12 md:h-16'
                      } object-contain dark:brightness-110`}
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
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Colaboradores</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {colaborador.map((p) => (
                  <a
                    key={p.id}
                    href={p.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Colaborador: ${p.nombre}`}
                    className="opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
                  >
                    <img
                      src={p.logo}
                      alt={p.nombre}
                      className="h-10 md:h-12 object-contain dark:brightness-110"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
