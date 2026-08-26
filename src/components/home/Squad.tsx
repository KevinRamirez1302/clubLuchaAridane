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
  { key: 'todos', label: 'Todos' },
  { key: 'Puntal A', label: 'Puntal A' },
  { key: 'Puntal B', label: 'Puntal B' },
  { key: 'Puntal C', label: 'Puntal C' },
  { key: 'Destacado A', label: 'Destacado A' },
  { key: 'Destacado B', label: 'Destacado B' },
  { key: 'Destacado C', label: 'Destacado C' },
  { key: 'No clasificado', label: 'No clasificados' },
  { key: 'Juvenil', label: 'Juvenil' },
  { key: 'Cadete', label: 'Cadete' },
  { key: 'Infantil', label: 'Infantil' },
  { key: 'Técnico Medio', label: 'Técnico Medio' },
  { key: 'Técnico Superior', label: 'Técnico Superior' },
  { key: 'Presidente', label: 'Presidente' },
  { key: 'Secretario', label: 'Secretario' },
  { key: 'Vocal', label: 'Vocal' },
];

const EQUIPOS: { key: CategoriaEquipo | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos los equipos' },
  { key: 'primera', label: 'Primera Categoría' },
  { key: 'segunda', label: 'Segunda Categoría' },
  { key: 'tercera', label: 'Tercera Categoría' },
  { key: 'femenina', label: 'Equipo Femenino' },
  { key: 'base', label: 'Equipos Base' },
  { key: 'cuerpo-tecnico', label: 'Cuerpo Técnico' },
  { key: 'directiva', label: 'Directiva' },
];

const CLASIFICACION_COLOR: Record<ClasificacionLuchador, string> = {
  'Puntal A': 'bg-club-orange',
  'Puntal B': 'bg-club-orange-light',
  'Puntal C': 'bg-yellow-500',
  'Destacado A': 'bg-club-blue',
  'Destacado B': 'bg-club-blue-light',
  'Destacado C': 'bg-cyan-500',
  'No clasificado': 'bg-gray-400',
  'Juvenil': 'bg-emerald-500',
  'Cadete': 'bg-teal-500',
  'Infantil': 'bg-indigo-500',
  'Técnico Medio': 'bg-purple-500',
  'Técnico Superior': 'bg-fuchsia-500',
  'Presidente': 'bg-rose-500',
  'Secretario': 'bg-pink-500',
  'Vocal': 'bg-slate-500',
};

// Obtiene el primer nombre y el primer apellido de un nombre completo
const getShortName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  if (parts.length === 3) return `${parts[0]} ${parts[1]}`;
  // Para 4 o más palabras, asumimos que el primer nombre es parts[0] y el primer apellido es el penúltimo.
  return `${parts[0]} ${parts[parts.length - 2]}`;
};

export default function Squad() {
  const { t } = useTranslation();
  const { plantilla, cargando } = useApp();
  const [clasificacion, setClasificacion] = useState<ClasificacionLuchador | 'todos'>('todos');
  const [equipo, setEquipo] = useState<CategoriaEquipo | 'todos'>('todos');
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const ref = useScrollReveal<HTMLElement>();

  const handleEquipoChange = (key: CategoriaEquipo | 'todos') => {
    setEquipo(key);
    setClasificacion('todos');
    setMostrarTodos(false);
  };

  const handleClasificacionChange = (key: ClasificacionLuchador | 'todos') => {
    setClasificacion(key);
    setMostrarTodos(false);
  };

  const filtrados = plantilla.filter((j) => {
    const matchClas = clasificacion === 'todos' || j.clasificaciones.includes(clasificacion as ClasificacionLuchador);
    const matchEq = equipo === 'todos' || j.equipos.includes(equipo as CategoriaEquipo);
    return matchClas && matchEq;
  });

  // Calculate available filter buttons dynamically
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

  return (
    <section
      ref={ref}
      className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950"
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

        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-10">
          {/* Filtro equipo */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por equipo">
            {equiposVisibles.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleEquipoChange(key as CategoriaEquipo | 'todos')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  equipo === key
                    ? 'bg-club-blue text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={equipo === key}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Filtro clasificación */}
          {clasificacionesVisibles.length > 1 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por clasificación">
              {clasificacionesVisibles.map(({ key, label }) => (
                <button
                key={key}
                onClick={() => handleClasificacionChange(key as ClasificacionLuchador | 'todos')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                  clasificacion === key
                    ? 'bg-club-orange text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={clasificacion === key}
              >
                {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid de jugadores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {cargando ? (
            <SkeletonGrid count={10}>
              <PlayerCardSkeleton />
            </SkeletonGrid>
          ) : filtrados.length > 0 ? (
            (mostrarTodos ? filtrados : filtrados.slice(0, 10)).map((jugador) => (
              <Link
                key={jugador.id}
                to={`/jugador/${jugador.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl card-hover block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange"
                aria-label={`Ver ficha de ${jugador.nombre}`}
              >
                {/* Foto */}
                <div className="relative h-32 overflow-hidden bg-gray-50 dark:bg-gray-900/30 flex items-center justify-center">
                  <LazyImage
                    src={jugador.foto}
                    alt={`Foto de ${jugador.nombre}`}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Clasificación color */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${CLASIFICACION_COLOR[jugador.clasificaciones[0]] || 'bg-gray-400'}`} />
                </div>

                {/* Info */}
                <div className="p-3 text-center">
                  <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">
                    {getShortName(jugador.nombre)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-0.5">
                    {jugador.clasificaciones.join(' / ')}
                  </p>
                </div>
              </Link>
            ))
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
              onClick={() => setMostrarTodos(!mostrarTodos)}
              className="px-6 py-3 bg-club-blue text-white font-semibold rounded-full hover:bg-club-blue-light transition-colors shadow-md active:scale-95 cursor-pointer"
            >
              {mostrarTodos ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        )}

        {/* Contador */}
        {!cargando && filtrados.length > 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
            Mostrando {mostrarTodos ? filtrados.length : Math.min(10, filtrados.length)} de {filtrados.length} miembro{filtrados.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </section>
  );
}
