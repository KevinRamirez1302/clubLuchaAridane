import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import type { Socio } from '../../store/useMembershipStore';

interface EditSocioModalProps {
  isOpen: boolean;
  onClose: () => void;
  socio: Socio | null;
  onSave: (id: string | number, datos: Partial<Socio>) => Promise<void>;
}

export default function EditSocioModal({
  isOpen,
  onClose,
  socio,
  onSave,
}: EditSocioModalProps) {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [numeroSocio, setNumeroSocio] = useState('');
  const [plan, setPlan] = useState('Socio');
  const [activo, setActivo] = useState(true);
  const [password, setPassword] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (socio) {
      setNombre(socio.nombre || '');
      setApellidos(socio.apellidos || '');
      setEmail(socio.email || '');
      setDni(socio.dni || '');
      setNumeroSocio(socio.numeroSocio || socio.numSocio || '');
      setPlan(socio.plan || 'Socio');
      setActivo(socio.activo ?? true);
      setPassword(socio.password || '');
      setVencimiento(
        socio.vencimiento
          ? socio.vencimiento.slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setError('');
    }
  }, [socio, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socio) return;

    if (!nombre.trim() || !email.trim()) {
      setError('El nombre y el correo electrónico son obligatorios.');
      return;
    }

    try {
      setGuardando(true);
      setError('');

      await onSave(socio.id, {
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        email: email.trim(),
        dni: dni.trim(),
        numeroSocio: numeroSocio.trim(),
        numSocio: numeroSocio.trim(),
        plan,
        activo,
        password: password.trim() || '123456',
        vencimiento: vencimiento ? new Date(vencimiento).toISOString() : socio.vencimiento,
      });

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil de Socio"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cabecera resumen socio */}
        {socio && (
          <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-zinc-800/80 rounded-xl border border-gray-100 dark:border-zinc-700">
            <div className="h-12 w-12 rounded-full bg-club-blue/15 dark:bg-club-blue/30 text-club-blue dark:text-blue-400 font-bold text-xl flex items-center justify-center flex-shrink-0">
              {nombre ? nombre[0].toUpperCase() : 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {nombre} {apellidos}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                ID: {socio.id} • DNI: {dni || 'Sin DNI'}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${activo
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
            >
              {activo ? 'Activo' : 'Suspendido'}
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors"
              placeholder="Ej: Juan"
            />
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Apellidos
            </label>
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors"
              placeholder="Ej: Pérez Rodríguez"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors"
              placeholder="socio@ejemplo.com"
            />
          </div>

          {/* DNI */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              DNI / NIE
            </label>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors"
              placeholder="12345678A"
            />
          </div>

          {/* Número de socio */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Nº de Socio
            </label>
            <input
              type="text"
              value={numeroSocio}
              onChange={(e) => setNumeroSocio(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors"
              placeholder="ARD-2025-0042"
            />
          </div>

          {/* Plan */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Plan de membresía
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors"
            >
              <option value="Socio">Socio (Normal - 60€/año)</option>
              <option value="Socio Premium">Socio Premium (120€/año)</option>
              <option value="socio">socio</option>
              <option value="socio_premium">socio_premium</option>
              <option value="Honorífico">Honorífico</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Estado de la cuenta
            </label>
            <select
              value={activo ? 'activo' : 'suspendido'}
              onChange={(e) => setActivo(e.target.value === 'activo')}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors"
            >
              <option value="activo">Activo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>

          {/* Fecha Vencimiento */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              value={vencimiento}
              onChange={(e) => setVencimiento(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors"
            />
          </div>

          {/* Contraseña de acceso */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Contraseña de acceso
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-club-blue transition-colors font-mono"
              placeholder="Contraseña del socio (ej: 123456)"
            />
            <p className="text-xs text-gray-400 mt-1">
              El socio usa su DNI y esta contraseña para ingresar al panel de socio.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-center cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-sm font-bold text-white bg-club-blue hover:bg-club-blue-dark rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {guardando && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
}
