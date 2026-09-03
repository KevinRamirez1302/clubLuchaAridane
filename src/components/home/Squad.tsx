// Plantilla actual con filtros por posición y equipo
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { PlayerCardSkeleton, SkeletonGrid } from '../common/Skeleton';
import LazyImage from '../common/LazyImage';
import type { ClasificacionLuchador, CategoriaEquipo } from '../../types';

const CLASIFICACIONES: { key: ClasificacionLuchador | 'todos'; label: string }[] = [
  { key: 'todos',           label: 'Todos' },
  { key: 'Puntal A',        label: 'Puntal A' },
  { key: 'Puntal B',        label: 'Puntal B' },
  { key: 'Puntal C',        label: 'Puntal C' },
  { key: 'Destacado A',     label: 'Destacado A' },
  { key: 'Destacado B',     label: 'Destacado B' },
  { key: 'Destacado C',     label: 'Destacado C' },
  { key: 'No clasificado',  label: 'No clasificados' },
  { key: 'Juvenil',         label: 'Juvenil' },
  { key: 'Cadete',          label: 'Cadete' },
  { key: 'Infantil',        label: 'Infantil' },
  { key: 'Técnico Medio',   label: 'Técnico Medio' },
  { key: 'Técnico Superior',label: 'Técnico Superior' },
  { key: 'Presidente',      label: 'Presidente' },
  { key: 'Secretario',      label: 'Secretario' },
  { key: 'Vocal',           label: 'Vocal' },
];

const EQUIPOS: { key: CategoriaEquipo | 'todos'; label: string }[] = [
  { key: 'todos',          label: 'Todos los equipos' },
  { key: 'primera',        label: 'Primera Categoría' },
  { key: 'segunda',        label: 'Segunda Categoría' },
  { key: 'tercera',        label: 'Tercera Categoría' },
  { key: 'femenina',       label: 'Equipo Femenino' },
  { key: 'base',           label: 'Equipos Base' },
  { key: 'cuerpo-tecnico', label: 'Cuerpo Técnico' },
  { key: 'directiva',      label: 'Directiva' },
];

// Colores en HEX para usarlos como inline styles (evita problemas con clases dinámicas de Tailwind)
const CLASIFICACION_HEX: Record<ClasificacionLuchador, string> = {
  'Puntal A':         '#E87722',
  'Puntal B':         '#fb923c',
  'Puntal C':         '#eab308',
  'Destacado A':      '#0B3D91',
  'Destacado B':      '#3b82f6',
  'Destacado C':      '#06b6d4',
  'No clasificado':   '#6b7280',
  'Juvenil':          '#10b981',
  'Cadete':           '#14b8a6',
  'Infantil':         '#6366f1',
  'Técnico Medio':    '#a855f7',
  'Técnico Superior': '#d946ef',
  'Presidente':       '#f43f5e',
  'Secretario':       '#ec4899',
  'Vocal':            '#94a3b8',
};

const getShortName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  if (parts.length === 3) return `${parts[0]} ${parts[1]}`;
  return `${parts[0]} ${parts[parts.length - 2]}`;
};

