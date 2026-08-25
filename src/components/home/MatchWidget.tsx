// Widget de partidos: próximo partido + últimos resultados + clasificación
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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
  const [tab, setTab] = useState<'resultados' | 'clasificacion'>('resultados');
  const ref = useScrollReveal<HTMLElement>();

  const proximoPartido = partidos.find((p) => p.esProximo);
  const resultados = partidos.filter((p) => !p.esProximo).slice(0, 3);

  return (
    <section
      ref={ref}
      id="proximos-partidos"
      className="reveal py-16 lg:py-20 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800"
      aria-labelledby="partidos-titulo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título de sección */}
        <div className="mb-8">
          <div className="section-line" />
          <h2 id="partidos-titulo" className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Luchadas
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Próximo partido */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-bold text-club-orange uppercase tracking-widest mb-6">
              {t('home.proximoPartido')}
            </p>

            {cargando ? (
              <div className="space-y-4">
                <div className="skeleton h-6 w-40" />
                <div className="skeleton h-16 w-full" />
              </div>
            ) : proximoPartido ? (
              <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{proximoPartido.competicion}</p>
                <div className="flex items-center justify-between gap-4">
                  {/* Local */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="h-16 w-16 bg-club-blue rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      A
                    </div>
                    <span className="text-gray-900 dark:text-white font-bold text-sm text-center">Club Ariadne</span>
                    <span className="text-club-green text-xs font-semibold uppercase">
                      {proximoPartido.esLocal ? t('comun.local') : t('comun.visitante')}
                    </span>
                  </div>

                  {/* Marcador / Fecha */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">{t('comun.vs')}</span>
                    <div className="bg-club-blue/10 border border-club-blue/20 rounded-lg px-4 py-2 text-center">
                      <p className="text-gray-900 dark:text-white font-bold text-base">{formatFecha(proximoPartido.fecha)}</p>
                      <p className="text-club-orange font-bold text-xl">{formatHora(proximoPartido.fecha)}</p>
                    </div>
                  </div>

                  {/* Visitante */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <img
                      src={proximoPartido.logoRival}
                      alt={`Escudo ${proximoPartido.rival}`}
                      className="h-16 w-16 rounded-full object-cover shadow-lg"
                    />
                    <span className="text-gray-900 dark:text-white font-bold text-sm text-center">{proximoPartido.rival}</span>
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

          {/* Resultados + Clasificación con tabs */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-xl p-1 mb-6" role="tablist">
              {[
                { key: 'resultados', label: t('home.ultimosResultados') },
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

            {/* Panel Resultados */}
            {tab === 'resultados' && (
              <div role="tabpanel" className="space-y-3">
                {cargando ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-12 w-full rounded-xl" />
                  ))
                ) : resultados.length > 0 ? (
                  resultados.map((p) => {
                    const [gL, gV] = (p.resultado || '0-0').split('-').map(Number);
                    const esLocal = p.esLocal;
                    const golesAriadne = esLocal ? gL : gV;
                    const golesRival = esLocal ? gV : gL;
                    const resultado = golesAriadne > golesRival ? 'V' : golesAriadne === golesRival ? 'E' : 'D';
                    const colorResultado = resultado === 'V' ? 'text-club-green' : resultado === 'E' ? 'text-yellow-500' : 'text-red-500';

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-600"
                      >
                        <span className="text-gray-600 dark:text-gray-300 text-xs font-medium">{p.rival}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-900 dark:text-white font-bold text-sm">{p.resultado}</span>
                          <span className={`font-black text-sm w-5 text-center ${colorResultado}`}>{resultado}</span>
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
                              <td className="py-2 truncate max-w-[100px]">
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
