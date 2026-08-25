// Página de ficha individual de luchador — /luchador/:id
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SEOHead from '../components/common/SEOHead';
import Badge from '../components/common/Badge';
import LazyImage from '../components/common/LazyImage';
import { Skeleton } from '../components/common/Skeleton';

const CLASIFICACION_COLOR: Record<string, string> = {
  'Puntal A': 'text-club-orange bg-club-orange/10',
  'Puntal B': 'text-club-orange bg-club-orange/10',
  'Puntal C': 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  'Destacado A': 'text-club-blue bg-club-blue/10',
  'Destacado B': 'text-club-blue bg-club-blue/10',
  'Destacado C': 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20',
  'No clasificado': 'text-gray-600 bg-gray-100 dark:bg-gray-800',
};

const CATEGORIA_LABEL: Record<string, string> = {
  primera: 'Primera Categoría',
  segunda: 'Segunda Categoría',
  tercera: 'Tercera Categoría',
  femenina: 'Equipo Femenino',
  base: 'Equipos Base',
};

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const { plantilla, cargando } = useApp();

  if (cargando) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <Skeleton className="h-96 rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const luchador = plantilla.find((j) => j.id === Number(id));
  if (!luchador) return <Navigate to="/404" replace />;

  const stats = [
    { label: 'Luchadas', valor: luchador.luchadas ?? '—' },
    { label: 'Puntos a favor', valor: luchador.puntosFavor ?? '—' },
    { label: 'Puntos en contra', valor: luchador.puntosContra ?? '—' },
    { label: 'Edad', valor: `${luchador.edad} años` },
    { label: 'Peso', valor: luchador.peso ? `${luchador.peso} kg` : '—' },
    { label: 'Altura', valor: luchador.altura ? `${luchador.altura} cm` : '—' },
  ];

  return (
    <>
      <SEOHead
        title={luchador.nombre}
        description={`Ficha de ${luchador.nombre} — ${luchador.clasificacion} del ${CATEGORIA_LABEL[luchador.equipo] ?? luchador.equipo} del Club Ariadne.`}
        image={luchador.foto}
        url={`/jugador/${luchador.id}`}
      />

      <div className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-club-blue transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/#plantilla" className="hover:text-club-blue transition-colors">Plantilla</Link>
            <span>/</span>
            <span className="text-gray-600 dark:text-gray-300">{luchador.nombre}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Foto */}
            <div className="relative">
              {/* Fondo decorativo */}
              <div className="absolute inset-0 bg-gradient-to-br from-club-blue/10 to-club-orange/10 rounded-3xl" />
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <LazyImage
                  src={luchador.foto}
                  alt={`Foto de ${luchador.nombre}`}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Información */}
            <div className="flex flex-col justify-center">
              {/* Clasificación */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold capitalize mb-4 w-fit ${CLASIFICACION_COLOR[luchador.clasificacion] ?? 'text-gray-600 bg-gray-100'}`}>
                {luchador.clasificacion}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-2">
                {luchador.nombre}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Badge variant="blue">{CATEGORIA_LABEL[luchador.equipo] ?? luchador.equipo}</Badge>
                <span className="text-gray-400 text-sm">{luchador.nacionalidad}</span>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {stats.map(({ label, valor }) => (
                  <div
                    key={label}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-2xl sm:text-3xl font-black text-club-blue dark:text-club-blue-light">
                      {valor}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Biografía */}
              {luchador.bio && (
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white mb-3">Sobre el luchador</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{luchador.bio}</p>
                </div>
              )}

              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 text-club-blue dark:text-club-blue-light font-semibold hover:gap-3 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a la plantilla
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
