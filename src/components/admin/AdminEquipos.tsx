// Gestión de Equipos Rivales — se usa en calendario, luchadas y clasificación
import { useState } from 'react';
import { useDataStore } from '../../store/useDataStore';
import type { EquipoRival } from '../../types';

const equipoVacio = (): Omit<EquipoRival, 'id'> => ({
  nombre: '',
  municipio: '',
  isla: 'La Palma',
  terrero: '',
  categoria: 'Primera Categoría',
});

const CATEGORIAS = ['Primera Categoría', 'Segunda Categoría', 'Juvenil', 'Infantil', 'Benjamín'];
const ISLAS = ['La Palma', 'Tenerife', 'Gran Canaria', 'Lanzarote', 'Fuerteventura', 'La Gomera', 'El Hierro', 'La Graciosa'];

interface FormEquipoProps {
  initial: Omit<EquipoRival, 'id'>;
  onSave: (data: Omit<EquipoRival, 'id'>) => Promise<void>;
  onCancel: () => void;
  cargando: boolean;
  titulo: string;
}

function FormEquipo({ initial, onSave, onCancel, cargando, titulo }: FormEquipoProps) {
  const [form, setForm] = useState(initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    await onSave(form);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors';

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-100 dark:border-zinc-700 space-y-4">
      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{titulo}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Nombre */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Nombre del club *
          </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: CL Tamanca-Las Manchas"
            required
            className={inputClass}
          />
        </div>

        {/* Municipio */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Municipio
          </label>
          <input
            name="municipio"
            value={form.municipio}
            onChange={handleChange}
            placeholder="Ej: Las Manchas"
            className={inputClass}
          />
        </div>

        {/* Isla */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Isla
          </label>
          <select name="isla" value={form.isla} onChange={handleChange} className={inputClass}>
            {ISLAS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* Terrero */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Terrero (local)
          </label>
          <input
            name="terrero"
            value={form.terrero}
            onChange={handleChange}
            placeholder="Ej: Terrero Municipal de Antigua"
            className={inputClass}
          />
        </div>

        {/* Categoría */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Categoría
          </label>
          <select name="categoria" value={form.categoria} onChange={handleChange} className={inputClass}>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={cargando || !form.nombre.trim()}
          className="w-full sm:w-auto px-5 py-2 text-sm font-bold text-white bg-club-blue hover:bg-club-blue-dark rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {cargando && (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Guardar equipo
        </button>
      </div>
    </form>
  );
}

export default function AdminEquipos() {
  const { equipos, addEquipo, updateEquipo, deleteEquipo } = useDataStore();

  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: 'ok' | 'error'; msg: string } | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const mostrarFeedback = (tipo: 'ok' | 'error', msg: string) => {
    setFeedback({ tipo, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const equiposFiltrados = equipos.filter((e) =>
    !busqueda.trim() ||
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.municipio.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.isla.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleNuevoEquipo = async (data: Omit<EquipoRival, 'id'>) => {
    setCargando(true);
    try {
      await addEquipo(data);
      setMostrarFormNuevo(false);
      mostrarFeedback('ok', `Equipo "${data.nombre}" añadido correctamente.`);
    } catch {
      mostrarFeedback('error', 'Error al añadir el equipo.');
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarEquipo = async (id: number, data: Omit<EquipoRival, 'id'>) => {
    setCargando(true);
    try {
      await updateEquipo(id, data);
      setEditandoId(null);
      mostrarFeedback('ok', 'Equipo actualizado correctamente.');
    } catch {
      mostrarFeedback('error', 'Error al actualizar el equipo.');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    setCargando(true);
    try {
      await deleteEquipo(id);
      setConfirmDeleteId(null);
      mostrarFeedback('ok', 'Equipo eliminado.');
    } catch {
      mostrarFeedback('error', 'Error al eliminar el equipo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      {/* Cabecera */}
      <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Equipos Rivales
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Gestiona los equipos disponibles para calendario, luchadas y clasificación.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Buscador */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar equipo..."
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-club-blue w-40"
            />
          </div>
          <button
            onClick={() => { setMostrarFormNuevo(true); setEditandoId(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-club-blue hover:bg-club-blue-dark rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo equipo
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Feedback */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              feedback.tipo === 'ok'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        {/* Formulario de nuevo equipo */}
        {mostrarFormNuevo && (
          <FormEquipo
            titulo="Añadir nuevo equipo rival"
            initial={equipoVacio()}
            onSave={handleNuevoEquipo}
            onCancel={() => setMostrarFormNuevo(false)}
            cargando={cargando}
          />
        )}

        {/* Lista de equipos */}
        {equiposFiltrados.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">
            {busqueda ? `No se encontraron equipos con "${busqueda}".` : 'No hay equipos registrados.'}
          </div>
        ) : (
          <div className="space-y-2">
            {equiposFiltrados.map((equipo) => (
              <div key={equipo.id}>
                {editandoId === equipo.id ? (
                  <FormEquipo
                    titulo={`Editando: ${equipo.nombre}`}
                    initial={{ nombre: equipo.nombre, municipio: equipo.municipio, isla: equipo.isla, terrero: equipo.terrero, categoria: equipo.categoria }}
                    onSave={(data) => handleActualizarEquipo(equipo.id, data)}
                    onCancel={() => setEditandoId(null)}
                    cargando={cargando}
                  />
                ) : confirmDeleteId === equipo.id ? (
                  <div className="flex items-center justify-between gap-3 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                      ¿Eliminar <strong>{equipo.nombre}</strong>? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleEliminar(equipo.id)}
                        disabled={cargando}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl hover:border-club-blue/30 dark:hover:border-club-blue/30 transition-colors group">
                    {/* Avatar inicial */}
                    <div className="w-9 h-9 rounded-full bg-club-blue/10 dark:bg-club-blue/20 text-club-blue dark:text-blue-400 font-black text-sm flex items-center justify-center flex-shrink-0">
                      {equipo.nombre.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {equipo.nombre}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        {equipo.municipio && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {equipo.municipio}, {equipo.isla}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 dark:text-gray-500">{equipo.categoria}</span>
                        {equipo.terrero && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 truncate hidden sm:block">
                            Terrero: {equipo.terrero}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditandoId(equipo.id); setMostrarFormNuevo(false); }}
                        title="Editar equipo"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-club-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(equipo.id)}
                        title="Eliminar equipo"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contador */}
        <p className="text-right text-xs text-gray-400 dark:text-gray-500 pt-1">
          {equiposFiltrados.length} equipo{equiposFiltrados.length !== 1 ? 's' : ''} registrado{equiposFiltrados.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
