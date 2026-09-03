import { useState, useMemo, useEffect } from 'react';
import { useMembershipStore, type Socio } from '../../store/useMembershipStore';
import EditSocioModal from '../../components/admin/EditSocioModal';

export default function AdminSocios() {
  const { socios, fetchSocios, updateSocio, toggleEstadoSocio, deleteSocio, isLoading, error } = useMembershipStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | number | null>(null);
  const [socioEditando, setSocioEditando] = useState<Socio | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchSocios();
  }, [fetchSocios]);

  const handleAbrirEditar = (socio: Socio) => {
    setSocioEditando(socio);
    setModalEditarAbierto(true);
  };

  const handleGuardarSocio = async (id: string | number, datos: Partial<Socio>) => {
    await updateSocio(id, datos);
  };

  const filteredSocios = useMemo(() => {
    return socios.filter((s) => {
      const search = searchTerm.toLowerCase();
      return (
        s.nombre.toLowerCase().includes(search) ||
        (s.apellidos && s.apellidos.toLowerCase().includes(search)) ||
        (s.dni && s.dni.toLowerCase().includes(search)) ||
        (s.numSocio && s.numSocio.toLowerCase().includes(search)) ||
        (s.numeroSocio && s.numeroSocio.toLowerCase().includes(search))
      );
    });
  }, [socios, searchTerm]);

  const handleToggleEstado = async (id: string | number, currentStatus: boolean) => {
    setIsProcessing(id);
    setActionError(null);
    try {
      await toggleEstadoSocio(id, !currentStatus);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Error al cambiar el estado del socio');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('¿Estás seguro de que deseas anular la suscripción de este socio? Esta acción lo dará de baja.')) {
      setIsProcessing(id);
      setActionError(null);
      try {
        await deleteSocio(id);
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : 'Error al dar de baja al socio');
      } finally {
        setIsProcessing(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Base de Datos de Socios
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona los socios activos e inactivos del club ({socios.length} total).

          </p>
        </div>
      </div>

      {/* Banner de error de carga */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => fetchSocios()} className="ml-auto text-sm font-semibold underline hover:no-underline">
            Reintentar
          </button>
        </div>
      )}

      {/* Banner de error de acción */}
      {actionError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{actionError}</span>
          <button onClick={() => setActionError(null)} className="ml-auto text-sm font-semibold underline hover:no-underline">
            Cerrar
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos, DNI o nº socio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Socio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nº Socio / DNI
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      Cargando socios...
                    </div>
                  </td>
                </tr>
              ) : filteredSocios.length > 0 ? (
                filteredSocios.map((socio) => (
                  <tr key={socio.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-club-blue/10 dark:bg-club-blue/20 text-club-blue dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">
                          {socio.nombre[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {socio.nombre} {socio.apellidos || ''}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {socio.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{socio.numSocio || socio.numeroSocio || 'N/A'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{socio.dni || 'Sin DNI'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {socio.plan === 'socio_premium' ? 'Premium' : socio.plan === 'socio' ? 'Normal' : socio.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        socio.activo ?? true 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {socio.activo ?? true ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-editar-socio-${socio.id}`}
                          onClick={() => handleAbrirEditar(socio)}
                          className="p-1.5 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Editar perfil de socio"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span className="hidden sm:inline text-xs font-semibold">Editar</span>
                        </button>
                        <button
                          onClick={() => handleToggleEstado(socio.id, socio.activo ?? true)}
                          disabled={isProcessing === socio.id}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            socio.activo ?? true
                              ? 'text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                              : 'text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                          } disabled:opacity-50 transition-colors`}
                        >
                          {socio.activo ?? true ? 'Suspender' : 'Activar'}
                        </button>
                        <button
                          onClick={() => handleDelete(socio.id)}
                          disabled={isProcessing === socio.id}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                        >
                          Dar de baja
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron socios con esos criterios.
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
    </div>
  );
}
