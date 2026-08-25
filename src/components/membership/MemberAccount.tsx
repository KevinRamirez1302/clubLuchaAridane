// Panel de cuenta de socio — maquetado, listo para conectar backend
// INTEGRACIÓN BACKEND: el login/registro debe conectarse a POST /api/auth/login y POST /api/auth/registro
// El token JWT se almacenará en localStorage/cookie y se usará para las rutas protegidas
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Vista = 'login' | 'registro' | 'panel';

export default function MemberAccount() {
  const { t } = useTranslation();
  const [vista, setVista] = useState<Vista>('login');
  const [cargando, setCargando] = useState(false);

  // Estado simulado de usuario autenticado
  const [usuarioMock] = useState({
    nombre: 'María Rodríguez',
    email: 'maria@example.com',
    plan: 'Socio Premium',
    vencimiento: '31 de agosto de 2026',
    dorsal: 'N/A',
    numeroSocio: 'ARD-2024-0042',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    // ── INTEGRACIÓN BACKEND: POST /api/auth/login ──
    await new Promise((r) => setTimeout(r, 800));
    setCargando(false);
    setVista('panel');
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    // ── INTEGRACIÓN BACKEND: POST /api/auth/registro ──
    await new Promise((r) => setTimeout(r, 800));
    setCargando(false);
    setVista('panel');
  };

  if (vista === 'panel') {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header panel */}
        <div className="bg-gradient-to-br from-club-blue to-club-blue-dark rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black">
              {usuarioMock.nombre[0]}
            </div>
            <div>
              <p className="font-bold text-xl">{usuarioMock.nombre}</p>
              <p className="text-white/70 text-sm">{usuarioMock.email}</p>
              <span className="inline-block mt-1 bg-club-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                {usuarioMock.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Datos del carnet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Número de socio', value: usuarioMock.numeroSocio, icon: '🎫' },
            { label: 'Plan activo', value: usuarioMock.plan, icon: '⭐' },
            { label: 'Vence el', value: usuarioMock.vencimiento, icon: '📅' },
            { label: 'Estado', value: 'Activo', icon: '✅' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{icon} {label}</p>
              <p className="font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Contenido exclusivo — placeholder para futuros beneficios por plan */}
        <div className="bg-gradient-to-br from-club-orange/10 to-club-green/10 border border-club-orange/20 rounded-2xl p-6 mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>🔒</span> Contenido exclusivo Premium
          </h3>
          {/* INTEGRACIÓN BACKEND: renderizar contenido según usuarioMock.plan */}
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Como <strong>Socio Premium</strong> tienes acceso a:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-club-green">✓</span> Videos behind-the-scenes del equipo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-club-green">✓</span> Entrevistas exclusivas con jugadores
            </li>
            <li className="flex items-center gap-2">
              <span className="text-club-green">✓</span> Acceso anticipado a venta de entradas
            </li>
          </ul>
          <button className="mt-4 text-club-blue dark:text-club-blue-light font-semibold text-sm hover:underline">
            Ver todo el contenido →
          </button>
        </div>

        <button
          onClick={() => setVista('login')}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  const isLogin = vista === 'login';

  return (
    <div className="max-w-md mx-auto">
      {/* Tabs login/registro */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8">
        {(['login', 'registro'] as Vista[]).map((v) => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all capitalize ${
              vista === v
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {v === 'login' ? t('membresia.iniciarSesion') : t('membresia.registrarse')}
          </button>
        ))}
      </div>

      <form onSubmit={isLogin ? handleLogin : handleRegistro} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="cuenta-nombre" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t('membresia.nombre')}
            </label>
            <input
              id="cuenta-nombre"
              type="text"
              required
              placeholder="Tu nombre completo"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-club-blue transition-colors"
            />
          </div>
        )}

        <div>
          <label htmlFor="cuenta-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t('membresia.email')}
          </label>
          <input
            id="cuenta-email"
            type="email"
            required
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-club-blue transition-colors"
          />
        </div>

        <div>
          <label htmlFor="cuenta-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t('membresia.password')}
          </label>
          <input
            id="cuenta-password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-club-blue transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-club-blue hover:bg-club-blue-dark text-white py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {cargando && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isLogin ? t('membresia.iniciarSesion') : t('membresia.registrarse')}
        </button>
      </form>

      {/* Demo note */}
      <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">
        <strong>Demo:</strong> cualquier credencial abre el panel de socio. La autenticación real se conectará al backend.
      </div>
    </div>
  );
}
