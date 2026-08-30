import { useState, useCallback } from 'react';
import { useDataStore } from '../../store/useDataStore';
import type { PosicionClasificacion } from '../../types';

// ── Fila vacía para añadir un nuevo equipo ──
const filaVacia = (): PosicionClasificacion => ({
  posicion: 0,
  equipo: '',
  luchadas: 0,
  ganadas: 0,
  empatadas: 0,
  perdidas: 0,
  puntosFavor: 0,
  puntosContra: 0,
  puntos: 0,
  esClub: false,
});

export default function AdminStandings() {
  const { clasificacion, updateClasificacion } = useDataStore();

  // Trabajamos sobre una copia local para edición inline
  const [filas, setFilas] = useState<PosicionClasificacion[]>(() =>
    [...clasificacion].sort((a, b) => a.posicion - b.posicion)
  );
  const [guardando, setGuardando] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: 'ok' | 'error'; msg: string } | null>(null);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

  const mostrarFeedback = (tipo: 'ok' | 'error', msg: string) => {
    setFeedback({ tipo, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  // ── Actualizar campo de una fila ──
  const updateFila = useCallback(
    (idx: number, campo: keyof PosicionClasificacion, valor: string | number | boolean) => {
      setFilas((prev) => {
        const nuevas = [...prev];
        nuevas[idx] = { ...nuevas[idx], [campo]: valor };
        return nuevas;
      });
    },
    []
  );

  // ── Recalcular puntos automáticamente (ganada=2, empate=1, derrota=0) ──
  const recalcularPuntos = (idx: number, fila: PosicionClasificacion) => {
    const ganadas = Number(fila.ganadas) || 0;
    const empatadas = Number(fila.empatadas) || 0;
    const puntos = ganadas * 2 + empatadas;
    const luchadas = ganadas + empatadas + (Number(fila.perdidas) || 0);
    setFilas((prev) => {
      const nuevas = [...prev];
      nuevas[idx] = { ...nuevas[idx], puntos, luchadas };
      return nuevas;
    });
  };

  // ── Añadir equipo ──
  const addFila = () => {
    setFilas((prev) => [...prev, { ...filaVacia(), posicion: prev.length + 1 }]);
  };

  // ── Eliminar equipo ──
  const deleteFila = (idx: number) => {
    setFilas((prev) => {
      const nuevas = prev.filter((_, i) => i !== idx);
      // Reordenar posiciones
      return nuevas.map((f, i) => ({ ...f, posicion: i + 1 }));
    });
    setConfirmDeleteIdx(null);
  };

  // ── Mover fila arriba/abajo ──
  const moverFila = (idx: number, direccion: 'arriba' | 'abajo') => {
    setFilas((prev) => {
      const nuevas = [...prev];
      const destino = direccion === 'arriba' ? idx - 1 : idx + 1;
      if (destino < 0 || destino >= nuevas.length) return prev;
      [nuevas[idx], nuevas[destino]] = [nuevas[destino], nuevas[idx]];
      return nuevas.map((f, i) => ({ ...f, posicion: i + 1 }));
    });
  };

  // ── Guardar en el store ──
  const handleGuardar = async () => {
    const validas = filas.filter((f) => f.equipo.trim() !== '');
    if (validas.length === 0) {
      mostrarFeedback('error', 'Añade al menos un equipo antes de guardar.');
      return;
    }
    setGuardando(true);
    await new Promise((r) => setTimeout(r, 400));
    try {
      updateClasificacion(validas.map((f, i) => ({ ...f, posicion: i + 1 })));
      mostrarFeedback('ok', '¡Clasificación guardada y publicada correctamente!');
    } catch {
      mostrarFeedback('error', 'Error al guardar. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  // ── Ordenar automáticamente por puntos ──
  const ordenarAutomatico = () => {
    setFilas((prev) =>
      [...prev]
        .sort((a, b) => {
          if (b.puntos !== a.puntos) return b.puntos - a.puntos;
          const difA = a.puntosFavor - a.puntosContra;
          const difB = b.puntosFavor - b.puntosContra;
          return difB - difA;
        })
        .map((f, i) => ({ ...f, posicion: i + 1 }))
    );
    mostrarFeedback('ok', 'Tabla ordenada por puntos (mayor a menor).');
  };

  // ── Columnas numéricas editables ──
  const camposNum: { key: keyof PosicionClasificacion; label: string; short: string }[] = [
    { key: 'ganadas', label: 'Ganadas', short: 'G' },
    { key: 'empatadas', label: 'Empatadas', short: 'E' },
    { key: 'perdidas', label: 'Perdidas', short: 'P' },
    { key: 'puntosFavor', label: 'Pts. Favor', short: 'PF' },
    { key: 'puntosContra', label: 'Pts. Contra', short: 'PC' },
    { key: 'puntos', label: 'Puntos', short: 'Pts' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Cabecera ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tabla de Clasificación</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Edita los resultados directamente en la tabla y pulsa "Guardar"
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            id="btn-ordenar-clasificacion"
            onClick={ordenarAutomatico}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium text-sm transition"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Ordenar por puntos
          </button>
          <button
            id="btn-guardar-clasificacion"
            onClick={handleGuardar}
            disabled={guardando}
            className="inline-flex items-center gap-2 bg-club-blue hover:bg-club-blue-dark text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {guardando ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Guardar y publicar
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Feedback ── */}
      {feedback && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
            feedback.tipo === 'ok'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
          }`}
        >
          {feedback.tipo === 'ok' ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {feedback.msg}
        </div>
      )}

      {/* ── Info ── */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl px-4 py-3 text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span><strong>Consejo:</strong> Los campos <em>Luchadas</em> y <em>Puntos</em> se recalculan automáticamente al editar G/E/P. Pulsa "Guardar" cuando hayas terminado para publicar los cambios en la web.</span>
      </div>

      {/* ── Tabla editable ── */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-700/50 border-b border-gray-100 dark:border-zinc-700">
                <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10 text-center">#</th>
                <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left">Equipo</th>
                <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center w-10">J</th>
                {camposNum.map((c) => (
                  <th key={c.key} className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center w-14">
                    {c.short}
                  </th>
                ))}
                <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center w-10">Nuestro</th>
                <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-24">Orden</th>
                <th className="p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-20">Borrar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-700">
              {filas.map((fila, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    fila.esClub
                      ? 'bg-club-blue/5 dark:bg-club-blue/10'
                      : 'hover:bg-gray-50 dark:hover:bg-zinc-700/30'
                  }`}
                >
                  {/* Posición */}
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                      idx === 0 ? 'bg-yellow-400 text-white' :
                      idx === 1 ? 'bg-gray-300 dark:bg-gray-600 text-white dark:text-gray-200' :
                      idx === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>

                  {/* Equipo */}
                  <td className="p-3">
                    <input
                      type="text"
                      value={fila.equipo}
                      onChange={(e) => updateFila(idx, 'equipo', e.target.value)}
                      placeholder="Nombre del equipo..."
                      className="w-full min-w-[140px] px-3 py-1.5 border border-gray-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/40 transition"
                    />
                  </td>

                  {/* Luchadas (auto) */}
                  <td className="p-3 text-center">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-lg">
                      {fila.luchadas}
                    </span>
                  </td>

                  {/* Campos numéricos */}
                  {camposNum.map((c) => (
                    <td key={c.key} className="p-3 text-center">
                      <input
                        type="number"
                        min={0}
                        value={(fila[c.key] as number) ?? 0}
                        onChange={(e) => {
                          updateFila(idx, c.key, Number(e.target.value));
                          // Recalcular al cambiar G, E, P
                          if (['ganadas', 'empatadas', 'perdidas'].includes(c.key)) {
                            const updated = { ...fila, [c.key]: Number(e.target.value) };
                            recalcularPuntos(idx, updated);
                          }
                        }}
                        className={`w-14 text-center px-1 py-1.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-club-blue/40 transition ${
                          c.key === 'puntos'
                            ? 'border-club-blue/30 bg-club-blue/5 dark:bg-club-blue/10 dark:border-club-blue/40 text-club-blue dark:text-blue-300 font-bold'
                            : 'border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white'
                        }`}
                      />
                    </td>
                  ))}

                  {/* Es nuestro club */}
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => updateFila(idx, 'esClub', !fila.esClub)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors mx-auto ${
                        fila.esClub
                          ? 'bg-club-blue text-white'
                          : 'bg-gray-100 dark:bg-zinc-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-600'
                      }`}
                      title="Marcar como nuestro club"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  </td>

                  {/* Mover arriba/abajo */}
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => moverFila(idx, 'arriba')}
                        disabled={idx === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg disabled:opacity-30 transition"
                        title="Subir posición"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moverFila(idx, 'abajo')}
                        disabled={idx === filas.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg disabled:opacity-30 transition"
                        title="Bajar posición"
                      >
                        ↓
                      </button>
                    </div>
                  </td>

                  {/* Eliminar */}
                  <td className="p-3 text-right">
                    {confirmDeleteIdx === idx ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => deleteFila(idx)}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setConfirmDeleteIdx(null)}
                          className="px-2 py-1 text-xs bg-gray-200 dark:bg-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteIdx(idx)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Eliminar equipo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón añadir equipo */}
        <div className="p-4 border-t dark:border-zinc-700">
          <button
            id="btn-agregar-equipo"
            onClick={addFila}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-600 text-gray-500 dark:text-gray-400 hover:border-club-blue/50 hover:text-club-blue dark:hover:text-blue-400 font-medium text-sm transition"
          >
            + Añadir equipo a la clasificación
          </button>
        </div>
      </div>

      {/* Botón guardar inferior */}
      <div className="flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="inline-flex items-center gap-2 bg-club-blue hover:bg-club-blue-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {guardando ? (
            'Guardando...'
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar y publicar cambios
            </>
          )}
        </button>
      </div>
    </div>
  );
}
