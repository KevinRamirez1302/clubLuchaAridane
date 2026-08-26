// Sección de Calendario oficial del C.L. Aridane
import { useState, useMemo } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import calendarioData from '../../data/calendario.json';
import escudoAridane from '../../assets/escudo.png';

interface LuchadaCalendario {
  id: number;
  jornada: string;
  competicion: string;
  fecha: string;
  local: string;
  visitante: string;
  esLocal: boolean;
  terrero: string;
  estado: string;
  resultado: string | null;
  categoria: string;
}

function formatFecha(iso: string) {
  const date = new Date(iso);
  const dia = date.getDate();
  const mes = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
  const diaSemana = date.toLocaleDateString('es-ES', { weekday: 'short' });
  const hora = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  return { dia, mes, diaSemana, hora };
}

function generarGoogleCalendarUrl(luchada: LuchadaCalendario) {
  const inicio = new Date(luchada.fecha);
  const fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000); // 2 horas de duración

  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const title = encodeURIComponent(`Lucha Canaria: ${luchada.local} vs ${luchada.visitante}`);
  const details = encodeURIComponent(`${luchada.competicion} - ${luchada.jornada}\nTerrero: ${luchada.terrero}\nClub de Lucha Aridane`);
  const location = encodeURIComponent(luchada.terrero);
  const dates = `${formatDate(inicio)}/${formatDate(fin)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

export default function CalendarSection() {
  const ref = useScrollReveal<HTMLElement>();
  const [filtroCompeticion, setFiltroCompeticion] = useState<string>('todas');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'proximo' | 'finalizado'>('todos');
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);

  const competiciones = useMemo(() => {
    const list = Array.from(new Set(calendarioData.map((item) => item.competicion)));
    return ['todas', ...list];
  }, []);

  const luchadasFiltradas = useMemo(() => {
    return (calendarioData as LuchadaCalendario[]).filter((item) => {
      const matchComp = filtroCompeticion === 'todas' || item.competicion === filtroCompeticion;
      const matchEstado = filtroEstado === 'todos' || item.estado === filtroEstado;
      return matchComp && matchEstado;
    });
  }, [filtroCompeticion, filtroEstado]);

  const luchadasVisibles = mostrarTodos ? luchadasFiltradas : luchadasFiltradas.slice(0, 2);

  return (
    <section
      ref={ref}
      id="calendario"
      className="reveal py-16 lg:py-24 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-800"
      aria-labelledby="calendario-titulo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de la sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="section-line" />
            <h2
              id="calendario-titulo"
              className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Calendario del C.L. Aridane
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-2xl">
              Temporada 2026/2027 — Sigue todas las fechas, terreros y horarios de nuestras próximas luchadas en la Liga Insular SPAR, Liga DISA y torneos de La Palma.
            </p>
          </div>

          {/* Filtro de estado (Todos / Próximos / Finalizados) */}
          <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${filtroEstado === 'todos'
                  ? 'bg-club-blue text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroEstado('proximo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${filtroEstado === 'proximo'
                  ? 'bg-club-orange text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Próximas
            </button>
            <button
              onClick={() => setFiltroEstado('finalizado')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${filtroEstado === 'finalizado'
                  ? 'bg-club-green text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Finalizadas
            </button>
          </div>
        </div>

        {/* Filtros de competición (Pills horizontales) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {competiciones.map((comp) => (
            <button
              key={comp}
              onClick={() => setFiltroCompeticion(comp)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all border ${filtroCompeticion === comp
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
            >
              {comp === 'todas' ? 'Todas las competiciones' : comp}
            </button>
          ))}
        </div>

        {/* Lista / Grid de encuentros */}
        {luchadasFiltradas.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {luchadasVisibles.map((luchada) => {
                const { dia, mes, diaSemana, hora } = formatFecha(luchada.fecha);
                const esFinalizado = luchada.estado === 'finalizado';

                return (
                  <div
                    key={luchada.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Encabezado de la tarjeta: Competición y Jornada */}
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-700/60 mb-4">
                      <span className="text-xs font-bold text-club-blue dark:text-club-blue-light uppercase tracking-wider truncate">
                        {luchada.competicion}
                      </span>
                      <span className="text-[11px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {luchada.jornada}
                      </span>
                    </div>

                    {/* Bloque central: Equipos y Marcador / Fecha */}
                    <div className="flex items-center justify-between gap-4 my-2">
                      {/* Equipo Local */}
                      <div className="flex flex-col items-center text-center flex-1 min-w-0">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-club-blue/10 dark:bg-club-blue/20 flex items-center justify-center p-1.5 mb-2 shadow-sm group-hover:scale-105 transition-transform">
                          {luchada.local === 'CL Aridane' ? (
                            <img src={escudoAridane} alt="Escudo CL Aridane" className="h-full w-full object-contain" />
                          ) : (
                            <span className="font-bold text-club-blue text-sm">
                              {luchada.local.replace('CL ', '').slice(0, 3).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs sm:text-sm font-bold truncate max-w-full ${luchada.local === 'CL Aridane' ? 'text-club-blue dark:text-club-blue-light' : 'text-gray-900 dark:text-white'
                          }`}>
                          {luchada.local}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mt-0.5">
                          Local
                        </span>
                      </div>

                      {/* Centro: VS o Resultado */}
                      <div className="flex flex-col items-center shrink-0 px-2">
                        {esFinalizado ? (
                          <div className="bg-gray-100 dark:bg-gray-700/80 px-3.5 py-1.5 rounded-xl text-center border border-gray-200 dark:border-gray-600">
                            <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-wider">
                              {luchada.resultado}
                            </span>
                            <span className="block text-[9px] uppercase font-bold text-club-green">
                              Finalizado
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                              VS
                            </span>
                            <div className="bg-club-orange/10 dark:bg-club-orange/20 text-club-orange font-bold text-xs px-2.5 py-1 rounded-lg border border-club-orange/30">
                              {hora}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Equipo Visitante */}
                      <div className="flex flex-col items-center text-center flex-1 min-w-0">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-1.5 mb-2 shadow-sm group-hover:scale-105 transition-transform">
                          {luchada.visitante === 'CL Aridane' ? (
                            <img src={escudoAridane} alt="Escudo CL Aridane" className="h-full w-full object-contain" />
                          ) : (
                            <span className="font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-sm">
                              {luchada.visitante.replace('CL ', '').slice(0, 3).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs sm:text-sm font-bold truncate max-w-full ${luchada.visitante === 'CL Aridane' ? 'text-club-blue dark:text-club-blue-light' : 'text-gray-900 dark:text-white'
                          }`}>
                          {luchada.visitante}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mt-0.5">
                          Visitante
                        </span>
                      </div>
                    </div>

                    {/* Pie de tarjeta: Terrero, Fecha y Botón de Calendario */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{luchada.terrero}</span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="font-medium">
                          {diaSemana} {dia} {mes}
                        </span>

                        {!esFinalizado && (
                          <a
                            href={generarGoogleCalendarUrl(luchada)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Añadir a Google Calendar"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-club-blue dark:text-club-blue-light hover:underline"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Agendar
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botón Mostrar más / Mostrar menos */}
            {luchadasFiltradas.length > 2 && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setMostrarTodos(!mostrarTodos)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {mostrarTodos ? (
                    <>
                      <span>Mostrar menos</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Mostrar más luchadas (+{luchadasFiltradas.length - 2})</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 text-sm">No se encontraron luchadas con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </section>
  );
}
