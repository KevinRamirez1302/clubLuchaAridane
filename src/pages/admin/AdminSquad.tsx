import { useState, useRef } from 'react';
import { useDataStore } from '../../store/useDataStore';
import type { Jugador, ClasificacionLuchador, CategoriaEquipo } from '../../types';

// ── Constantes de opciones ──
const CLASIFICACIONES: ClasificacionLuchador[] = [
  'Puntal A', 'Puntal B', 'Puntal C',
  'Destacado A', 'Destacado B', 'Destacado C',
  'No clasificado', 'Juvenil', 'Cadete', 'Infantil',
  'Técnico Medio', 'Técnico Superior',
  'Presidente', 'Secretario', 'Vocal',
];

const EQUIPOS: { value: CategoriaEquipo; label: string }[] = [
  { value: 'primera', label: 'Primera' },
  { value: 'segunda', label: 'Segunda' },
  { value: 'tercera', label: 'Tercera' },
  { value: 'femenina', label: 'Femenina' },
  { value: 'base', label: 'Base' },
  { value: 'directiva', label: 'Directiva' },
  { value: 'cuerpo-tecnico', label: 'Cuerpo Técnico' },
];

const jugadorVacio: Omit<Jugador, 'id'> = {
  nombre: '',
  clasificaciones: [],
  equipos: [],
  foto: '',
  nacionalidad: 'Español',
  edad: null,
  peso: null,
  altura: null,
  luchadas: undefined,
  puntosFavor: undefined,
  puntosContra: undefined,
  bio: '',
};

// ── Colores por categoría de equipo ──
const equipoColor: Record<CategoriaEquipo, string> = {
  primera: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  segunda: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  tercera: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  femenina: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  base: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  directiva: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  'cuerpo-tecnico': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
};

type FiltroEquipo = CategoriaEquipo | 'todos';

