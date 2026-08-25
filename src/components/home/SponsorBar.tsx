import sparLogo from '../../assets/Spar-Emblem.png';
import cabildoLogo from '../../assets/cabildo-Emblem.png';
import aytoLogo from '../../assets/aytoLlanos.jpg';
import trocaderoLogo from '../../assets/trocadero-Emblem.png';

export default function SponsorBar() {
  const sponsors = [
    { name: 'SPAR', logo: sparLogo, url: 'https://www.spar.es' },
    { name: 'Cabildo de La Palma', logo: cabildoLogo, url: 'https://www.cabildodelapalma.es' },
    { name: 'Ayuntamiento de Los Llanos de Aridane', logo: aytoLogo, url: 'https://www.aridane.org' },
    { name: 'Trocadero', logo: trocaderoLogo, url: 'https://www.trocadero.es' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900/40 border-y border-gray-150 dark:border-gray-800/60 py-6 sm:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
          Patrocinadores Principales
        </p>
        
        <div className="relative overflow-hidden w-full">
          {/* Degradados de desvanecimiento en los bordes laterales */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-gray-50 dark:from-gray-900/40 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-gray-50 dark:from-gray-900/40 to-transparent pointer-events-none z-10" />

          {/* Contenedor del carrusel animado */}
          <div className="animate-marquee flex items-center gap-12 sm:gap-20 md:gap-24 py-2">
            {/* Primer set de patrocinadores */}
            {sponsors.map((sponsor, index) => (
              <a
                key={`${sponsor.name}-set1-${index}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center transition-all duration-300 transform hover:scale-105 shrink-0"
              >
                <img
                  src={sponsor.logo}
                  alt={`Logo de ${sponsor.name}`}
                  className="h-10 sm:h-12 md:h-14 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 dark:brightness-110 dark:contrast-105 dark:group-hover:brightness-100 transition-all duration-300"
                />
              </a>
            ))}
            {/* Segundo set duplicado para crear el loop infinito */}
            {sponsors.map((sponsor, index) => (
              <a
                key={`${sponsor.name}-set2-${index}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center transition-all duration-300 transform hover:scale-105 shrink-0"
              >
                <img
                  src={sponsor.logo}
                  alt={`Logo de ${sponsor.name}`}
                  className="h-10 sm:h-12 md:h-14 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 dark:brightness-110 dark:contrast-105 dark:group-hover:brightness-100 transition-all duration-300"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
