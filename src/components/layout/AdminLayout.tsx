import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Users,
  BarChart3,
  Calendar,
  UserPlus,
  Database,
  RefreshCw,
  X,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useDataStore } from '../../store/useDataStore';

export default function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);
  const { fetchInitialData, isLoading } = useDataStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Noticias',
      path: '/admin/news',
      icon: <Newspaper className="w-5 h-5" />,
    },
    {
      name: 'Plantilla',
      path: '/admin/squad',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: 'Clasificación',
      path: '/admin/standings',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: 'Próxima Luchada',
      path: '/admin/next-match',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: 'Solicitudes Socios',
      path: '/admin/memberships',
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      name: 'Base de Datos Socios',
      path: '/admin/socios',
      icon: <Database className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">

      {/* ── Overlay para cerrar sidebar en móvil ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-800 shadow-lg flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Cabecera del sidebar */}
        <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
            <button
              onClick={() => fetchInitialData()}
              disabled={isLoading}
              title="Actualizar base de datos"
              className="p-1.5 rounded-lg text-gray-400 hover:text-club-blue hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {/* Botón cerrar solo en móvil */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-700'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Cerrar sesión */}
        <div className="p-4 border-t dark:border-zinc-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Barra superior móvil */}
        <header className="lg:hidden flex items-center gap-3 p-4 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-gray-800 dark:text-white text-lg">Admin Panel</h1>
            <button
              onClick={() => fetchInitialData()}
              disabled={isLoading}
              title="Actualizar base de datos"
              className="p-1.5 rounded-lg text-gray-400 hover:text-club-blue hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Contenido con scroll */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