export default function AdminSquad() {
  const { plantilla, addJugador, updateJugador, deleteJugador } = useDataStore();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [jugadorEditando, setJugadorEditando] = useState<Jugador | null>(null);
  const [form, setForm] = useState<Omit<Jugador, 'id'>>(jugadorVacio);
  const [guardando, setGuardando] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEquipo, setFiltroEquipo] = useState<FiltroEquipo>('todos');
  const [feedback, setFeedback] = useState<{ tipo: 'ok' | 'error'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Filtrado ──
  const jugadoresFiltrados = plantilla.filter((j) => {
    const matchBusqueda =
      j.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      j.nacionalidad?.toLowerCase().includes(busqueda.toLowerCase()) ||
      j.clasificaciones.some((c) => c.toLowerCase().includes(busqueda.toLowerCase()));
    const matchEquipo = filtroEquipo === 'todos' || j.equipos.includes(filtroEquipo as CategoriaEquipo);
    return matchBusqueda && matchEquipo;
  });

  const mostrarFeedback = (tipo: 'ok' | 'error', msg: string) => {
    setFeedback({ tipo, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  // ── Modal ──
  const abrirCrear = () => {
    setJugadorEditando(null);
    setForm(jugadorVacio);
    setModalAbierto(true);
  };

  const abrirEditar = (jugador: Jugador) => {
    setJugadorEditando(jugador);
    setForm({
      nombre: jugador.nombre,
      clasificaciones: [...jugador.clasificaciones],
      equipos: [...jugador.equipos],
      foto: jugador.foto,
      nacionalidad: jugador.nacionalidad,
      edad: jugador.edad,
      peso: jugador.peso,
      altura: jugador.altura,
      luchadas: jugador.luchadas,
      puntosFavor: jugador.puntosFavor,
      puntosContra: jugador.puntosContra,
      bio: jugador.bio ?? '',
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setJugadorEditando(null);
    setForm(jugadorVacio);
  };

  // ── Foto: subida de archivo → base64 ──
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, foto: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // ── Toggle clasificación ──
  const toggleClasificacion = (c: ClasificacionLuchador) => {
    setForm((prev) => ({
      ...prev,
      clasificaciones: prev.clasificaciones.includes(c)
        ? prev.clasificaciones.filter((x) => x !== c)
        : [...prev.clasificaciones, c],
    }));
  };

  // ── Toggle equipo ──
  const toggleEquipo = (e: CategoriaEquipo) => {
    setForm((prev) => ({
      ...prev,
      equipos: prev.equipos.includes(e)
        ? prev.equipos.filter((x) => x !== e)
        : [...prev.equipos, e],
    }));
  };

  // ── Submit ──
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.nombre.trim()) {
      mostrarFeedback('error', 'El nombre del jugador es obligatorio.');
      return;
    }
    if (form.clasificaciones.length === 0) {
      mostrarFeedback('error', 'Selecciona al menos una clasificación.');
      return;
    }
    if (form.equipos.length === 0) {
      mostrarFeedback('error', 'Selecciona al menos un equipo/categoría.');
      return;
    }

    setGuardando(true);
    await new Promise((r) => setTimeout(r, 400));

    try {
      if (jugadorEditando) {
        updateJugador(jugadorEditando.id, form);
        mostrarFeedback('ok', '¡Jugador actualizado correctamente!');
      } else {
        addJugador(form);
        mostrarFeedback('ok', '¡Jugador añadido a la plantilla!');
      }
      cerrarModal();
    } catch {
      mostrarFeedback('error', 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = (id: number) => {
    deleteJugador(id);
    setConfirmDelete(null);
    mostrarFeedback('ok', 'Jugador eliminado de la plantilla.');
  };

  return (
    <div className="space-y-6">
      {/* ── Cabecera ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Plantilla</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {plantilla.length} jugador{plantilla.length !== 1 ? 'es' : ''} en total
          </p>
        </div>
        <button
          id="btn-agregar-jugador"
          onClick={abrirCrear}
          className="inline-flex items-center gap-2 bg-club-blue hover:bg-club-blue-dark text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow hover:shadow-lg hover:-translate-y-0.5"
        >
          <span className="text-lg">+</span> Añadir Jugador
        </button>
      </div>

      {/* ── Feedback toast ── */}
      {feedback && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
            feedback.tipo === 'ok'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
          }`}
        >
          <span>{feedback.tipo === 'ok' ? '✅' : '❌'}</span>
          {feedback.msg}
        </div>
      )}

      {/* ── Filtros ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            id="buscar-jugadores"
            type="text"
            placeholder="Buscar por nombre, clasificación o nacionalidad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
          />
        </div>
        <select
          id="filtro-equipo"
          value={filtroEquipo}
          onChange={(e) => setFiltroEquipo(e.target.value as FiltroEquipo)}
          className="px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
        >
          <option value="todos">Todos los equipos</option>
          {EQUIPOS.map((eq) => (
            <option key={eq.value} value={eq.value}>{eq.label}</option>
          ))}
        </select>
      </div>

      {/* ── Tabla de jugadores ── */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-700">
        {jugadoresFiltrados.length === 0 ? (
          <div className="p-12 text-center text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-lg font-medium">
              {busqueda || filtroEquipo !== 'todos' ? 'Sin resultados' : 'La plantilla está vacía'}
            </p>
            {!busqueda && filtroEquipo === 'todos' && (
              <button onClick={abrirCrear} className="mt-4 text-club-blue dark:text-blue-400 underline text-sm">
                Añadir el primer jugador
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700/50 border-b border-gray-100 dark:border-zinc-700">
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jugador</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Clasificación</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Equipo</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Datos</th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-700">
                {jugadoresFiltrados.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {j.foto ? (
                          <img
                            src={j.foto}
                            alt={j.nombre}
                            className="w-10 h-10 object-cover rounded-full flex-shrink-0 bg-gray-100 dark:bg-zinc-700 border-2 border-gray-200 dark:border-zinc-600"
                            onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-club-blue/10 dark:bg-club-blue/20 flex items-center justify-center flex-shrink-0 text-club-blue font-bold text-sm">
                            {j.nombre.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{j.nombre}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{j.nacionalidad}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {j.clasificaciones.slice(0, 2).map((c) => (
                          <span key={c} className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-md text-xs">
                            {c}
                          </span>
                        ))}
                        {j.clasificaciones.length > 2 && (
                          <span className="text-xs text-gray-400">+{j.clasificaciones.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {j.equipos.map((e) => (
                          <span key={e} className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${equipoColor[e] ?? ''}`}>
                            {EQUIPOS.find((eq) => eq.value === e)?.label ?? e}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                        {j.edad && <p>Edad: <span className="font-medium text-gray-700 dark:text-gray-300">{j.edad}</span></p>}
                        {j.peso && <p>Peso: <span className="font-medium text-gray-700 dark:text-gray-300">{j.peso} kg</span></p>}
                        {j.luchadas !== undefined && <p>Luchadas: <span className="font-medium text-gray-700 dark:text-gray-300">{j.luchadas}</span></p>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-editar-jugador-${j.id}`}
                          onClick={() => abrirEditar(j)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Editar jugador"
                        >
                          ✏️
                        </button>
                        {confirmDelete === j.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              id={`btn-confirm-delete-jugador-${j.id}`}
                              onClick={() => handleDelete(j.id)}
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
                            id={`btn-eliminar-jugador-${j.id}`}
                            onClick={() => setConfirmDelete(j.id)}
                            className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar jugador"
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

      {/* ── Modal Crear / Editar ── */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-zinc-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {jugadorEditando ? '✏️ Editar Jugador' : '➕ Añadir Jugador'}
              </h2>
              <button
                onClick={cerrarModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <form id="form-jugador" onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Foto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Foto del jugador
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-300 dark:border-zinc-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.foto ? (
                      <img src={form.foto} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                    ) : (
                      <span className="text-3xl text-gray-300">👤</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                    >
                      📁 Subir imagen desde archivo
                    </button>
                    <input
                      id="input-foto-url"
                      type="text"
                      placeholder="O pega una URL de imagen..."
                      value={form.foto.startsWith('data:') ? '' : form.foto}
                      onChange={(e) => setForm((prev) => ({ ...prev, foto: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFotoChange}
                    />
                  </div>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-nombre-jugador"
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Carlos Matoso González"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  required
                />
              </div>

              {/* Clasificaciones */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Clasificaciones <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-gray-400">(selecciona las que apliquen)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CLASIFICACIONES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleClasificacion(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        form.clasificaciones.includes(c)
                          ? 'bg-club-blue text-white border-club-blue shadow-sm'
                          : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:border-club-blue/50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Equipos / Categorías <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {EQUIPOS.map((eq) => (
                    <button
                      key={eq.value}
                      type="button"
                      onClick={() => toggleEquipo(eq.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        form.equipos.includes(eq.value)
                          ? 'bg-club-orange text-white border-club-orange shadow-sm'
                          : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:border-club-orange/50'
                      }`}
                    >
                      {eq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fila: Nacionalidad + Edad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nacionalidad</label>
                  <input
                    id="input-nacionalidad"
                    type="text"
                    value={form.nacionalidad}
                    onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })}
                    placeholder="Ej: Español"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Edad</label>
                  <input
                    id="input-edad"
                    type="number"
                    min={14}
                    max={99}
                    value={form.edad ?? ''}
                    onChange={(e) => setForm({ ...form, edad: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Ej: 24"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  />
                </div>
              </div>

              {/* Fila: Peso + Altura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Peso (kg)</label>
                  <input
                    id="input-peso"
                    type="number"
                    min={40}
                    max={250}
                    value={form.peso ?? ''}
                    onChange={(e) => setForm({ ...form, peso: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Ej: 85"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Altura (cm)</label>
                  <input
                    id="input-altura"
                    type="number"
                    min={140}
                    max={230}
                    value={form.altura ?? ''}
                    onChange={(e) => setForm({ ...form, altura: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Ej: 178"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition"
                  />
                </div>
              </div>

              {/* Fila: Estadísticas */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estadísticas (opcional)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Luchadas</label>
                    <input
                      id="input-luchadas"
                      type="number"
                      min={0}
                      value={form.luchadas ?? ''}
                      onChange={(e) => setForm({ ...form, luchadas: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Pts. a favor</label>
                    <input
                      id="input-puntos-favor"
                      type="number"
                      min={0}
                      value={form.puntosFavor ?? ''}
                      onChange={(e) => setForm({ ...form, puntosFavor: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Pts. en contra</label>
                    <input
                      id="input-puntos-contra"
                      type="number"
                      min={0}
                      value={form.puntosContra ?? ''}
                      onChange={(e) => setForm({ ...form, puntosContra: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 text-sm transition"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Biografía</label>
                <textarea
                  id="input-bio"
                  value={form.bio ?? ''}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Breve descripción del jugador..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue/50 transition resize-none"
                />
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
                  id="btn-guardar-jugador"
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
                  ) : jugadorEditando ? 'Guardar cambios' : 'Añadir a la plantilla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
