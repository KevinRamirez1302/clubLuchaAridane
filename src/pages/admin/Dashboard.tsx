import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMembershipStore } from '../../store/useMembershipStore';

export default function Dashboard() {
  const { solicitudes, socios, fetchSolicitudes, fetchSocios } = useMembershipStore();

  useEffect(() => {
    fetchSolicitudes();
    fetchSocios();
  }, [fetchSolicitudes, fetchSocios]);

  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente').length;
  const sociosActivos = socios.filter((s) => s.activo !== false).length;
  const sociosSuspendidos = socios.filter((s) => s.activo === false).length;
  const sociosPremium = socios.filter((s) => s.plan === 'socio_premium').length;

  const stats = [
    {
      label: 'Solicitudes pendientes',
      value: pendientes,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      link: '/admin/memberships',
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Socios activos',
      value: sociosActivos,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      link: '/admin/socios',
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5-3.512M9 20H4v-2a3 3 0 015-3.512M12 14a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      ),
    },
    {
      label: 'Socios premium',
      value: sociosPremium,
      color: 'text-club-blue',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      link: '/admin/socios',
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      label: 'Socios suspendidos',
      value: sociosSuspendidos,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      link: '/admin/socios',
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Resumen del estado actual del club.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className={`${stat.bg} ${stat.border} border rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex-shrink-0">{stat.icon}</div>
            <div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Alerta de solicitudes pendientes */}
      {pendientes > 0 && (
        <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              {pendientes} solicitud{pendientes > 1 ? 'es' : ''} pendiente{pendientes > 1 ? 's' : ''} de revision
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Hay nuevas solicitudes de membresia esperando tu aprobacion.
            </p>
          </div>
          <Link
            to="/admin/memberships"
            className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Revisar
          </Link>
        </div>
      )}

      {/* Bienvenida */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
        <h2 className="font-bold text-gray-900 dark:text-white mb-2">Panel de Administracion</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Desde el menu lateral puedes gestionar noticias, plantilla, clasificacion, partidos, solicitudes de socios y la base de datos de socios.
        </p>
      </div>
    </div>
  );
}
