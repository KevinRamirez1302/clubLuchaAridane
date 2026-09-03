// Panel de cuenta de socio — maquetado, listo para conectar backend
// INTEGRACIÓN BACKEND: el login/registro debe conectarse a POST /api/auth/login y POST /api/auth/registro
// El token JWT se almacenará en localStorage/cookie y se usará para las rutas protegidas
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMembershipStore } from '../../store/useMembershipStore';

export default function MemberAccount() {
  const { t } = useTranslation();
  const [cargando, setCargando] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { socioAutenticado, loginSocio, logoutSocio } = useMembershipStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setLoginError('');
    
    const form = e.target as HTMLFormElement;
    const dni = (form.elements.namedItem('dni') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    // Simulate network delay is no longer needed manually if loginSocio is async, but we can keep it or remove it.
    // I'll just await loginSocio directly.
    const success = await loginSocio(dni, password);
    if (!success) {
      setLoginError('DNI o contraseña incorrectos, o solicitud no aceptada aún.');
    }
    
    setCargando(false);
  };

  if (socioAutenticado) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header panel */}
        <div className="bg-gradient-to-br from-club-blue to-club-blue-dark rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black">
              {socioAutenticado.nombre[0]}
            </div>
            <div>
              <p className="font-bold text-xl">{socioAutenticado.nombre}</p>
              <p className="text-white/70 text-sm">{socioAutenticado.email}</p>
              <span className="inline-block mt-1 bg-club-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                {socioAutenticado.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Datos del carnet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            {
              label: 'Número de socio',
              value: socioAutenticado.numeroSocio,
              icon: (
                <svg className="w-4 h-4 text-club-blue inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                </svg>
              ),
            },
            {
              label: 'Plan activo',
              value: socioAutenticado.plan,
              icon: (
                <svg className="w-4 h-4 text-club-orange inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ),
            },
            {
              label: 'Vence el',
              value: new Date(socioAutenticado.vencimiento ?? '').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
              icon: (
                <svg className="w-4 h-4 text-club-blue inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              label: 'Estado',
              value: 'Activo',
              icon: (
                <svg className="w-4 h-4 text-club-green inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 uppercase tracking-wide flex items-center">{icon} {label}</p>
              <p className="font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Contenido exclusivo — placeholder para futuros beneficios por plan */}
        <div className="bg-gradient-to-br from-club-orange/10 to-club-green/10 border border-club-orange/20 rounded-2xl p-6 mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-club-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Contenido exclusivo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Como <strong>{socioAutenticado.plan}</strong> tienes acceso a:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-club-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Videos behind-the-scenes del equipo
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-club-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Entrevistas exclusivas con jugadores
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-club-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Acceso anticipado a venta de entradas
            </li>
          </ul>
          <button className="mt-4 text-club-blue dark:text-club-blue-light font-semibold text-sm hover:underline">
            Ver todo el contenido →
          </button>
        </div>

        {/* Botón Descargar Carné */}
        <div className="mb-6">
          <button
            onClick={() => alert('Generando PDF del carné de socio...')}
            className="w-full bg-club-blue hover:bg-club-blue-dark text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar Carné de Socio (PDF)
          </button>
        </div>

        <button
          onClick={logoutSocio}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="text-gray-500 dark:text-gray-400">
          Inicia sesión para acceder a tu panel de socio y descargar tu carné.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="dni" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            DNI / NIE
          </label>
          <input
            id="dni"
            name="dni"
            type="text"
            required
            placeholder="12345678A"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-club-blue transition-colors"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t('membresia.password')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-club-blue transition-colors"
          />
        </div>

        {loginError && (
          <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-club-blue hover:bg-club-blue-dark text-white py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {cargando && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {t('membresia.iniciarSesion')}
        </button>
      </form>

      {/* Demo note */}
      <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">
        <strong>Nota:</strong> Para tener una cuenta de socio debes solicitarla primero en la pestaña de Planes. Una vez aceptada, usa las credenciales que te proporcionaron mediante correo electrónico. Intenta también revisar la carpeta de spam de tu correo.
      </div>
    </div>
  );
}
