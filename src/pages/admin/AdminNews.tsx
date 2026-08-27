import { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import type { Noticia } from '../../types';

// ── Valores vacíos para el formulario de nueva noticia ──
const noticiaVacia: Omit<Noticia, 'id'> = {
  titulo: '',
  resumen: '',
  contenido: '',
  imagen: '',
  fecha: new Date().toISOString().slice(0, 16),
  categoria: 'club',
  autor: '',
};

type FormMode = 'crear' | 'editar';

export default function AdminNews() {
  const { noticias, addNoticia, updateNoticia, deleteNoticia } = useDataStore();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoForm, setModoForm] = useState<FormMode>('crear');
  const [noticiaEditando, setNoticiaEditando] = useState<Noticia | null>(null);
  const [form, setForm] = useState<Omit<Noticia, 'id'>>(noticiaVacia);
  const [guardando, setGuardando] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [feedback, setFeedback] = useState<{ tipo: 'ok' | 'error'; msg: string } | null>(null);

  // ── Filtrado de noticias ──
  const noticiasFiltradas = noticias.filter(
    (n) =>
      n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      n.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
      n.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const mostrarFeedback = (tipo: 'ok' | 'error', msg: string) => {
    setFeedback({ tipo, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  // ── Abrir modal ──
  const abrirCrear = () => {
    setModoForm('crear');
    setForm(noticiaVacia);
    setNoticiaEditando(null);
    setModalAbierto(true);
  };

  const abrirEditar = (noticia: Noticia) => {
    setModoForm('editar');
    setNoticiaEditando(noticia);
    setForm({
      titulo: noticia.titulo,
      resumen: noticia.resumen,
      contenido: noticia.contenido,
      imagen: noticia.imagen,
      fecha: noticia.fecha.slice(0, 16),
      categoria: noticia.categoria,
      autor: noticia.autor,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setNoticiaEditando(null);
    setForm(noticiaVacia);
  };

  // ── Submit del formulario ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.resumen.trim() || !form.contenido.trim() || !form.autor.trim()) {
      mostrarFeedback('error', 'Por favor rellena todos los campos obligatorios.');
      return;
    }

    setGuardando(true);
    // Simulamos una pequeña latencia (reemplazar por fetch a tu API en el futuro)
    await new Promise((r) => setTimeout(r, 400));

    try {
      if (modoForm === 'crear') {
        addNoticia({ ...form, fecha: new Date(form.fecha).toISOString() });
        mostrarFeedback('ok', '¡Noticia creada correctamente!');
      } else if (noticiaEditando) {
        updateNoticia(noticiaEditando.id, { ...form, fecha: new Date(form.fecha).toISOString() });
        mostrarFeedback('ok', '¡Noticia actualizada correctamente!');
      }
      cerrarModal();
    } catch {
      mostrarFeedback('error', 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  // ── Eliminar noticia ──
  const handleDelete = (id: number) => {
    deleteNoticia(id);
    setConfirmDelete(null);
    mostrarFeedback('ok', 'Noticia eliminada.');
  };

  const categoriaColor: Record<string, string> = {
    club: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    competicion: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    fichaje: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    institucional: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  };

  return (
    <div className="space-y-6">
      {/* ── Cabecera ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Noticias</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {noticias.length} noticia{noticias.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <button
          id="btn-crear-noticia"
          onClick={abrirCrear}
          className="inline-flex items-center gap-2 bg-club-blue hover:bg-club-blue-dark text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow hover:shadow-lg hover:-translate-y-0.5"
        >
          <span className="text-lg">+</span> Nueva Noticia
        </button>
      </div>

      {/* ── Toast de feedback ── */}
      {feedback && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium animate-pulse ${
            feedback.tipo === 'ok'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
          }`}
        >
          <span>{feedback.tipo === 'ok' ? '✅' : '❌'}</span>
          {feedback.msg}
        </div>
      )}

      {/* ── Buscador ── */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          id="buscar-noticias"
          type="text"
          placeholder="Buscar por título, autor o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
        />
      </div>

      {/* ── Tabla de noticias ── */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-700">
        {noticiasFiltradas.length === 0 ? (
          <div className="p-12 text-center text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-lg font-medium">
              {busqueda ? 'Sin resultados para tu búsqueda' : 'No hay noticias todavía'}
            </p>
            {!busqueda && (
              <button
                onClick={abrirCrear}
                className="mt-4 text-club-blue dark:text-blue-400 underline text-sm"
              >
                Crear la primera noticia
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700/50 border-b border-gray-100 dark:border-zinc-700">
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Noticia</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Autor</th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-700">
                {noticiasFiltradas.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {n.imagen && (
                          <img
                            src={n.imagen}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg flex-shrink-0 bg-gray-100 dark:bg-zinc-700"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{n.titulo}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">{n.resumen}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${categoriaColor[n.categoria] ?? ''}`}>
                        {n.categoria}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                      {new Date(n.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{n.autor}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-editar-${n.id}`}
                          onClick={() => abrirEditar(n)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Editar noticia"
                        >
                          ✏️
                        </button>
                        {confirmDelete === n.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              id={`btn-confirm-delete-${n.id}`}
                              onClick={() => handleDelete(n.id)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`btn-eliminar-${n.id}`}
                            onClick={() => setConfirmDelete(n.id)}
                            className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar noticia"
                          >
                            🗑️
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

      {/* ── Modal de Crear / Editar ── */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b dark:border-zinc-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modoForm === 'crear' ? '➕ Nueva Noticia' : '✏️ Editar Noticia'}
              </h2>
              <button
                onClick={cerrarModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form id="form-noticia" onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-titulo"
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Escribe el título de la noticia..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  required
                />
              </div>

              {/* Resumen */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Resumen <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="input-resumen"
                  value={form.resumen}
                  onChange={(e) => setForm({ ...form, resumen: e.target.value })}
                  placeholder="Breve descripción que aparecerá en las tarjetas..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition resize-none"
                  required
                />
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Contenido completo <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="input-contenido"
                  value={form.contenido}
                  onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                  placeholder="Escribe aquí el artículo completo..."
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition resize-y"
                  required
                />
              </div>

              {/* Imagen URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  URL de imagen
                </label>
                <input
                  id="input-imagen"
                  type="text"
                  value={form.imagen}
                  onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                  placeholder="Ej: /images/noticias/mi-foto.jpg"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                />
                {form.imagen && (
                  <img
                    src={form.imagen}
                    alt="preview"
                    className="mt-2 h-24 w-full object-cover rounded-lg bg-gray-100 dark:bg-zinc-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Fila: Categoría + Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="input-categoria"
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value as Noticia['categoria'] })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  >
                    <option value="club">Club</option>
                    <option value="competicion">Competición</option>
                    <option value="fichaje">Fichaje</option>
                    <option value="institucional">Institucional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Fecha y hora <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-fecha"
                    type="datetime-local"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                    required
                  />
                </div>
              </div>

              {/* Autor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Autor <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-autor"
                  type="text"
                  value={form.autor}
                  onChange={(e) => setForm({ ...form, autor: e.target.value })}
                  placeholder="Ej: Departamento de Prensa"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  required
                />
              </div>

              {/* Acciones del formulario */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t dark:border-zinc-700">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  id="btn-guardar-noticia"
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2.5 rounded-xl bg-club-blue hover:bg-club-blue-dark text-white font-semibold transition-all shadow hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {guardando ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Guardando...
                    </>
                  ) : modoForm === 'crear' ? (
                    'Publicar noticia'
                  ) : (
                    'Guardar cambios'
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
