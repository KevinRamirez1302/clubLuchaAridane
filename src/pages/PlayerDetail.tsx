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
  'Juvenil': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  'Cadete': 'text-teal-600 bg-teal-50 dark:bg-teal-900/20',
  'Infantil': 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20',
  'Técnico Medio': 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  'Técnico Superior': 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20',
  'Presidente': 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
  'Secretario': 'text-pink-600 bg-pink-50 dark:bg-pink-900/20',
  'Vocal': 'text-slate-600 bg-slate-100 dark:bg-slate-800',
};

const CATEGORIA_LABEL: Record<string, string> = {
  primera: 'Primera Categoría',
  segunda: 'Segunda Categoría',
  tercera: 'Tercera Categoría',
  femenina: 'Equipo Femenino',
  base: 'Equipos Base',
  'cuerpo-tecnico': 'Cuerpo Técnico',
  directiva: 'Directiva',
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
        description={`Ficha de ${luchador.nombre} — ${luchador.clasificaciones.join(' / ')} del ${luchador.equipos.map(eq => CATEGORIA_LABEL[eq] ?? eq).join(' / ')} del Club Aridane.`}
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
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gray-50 dark:bg-gray-900/30 flex items-center justify-center">
                <LazyImage
                  src={luchador.foto}
                  alt={`Foto de ${luchador.nombre}`}
                  className="w-full h-full object-contain p-6"
                />
              </div>
            </div>

            {/* Información */}
            <div className="flex flex-col justify-center">
              {/* Clasificaciones */}
              <div className="flex flex-wrap gap-2 mb-4">
                {luchador.clasificaciones.map(clas => (
                  <div key={clas} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold capitalize w-fit ${CLASIFICACION_COLOR[clas] ?? 'text-gray-600 bg-gray-100'}`}>
                    {clas}
                  </div>
                ))}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-2">
                {luchador.nombre}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                {luchador.equipos.map(eq => (
                  <Badge key={eq} variant="blue">{CATEGORIA_LABEL[eq] ?? eq}</Badge>
                ))}
                <span className="text-gray-400 text-sm">{luchador.nacionalidad}</span>
              </div>

              {/* Estadísticas */}
              {!luchador.equipos.every(eq => eq === 'directiva' || eq === 'cuerpo-tecnico') && (
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
              )}

              {/* Biografía */}
              {luchador.bio && (
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white mb-3">
                    {luchador.equipos.includes('primera') || luchador.equipos.includes('base')
                      ? 'Sobre el luchador'
                      : luchador.equipos.includes('cuerpo-tecnico')
                        ? 'Sobre el técnico'
                        : 'Sobre el directivo'}
                  </h2>
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