export default function Squad() {
  const { t } = useTranslation();
  const { plantilla, cargando } = useApp();
  const [clasificacion, setClasificacion] = useState<ClasificacionLuchador | 'todos'>('todos');
  const [equipo, setEquipo] = useState<CategoriaEquipo | 'todos'>('todos');
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [filterKey, setFilterKey] = useState(0);
  const ref = useScrollReveal<HTMLElement>();

  const handleEquipoChange = (key: CategoriaEquipo | 'todos') => {
    setEquipo(key);
    setClasificacion('todos');
    setMostrarTodos(false);
    setFilterKey((k) => k + 1);
  };

  const handleClasificacionChange = (key: ClasificacionLuchador | 'todos') => {
    setClasificacion(key);
    setMostrarTodos(false);
    setFilterKey((k) => k + 1);
  };

  const handleToggleMostrar = () => {
    if (mostrarTodos) {
      setMostrarTodos(false);
      setTimeout(() => {
        const el = document.getElementById('plantilla');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      setMostrarTodos(true);
    }
  };

  const filtrados = plantilla.filter((j) => {
    const matchClas = clasificacion === 'todos' || j.clasificaciones.includes(clasificacion as ClasificacionLuchador);
    const matchEq   = equipo === 'todos' || j.equipos.includes(equipo as CategoriaEquipo);
    return matchClas && matchEq;
  });

  const availableEquiposSet = new Set(plantilla.flatMap((j) => j.equipos));
  const equiposVisibles = EQUIPOS.filter(
    (e) => e.key === 'todos' || availableEquiposSet.has(e.key as CategoriaEquipo)
  );

  const plantillaFiltradaPorEquipo = plantilla.filter(
    (j) => equipo === 'todos' || j.equipos.includes(equipo as CategoriaEquipo)
  );
  const availableClasSet = new Set(plantillaFiltradaPorEquipo.flatMap((j) => j.clasificaciones));
  const clasificacionesVisibles = CLASIFICACIONES.filter(
    (c) => c.key === 'todos' || availableClasSet.has(c.key as ClasificacionLuchador)
  );

  const visibles = mostrarTodos ? filtrados : filtrados.slice(0, 10);

  return (
    <section
      ref={ref}
      id="plantilla"
      className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950 scroll-mt-20 lg:scroll-mt-24"
      aria-labelledby="plantilla-titulo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabecera */}
        <div className="mb-10">
          <div className="section-line" />
          <h2
            id="plantilla-titulo"
            className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white"
          >
            {t('home.plantilla')}
          </h2>
        </div>

        {/* ── Filtros ── */}
        <div className="flex flex-col gap-3 mb-10">

          {/* Fila 1: Equipos */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por equipo">
            {equiposVisibles.map(({ key, label }) => (
              <button
                key={key}
                id={`filter-equipo-${key}`}
                onClick={() => handleEquipoChange(key as CategoriaEquipo | 'todos')}
                aria-pressed={equipo === key}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  equipo === key
                    ? 'bg-club-blue text-white shadow-lg border-club-blue scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Fila 2: Clasificaciones */}
          {clasificacionesVisibles.length > 1 && (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por clasificación">
              {clasificacionesVisibles.map(({ key, label }) => (
                <button
                  key={key}
                  id={`filter-clas-${key}`}
                  onClick={() => handleClasificacionChange(key as ClasificacionLuchador | 'todos')}
                  aria-pressed={clasificacion === key}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer border ${
                    clasificacion === key
                      ? 'bg-club-orange text-white shadow-md border-club-orange scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Grid de jugadores ── */}
        <div
          key={filterKey}
          className="squad-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5"
        >
          {cargando ? (
            <SkeletonGrid count={10}>
              <PlayerCardSkeleton />
            </SkeletonGrid>
          ) : filtrados.length > 0 ? (
            visibles.map((jugador, index) => {
              const accentColor = CLASIFICACION_HEX[jugador.clasificaciones[0]] ?? '#6b7280';
              return (
                <Link
                  key={jugador.id}
                  to={`/jugador/${jugador.id}`}
                  className="group player-card block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange card-flip-in"
                  style={{ animationDelay: `${index * 70}ms` }}
                  aria-label={`Ver ficha de ${jugador.nombre}`}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-950 shadow-lg player-card-inner"
                    style={{ borderTop: `3px solid ${accentColor}` }}
                  >
                    {/* Zona de foto */}
                    <div className="relative h-44 overflow-hidden flex items-end justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
                      {/* Círculo de luz de acento detrás del jugador */}
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
                        style={{ backgroundColor: accentColor }}
                      />
                      <LazyImage
                        src={jugador.foto}
                        alt={`Foto de ${jugador.nombre}`}
                        className="relative z-10 w-full h-full object-contain object-bottom p-3 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                      />
                      {/* Gradiente inferior */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                    </div>

                    {/* Panel de info */}
                    <div className="relative px-3 pb-3 pt-2 bg-gray-900 dark:bg-gray-950 text-center">
                      {/* Línea de acento */}
                      <div
                        className="absolute top-0 left-3 right-3 h-px opacity-50"
                        style={{ backgroundColor: accentColor }}
                      />
                      <p className="font-black text-white text-sm leading-tight truncate tracking-wide uppercase mt-1">
                        {getShortName(jugador.nombre)}
                      </p>
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest mt-1 truncate"
                        style={{ color: accentColor }}
                      >
                        {jugador.clasificaciones[0]}
                      </p>
                    </div>

                    {/* Overlay glow en hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none player-hover-glow" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-5 text-center py-16">
              <p className="text-gray-400 text-lg">{t('comun.sinDatos')}</p>
            </div>
          )}
        </div>

        {/* Botón Ver más */}
        {!cargando && filtrados.length > 10 && (
          <div className="flex justify-center mt-10">
            <button
              id="squad-ver-mas-btn"
              onClick={handleToggleMostrar}
              className="px-8 py-3 bg-club-blue text-white font-semibold rounded-full hover:bg-club-blue-light transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              {mostrarTodos ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        )}

        {/* Contador */}
        {!cargando && filtrados.length > 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-6">
            Mostrando {mostrarTodos ? filtrados.length : Math.min(10, filtrados.length)} de {filtrados.length} miembro{filtrados.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </section>
  );
}
