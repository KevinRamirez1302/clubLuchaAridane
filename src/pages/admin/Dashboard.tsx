import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMembershipStore, type Socio } from '../../store/useMembershipStore';
import { useDataStore } from '../../store/useDataStore';
import EditSocioModal from '../../components/admin/EditSocioModal';
import AdminEquipos from '../../components/admin/AdminEquipos';

export default function Dashboard() {
  const { socios, solicitudes, fetchSocios, fetchSolicitudes, updateSocio, toggleEstadoSocio } = useMembershipStore();
  const { noticias, plantilla } = useDataStore();

  const [socioEditando, setSocioEditando] = useState<Socio | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | number | null>(null);

  useEffect(() => {
    fetchSocios();
    fetchSolicitudes();
  }, [fetchSocios, fetchSolicitudes]);

  const handleAbrirEditar = (socio: Socio) => {
    setSocioEditando(socio);
    setModalEditarAbierto(true);
  };

  const handleGuardarSocio = async (id: string | number, datos: Partial<Socio>) => {
    await updateSocio(id, datos);
  };

  const handleToggleEstado = async (id: string | number, currentStatus: boolean) => {
    setIsProcessing(id);
    await toggleEstadoSocio(id, !currentStatus);
    setIsProcessing(null);
  };

  const sociosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return socios.slice(0, 8); // Primeros 8 en el dashboard
    return socios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        (s.apellidos && s.apellidos.toLowerCase().includes(q)) ||
        (s.dni && s.dni.toLowerCase().includes(q)) ||
        (s.numeroSocio && s.numeroSocio.toLowerCase().includes(q)) ||
        (s.numSocio && s.numSocio.toLowerCase().includes(q))
    );
  }, [socios, busqueda]);

  const sociosActivos = socios.filter((s) => s.activo ?? true).length;
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === 'pendiente').length;

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Control
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Vista general del Club de Lucha Aridane y gestión directa de socios.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Socios */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Socios</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5-3.512M9 20H4v-2a3 3 0 015-3.512M12 14a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{socios.length}</span>
            <span className="text-xs text-green-600 font-semibold">{sociosActivos} activos</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Registrados en la plataforma</p>
        </div>

        {/* Solicitudes */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Solicitudes</span>
            <span className="p-2 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{solicitudesPendientes}</span>
            <span className="text-xs text-amber-600 font-semibold">pendientes</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Nuevas peticiones de alta</p>
        </div>

        {/* Noticias */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Noticias</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{noticias.length}</span>
            <span className="text-xs text-gray-400">publicadas</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Artículos en la web</p>
        </div>

        {/* Plantilla */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Plantilla</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{plantilla.length}</span>
            <span className="text-xs text-gray-400">luchadores</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Equipo oficial</p>
        </div>
      </div>

      {/* Sección principal de Gestión de Socios con botón de lápiz para editar */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700/80 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-club-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Perfiles de Socios
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Edita datos, planes o estados de los socios desde el icono de lápiz.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Buscar socio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-club-blue"
              />
              <svg className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Link
              to="/admin/socios"
              className="text-xs font-semibold text-club-blue dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              Ver todos →
            </Link>
          </div>
        </div>

        {/* Tabla de socios con botón lápiz */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-900/50">
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Socio
                </th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Nº Socio / DNI
                </th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Acciones (Editar)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-700 bg-white dark:bg-zinc-800">
              {sociosFiltrados.length > 0 ? (
                sociosFiltrados.map((socio) => (
                  <tr key={socio.id} className="hover:bg-gray-50/75 dark:hover:bg-zinc-700/40 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex-shrink-0 bg-club-blue/15 dark:bg-club-blue/30 text-club-blue dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                          {socio.nombre ? socio.nombre[0].toUpperCase() : 'S'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {socio.nombre} {socio.apellidos || ''}
                          </p>
                          <p className="text-xs text-gray-400">{socio.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-xs font-bold text-gray-900 dark:text-white font-mono">
                        {socio.numeroSocio || socio.numSocio || 'Sin número'}
                      </p>
                      <p className="text-xs text-gray-400">{socio.dni || 'Sin DNI'}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {socio.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          socio.activo ?? true
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {socio.activo ?? true ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        {/* BOTÓN LÁPIZ PARA EDITAR PERFIL DE SOCIO */}
                        <button
                          id={`btn-editar-dashboard-${socio.id}`}
                          onClick={() => handleAbrirEditar(socio)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors inline-flex items-center gap-1.5 border border-blue-200 dark:border-blue-800"
                          title="Editar perfil de socio"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span className="font-semibold">Editar</span>
                        </button>

                        <button
                          onClick={() => handleToggleEstado(socio.id, socio.activo ?? true)}
                          disabled={isProcessing === socio.id}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            socio.activo ?? true
                              ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20'
                              : 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                          } disabled:opacity-50`}
                        >
                          {socio.activo ?? true ? 'Suspender' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-xs text-gray-400">
                    No se encontraron socios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para editar perfil de socio */}
      <EditSocioModal
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        socio={socioEditando}
        onSave={handleGuardarSocio}
      />

      {/* Gestión de Equipos Rivales */}
      <AdminEquipos />
    </div>
  );
}
