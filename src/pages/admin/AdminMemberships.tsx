import { useState, useMemo, useEffect } from 'react';
import { useMembershipStore } from '../../store/useMembershipStore';
import type { Solicitud, Socio } from '../../store/useMembershipStore';
import Modal from '../../components/common/Modal';

export default function AdminMemberships() {
  const { solicitudes, fetchSolicitudes, fetchSocios, acceptSolicitud, rejectSolicitud, socios, isLoading, error } = useMembershipStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [createdSocio, setCreatedSocio] = useState<Socio | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchSolicitudes();
    fetchSocios();
  }, [fetchSolicitudes, fetchSocios]);

  const pendientes = useMemo(() => {
    return solicitudes
      .filter((s) => s.estado === 'pendiente')
      .filter(
        (s) =>
          s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.dni.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [solicitudes, searchTerm]);

  const aceptadas = useMemo(() => solicitudes.filter(s => s.estado === 'aceptada'), [solicitudes]);
  const rechazadas = useMemo(() => solicitudes.filter(s => s.estado === 'rechazada'), [solicitudes]);

  const handleAccept = async (id: string) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      const targetSolicitud = solicitudes.find(s => s.id === id);
      const socio = await acceptSolicitud(id);
      const newSocio = socio || useMembershipStore.getState().socios.find(s => s.dni === targetSolicitud?.dni);
      setSelectedSolicitud(null);
      if (newSocio) {
        setCreatedSocio(newSocio);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aceptar la solicitud';
      setActionError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await rejectSolicitud(id);
      setSelectedSolicitud(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al rechazar la solicitud';
      setActionError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Solicitudes de Socios
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona las peticiones de nuevas membresías ({pendientes.length} pendientes).
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
          <button
            onClick={() => { fetchSolicitudes(); fetchSocios(); }}
            className="ml-auto text-sm font-semibold underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Banner de error de acción (accept/reject) */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pendientes</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{pendientes.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Aceptadas</p>
          <p className="text-3xl font-bold text-green-500 mt-1">{aceptadas.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Rechazadas</p>
          <p className="text-3xl font-bold text-red-500 mt-1">{rechazadas.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Socios Activos</p>
          <p className="text-3xl font-bold text-club-blue mt-1">{socios.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos o DNI..."
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
                  Solicitante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  DNI / Teléfono
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha Solicitud
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
                      Cargando solicitudes...
                    </div>
                  </td>
                </tr>
              ) : pendientes.length > 0 ? (
                pendientes.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-lg">
                          {solicitud.nombre[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {solicitud.nombre} {solicitud.apellidos}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {solicitud.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{solicitud.dni}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{solicitud.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {solicitud.plan === 'socio_premium' ? 'Socio Premium' : 'Socio'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedSolicitud(solicitud)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-4"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No hay solicitudes pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSolicitud && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSolicitud(null)}
          title="Detalles de la Solicitud"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre Completo</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedSolicitud.nombre} {selectedSolicitud.apellidos}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">DNI / NIE</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedSolicitud.dni}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedSolicitud.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedSolicitud.telefono}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Nacimiento</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedSolicitud.fechaNacimiento || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Plan Solicitado</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedSolicitud.plan === 'socio_premium' ? 'Socio Premium' : 'Socio'}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => handleReject(selectedSolicitud.id)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Rechazar
              </button>
              <button
                onClick={() => handleAccept(selectedSolicitud.id)}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? 'Procesando...' : 'Aceptar y Crear Socio'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Success / Created Socio Modal */}
      {createdSocio && (
        <Modal
          isOpen={true}
          onClose={() => setCreatedSocio(null)}
          title="¡Socio Creado Exitosamente!"
        >
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl text-green-800 dark:text-green-300">
              <p className="font-semibold mb-2">Credenciales generadas para {createdSocio.nombre}:</p>
              <div className="grid grid-cols-2 gap-2 text-sm mt-3 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-inner">
                <span className="text-gray-500">Usuario (DNI):</span>
                <span className="font-bold font-mono">{createdSocio.dni}</span>
                <span className="text-gray-500">Contraseña:</span>
                <span className="font-bold font-mono">{createdSocio.password}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Puedes enviar el siguiente mensaje por WhatsApp o correo electrónico para avisar al socio:
              </p>
              
              <div className="relative">
                <textarea
                  readOnly
                  className="w-full h-32 p-3 text-sm border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-300 resize-none focus:outline-none"
                  value={`¡Hola ${createdSocio.nombre}! 🎉\n\nTu solicitud de socio para el Club de Lucha Canaria Aridane ha sido ACEPTADA.\n\nYa puedes entrar a tu panel de socio en nuestra web y descargar tu carné digital. Usa estos datos para acceder:\n\n👤 Usuario (DNI): ${createdSocio.dni}\n🔒 Contraseña: ${createdSocio.password}\n\n¡Bienvenido a la familia!`}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setCreatedSocio(null)}
                className="px-4 py-2 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`¡Hola ${createdSocio.nombre}! 🎉\n\nTu solicitud de socio para el Club de Lucha Canaria Aridane ha sido ACEPTADA.\n\nYa puedes entrar a tu panel de socio en nuestra web y descargar tu carné digital. Usa estos datos para acceder:\n\n👤 Usuario (DNI): ${createdSocio.dni}\n🔒 Contraseña: ${createdSocio.password}\n\n¡Bienvenido a la familia!`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enviar por WhatsApp
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
