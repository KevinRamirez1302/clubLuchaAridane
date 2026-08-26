// Widget de partidos: próximo partido + próximos encuentros + clasificación (Temporada 2026/2027)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import escudoAridane from '../../assets/escudo.png';

function formatFecha(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatHora(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MatchWidget() {
  const { t } = useTranslation();
  const { partidos, clasificacion, cargando } = useApp();
  const [tab, setTab] = useState<'partidos' | 'clasificacion'>('partidos');
  const ref = useScrollReveal<HTMLElement>();

  const proximoPartido = partidos.find((p) => p.esProximo) || partidos[0];
  const otrosPartidos = partidos.filter((p) => p.id !== proximoPartido?.id);

  return (
    <section
      ref={ref}
      id="proximos-partidos"
      className="reveal py-16 lg:py-20 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800"
      aria-labelledby="partidos-titulo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título de sección */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="section-line" />
            <h2 id="partidos-titulo" className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Luchadas
            </h2>
          </div>
          <span className="inline-block self-start md:self-auto bg-club-blue/10 dark:bg-club-blue/20 text-club-blue dark:text-club-blue-light text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-club-blue/20">
            Temporada 2026/2027
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximo partido */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-club-orange uppercase tracking-widest mb-6">
                {t('home.proximoPartido')}
              </p>

              {cargando ? (
                <div className="space-y-4">
                  <div className="skeleton h-6 w-40" />
                  <div className="skeleton h-16 w-full" />
                </div>
              ) : proximoPartido ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                      {proximoPartido.competicion}
                    </p>
                    <span className="text-[10px] font-bold uppercase bg-club-orange text-white px-2.5 py-0.5 rounded-full">
                      Próxima cita
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    {/* Local */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="h-16 w-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center p-2 shadow-md">
                        <img src={escudoAridane} alt="Escudo Club Aridane" className="h-full w-full object-contain" />
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold text-sm text-center">Club Aridane</span>
                      <span className="text-club-green text-xs font-semibold uppercase">
                        {proximoPartido.esLocal ? t('comun.local') : t('comun.visitante')}
                      </span>
                    </div>

                    {/* Marcador / Fecha */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-400 text-xs uppercase tracking-wide">{t('comun.vs')}</span>
                      <div className="bg-club-blue/10 border border-club-blue/20 rounded-xl px-4 py-2.5 text-center">
                        <p className="text-gray-900 dark:text-white font-bold text-sm sm:text-base capitalize">
                          {formatFecha(proximoPartido.fecha)}
                        </p>
                        <p className="text-club-orange font-black text-xl">{formatHora(proximoPartido.fecha)}</p>
                      </div>
                    </div>

                    {/* Visitante */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="h-16 w-16 bg-club-blue/10 dark:bg-gray-700 rounded-full flex items-center justify-center font-black text-club-blue dark:text-club-blue-light text-xl shadow-md">
                        {proximoPartido.rival.replace('CL ', '').slice(0, 3).toUpperCase()}
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold text-sm text-center">
                        {proximoPartido.rival}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase">
                        {proximoPartido.esLocal ? t('comun.visitante') : t('comun.local')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{t('comun.sinDatos')}</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-club-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Terrero Camilo León
              </span>
              <span className="font-semibold text-club-blue dark:text-club-blue-light">Entrada disponible en taquilla</span>
            </div>
          </div>

          {/* Próximos Encuentros + Clasificación con tabs */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-xl p-1 mb-6" role="tablist">
              {[
                { key: 'partidos', label: 'Próximos Encuentros' },
                { key: 'clasificacion', label: t('home.clasificacion') },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key as typeof tab)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                    tab === key
                      ? 'bg-club-orange text-white shadow'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Panel Próximos Encuentros */}
            {tab === 'partidos' && (
              <div role="tabpanel" className="space-y-3">
                {cargando ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-12 w-full rounded-xl" />
                  ))
                ) : otrosPartidos.length > 0 ? (
                  otrosPartidos.map((p) => {
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-600 shadow-sm"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-gray-900 dark:text-white text-xs sm:text-sm font-bold truncate">
                            {p.esLocal ? `CL Aridane vs ${p.rival}` : `${p.rival} vs CL Aridane`}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {p.competicion}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-lg">
                            {new Date(p.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-sm">{t('comun.sinDatos')}</p>
                )}
              </div>
            )}

            {/* Panel Clasificación */}
            {tab === 'clasificacion' && (
              <div role="tabpanel">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-gray-700 dark:text-gray-300">
                    <thead>
                      <tr className="text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600">
                        <th className="pb-2 text-left w-6">#</th>
                        <th className="pb-2 text-left">Equipo</th>
                        <th className="pb-2 text-center">L</th>
                        <th className="pb-2 text-center">G</th>
                        <th className="pb-2 text-center">E</th>
                        <th className="pb-2 text-center">P</th>
                        <th className="pb-2 text-center font-bold">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargando
                        ? [1, 2, 3, 4].map((i) => (
                            <tr key={i}>
                              <td colSpan={7} className="py-1">
                                <div className="skeleton h-6 w-full rounded" />
                              </td>
                            </tr>
                          ))
                        : clasificacion.map((fila) => (
                            <tr
                              key={fila.posicion}
                              className={`border-b border-gray-100 dark:border-gray-700 ${
                                fila.esClub
                                  ? 'bg-club-blue/10 dark:bg-club-blue/20 font-bold'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              }`}
                            >
                              <td className="py-2 pr-2 text-gray-500 dark:text-gray-400">{fila.posicion}</td>
                              <td className="py-2 truncate max-w-[120px]">
                                {fila.esClub ? (
                                  <span className="text-club-blue dark:text-club-blue-light font-bold">{fila.equipo}</span>
                                ) : (
                                  fila.equipo
                                )}
                              </td>
                              <td className="py-2 text-center">{fila.luchadas}</td>
                              <td className="py-2 text-center">{fila.ganadas}</td>
                              <td className="py-2 text-center">{fila.empatadas}</td>
                              <td className="py-2 text-center">{fila.perdidas}</td>
                              <td className="py-2 text-center font-bold text-gray-900 dark:text-white">{fila.puntos}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
