import { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import type { Partido } from '../../types';

const partidoVacio: Omit<Partido, 'id'> = {
  esLocal: true,
  rival: '',
  logoRival: '',
  competicion: '',
  fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  resultado: null,
  esProximo: false,
};

export default function AdminNextMatch() {
  const store = useDataStore();
  const { partidos } = store;

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Partido, 'id'>>(partidoVacio);
  const [guardando, setGuardando] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: 'ok' | 'error'; msg: string } | null>(null);

  const mostrarFeedback = (tipo: 'ok' | 'error', msg: string) => {
    setFeedback({ tipo, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  const partidosOrdenados = [...partidos].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const proximoPartido = partidosOrdenados.find((p) => p.esProximo);

  const abrirCrear = () => {
    setEditandoId(null);
    setForm(partidoVacio);
    setModalAbierto(true);
  };

  const abrirEditar = (p: Partido) => {
    setEditandoId(p.id);
    setForm({
      esLocal: p.esLocal,
      rival: p.rival,
      logoRival: p.logoRival,
      competicion: p.competicion,
      fecha: p.fecha.slice(0, 16),
      resultado: p.resultado ?? null,
      esProximo: p.esProximo,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoId(null);
    setForm(partidoVacio);
  };

  // ── Marcar como próxima luchada (solo uno puede serlo) ──
  const marcarComoProximo = (id: number) => {
    partidos.forEach((p) => {
      store.updatePartido(p.id, { esProximo: p.id === id });
    });
    mostrarFeedback('ok', '¡Próxima luchada actualizada!');
  };

  // ── Eliminar luchada ──
  const handleDelete = (id: number) => {
    useDataStore.setState((state) => ({
      partidos: state.partidos.filter((p) => p.id !== id),
    }));
    setConfirmDeleteId(null);
    mostrarFeedback('ok', 'Luchada eliminada del calendario.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rival.trim() || !form.competicion.trim()) {
      mostrarFeedback('error', 'El rival y la competición son obligatorios.');
      return;
    }

    setGuardando(true);
    await new Promise((r) => setTimeout(r, 400));

    try {
      const data: Omit<Partido, 'id'> = {
        ...form,
        fecha: new Date(form.fecha).toISOString(),
      };

      // Si se marca como próximo, desmarcar los demás
      if (data.esProximo) {
        partidos.forEach((p) => {
          if (p.id !== editandoId) store.updatePartido(p.id, { esProximo: false });
        });
      }

      if (editandoId !== null) {
        store.updatePartido(editandoId, data);
        mostrarFeedback('ok', '¡Luchada actualizada correctamente!');
      } else {
        store.addPartido(data);
        mostrarFeedback('ok', '¡Nueva luchada añadida al calendario!');
      }
      cerrarModal();
    } catch {
      mostrarFeedback('error', 'Error al guardar. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* ── Cabecera ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Próxima Luchada & Calendario</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {partidos.length} luchada{partidos.length !== 1 ? 's' : ''} en el calendario
          </p>
        </div>
        <button
          id="btn-agregar-luchada"
          onClick={abrirCrear}
          className="inline-flex items-center gap-2 bg-club-blue hover:bg-club-blue-dark text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow hover:shadow-lg hover:-translate-y-0.5"
        >
          <span className="text-lg">+</span> Añadir Luchada
        </button>
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

      {/* ── Tarjeta Próxima Luchada Destacada ── */}
      {proximoPartido ? (
        <div className="bg-gradient-to-r from-club-blue to-club-blue-light text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Próxima Luchada
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm mb-1">{proximoPartido.competicion}</p>
              <p className="text-2xl font-bold">
                {proximoPartido.esLocal ? 'Club Aridane' : proximoPartido.rival}
                <span className="text-white/60 font-normal mx-3">vs</span>
                {proximoPartido.esLocal ? proximoPartido.rival : 'Club Aridane'}
              </p>
              <p className="text-white/70 mt-2 text-sm flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatFecha(proximoPartido.fecha)}
              </p>
              <p className="text-white/70 text-sm">
                {proximoPartido.esLocal ? 'Local — Terrero Camilo León' : 'Visitante'}
              </p>
            </div>
            <button
              onClick={() => abrirEditar(proximoPartido)}
              className="self-start sm:self-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Editar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          No hay ninguna luchada marcada como "próxima". Pulsa el botón de destacar en la tabla para fijar una.
        </div>
      )}

      {/* ── Tabla de Calendario ── */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-700">
        {partidosOrdenados.length === 0 ? (
          <div className="p-12 text-center text-gray-400 dark:text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">No hay luchadas en el calendario</p>
            <button onClick={abrirCrear} className="mt-4 text-club-blue dark:text-blue-400 underline text-sm">
              Añadir la primera luchada
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700/50 border-b border-gray-100 dark:border-zinc-700">
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Luchada</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Fecha</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Campo</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Resultado</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Próxima</th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-700">
                {partidosOrdenados.map((p) => (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      p.esProximo
                        ? 'bg-club-blue/5 dark:bg-club-blue/10'
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-700/30'
                    }`}
                  >
                    {/* Luchada */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.logoRival ? (
                          <img
                            src={p.logoRival}
                            alt={p.rival}
                            className="w-10 h-10 object-contain rounded-lg bg-gray-100 dark:bg-zinc-700 flex-shrink-0 p-1"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">vs {p.rival}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{p.competicion}</p>
                        </div>
                      </div>
                    </td>
                    {/* Fecha */}
                    <td className="p-4 hidden sm:table-cell text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(p.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    {/* Campo */}
                    <td className="p-4 hidden md:table-cell text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.esLocal
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                      }`}>
                        {p.esLocal ? 'Local' : 'Visitante'}
                      </span>
                    </td>
                    {/* Resultado */}
                    <td className="p-4 hidden md:table-cell text-center">
                      {p.resultado ? (
                        <span className="font-mono font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded-lg text-sm">
                          {p.resultado}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">Pendiente</span>
                      )}
                    </td>
                    {/* Marcar como próxima */}
                    <td className="p-4 text-center">
                      <button
                        id={`btn-proximo-${p.id}`}
                        onClick={() => marcarComoProximo(p.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          p.esProximo
                            ? 'bg-club-blue text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-zinc-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-600'
                        }`}
                        title={p.esProximo ? 'Es la próxima luchada' : 'Marcar como próxima'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </button>
                    </td>
                    {/* Acciones */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-editar-luchada-${p.id}`}
                          onClick={() => abrirEditar(p)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        {confirmDeleteId === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`btn-eliminar-luchada-${p.id}`}
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Crear / Editar ── */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-zinc-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editandoId !== null ? 'Editar Luchada' : 'Nueva Luchada'}
              </h2>
              <button
                onClick={cerrarModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition"
                title="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form id="form-luchada" onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Rival */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Rival <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-rival"
                  type="text"
                  value={form.rival}
                  onChange={(e) => setForm({ ...form, rival: e.target.value })}
                  placeholder="Ej: CL Tegueste"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  required
                />
              </div>

              {/* Logo del rival */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  URL del logo del rival
                </label>
                <input
                  id="input-logo-rival"
                  type="text"
                  value={form.logoRival}
                  onChange={(e) => setForm({ ...form, logoRival: e.target.value })}
                  placeholder="https://... o /images/..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                />
                {form.logoRival && (
                  <img
                    src={form.logoRival}
                    alt="preview logo"
                    className="mt-2 h-14 w-14 object-contain rounded-lg bg-gray-100 dark:bg-zinc-700 p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Competición */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Competición <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-competicion"
                  type="text"
                  value={form.competicion}
                  onChange={(e) => setForm({ ...form, competicion: e.target.value })}
                  placeholder="Ej: Liga Insular SPAR - Jornada 4"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  required
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Fecha y hora <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-fecha-luchada"
                  type="datetime-local"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  required
                />
              </div>

              {/* Local / Visitante */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campo</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, esLocal: true })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      form.esLocal
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700'
                    }`}
                  >
                    Local
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, esLocal: false })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      !form.esLocal
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700'
                    }`}
                  >
                    Visitante
                  </button>
                </div>
              </div>

              {/* Resultado */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Resultado{' '}
                  <span className="text-xs font-normal text-gray-400">(dejar vacío si es futura)</span>
                </label>
                <input
                  id="input-resultado"
                  type="text"
                  value={form.resultado ?? ''}
                  onChange={(e) => setForm({ ...form, resultado: e.target.value || null })}
                  placeholder="Ej: 12-10"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                />
              </div>

              {/* Toggle: Próxima luchada */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Marcar como próxima luchada</p>
                  <p className="text-xs text-gray-400 mt-0.5">Se mostrará destacada en la web principal</p>
                </div>
                <button
                  type="button"
                  id="toggle-proximo"
                  onClick={() => setForm({ ...form, esProximo: !form.esProximo })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    form.esProximo ? 'bg-club-blue' : 'bg-gray-300 dark:bg-zinc-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.esProximo ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t dark:border-zinc-700">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  id="btn-guardar-luchada"
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2.5 rounded-xl bg-club-blue hover:bg-club-blue-dark text-white font-semibold transition-all shadow hover:shadow-md disabled:opacity-60 flex items-center gap-2"
                >
                  {guardando ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Guardando...
                    </>
                  ) : editandoId !== null ? (
                    'Guardar cambios'
                  ) : (
                    'Añadir al calendario'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
