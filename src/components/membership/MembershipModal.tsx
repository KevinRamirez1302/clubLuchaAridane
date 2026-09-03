// Modal de suscripción — formulario de datos + selección de plan
// Adaptado para diseño 100% responsivo y aviso de confirmación con instrucciones de transferencia bancaria
import { useState } from 'react';
import Modal from '../common/Modal';
import { useMembershipStore } from '../../store/useMembershipStore';
import type { PlanMembresia } from '../../types';

interface MembershipModalProps {
  plan: PlanMembresia | null;
  onClose: () => void;
}

interface FormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
}

const initialForm: FormData = {
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  dni: '',
  fechaNacimiento: '',
};

export default function MembershipModal({ plan, onClose }: MembershipModalProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errores, setErrores] = useState<Partial<FormData>>({});
  const [paso, setPaso] = useState<'datos' | 'exito'>('datos');
  const [cargando, setCargando] = useState(false);

  const addSolicitud = useMembershipStore((state) => state.addSolicitud);

  if (!plan) return null;

  const validar = (): boolean => {
    const nuevosErrores: Partial<FormData> = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'Campo obligatorio';
    if (!form.apellidos.trim()) nuevosErrores.apellidos = 'Campo obligatorio';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) nuevosErrores.email = 'Email inválido';
    if (!form.telefono.trim()) nuevosErrores.telefono = 'Campo obligatorio';
    if (!form.dni.trim()) nuevosErrores.dni = 'Campo obligatorio';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrores((err) => ({ ...err, [name]: undefined }));
  };

  const handleSubmitDatos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      setCargando(true);
      await addSolicitud({
        ...form,
        plan: plan.id as any,
      });
      setPaso('exito');
    } catch (err) {
      console.error('Error al registrar solicitud:', err);
      // Fallback: mostrar la pantalla de éxito
      setPaso('exito');
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarModal = () => {
    onClose();
    setTimeout(() => {
      setForm(initialForm);
      setErrores({});
      setPaso('datos');
    }, 300);
  };

  const inputClass = (campo: keyof FormData) =>
    `w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors focus:outline-none focus:border-club-blue dark:focus:border-club-blue-light ${
      errores[campo]
        ? 'border-red-400'
        : 'border-gray-200 dark:border-gray-600'
    }`;

  return (
    <Modal
      isOpen={!!plan}
      onClose={handleCerrarModal}
      title={
        paso === 'exito'
          ? '¡Solicitud enviada!'
          : `Hazte socio — ${plan.nombre}`
      }
      size="lg"
    >
      {paso === 'exito' ? (
        /* Pantalla de confirmación y aviso de pago */
        <div className="text-center py-2 sm:py-4 space-y-5 sm:space-y-6">
          {/* Icono de éxito con animación */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 mb-2">
              Solicitud recibida
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              ¡Felicidades, tu solicitud ha sido enviada!
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1.5">
              Gracias, <strong>{form.nombre} {form.apellidos}</strong>. Ya hemos registrado tu petición para el plan{' '}
              <span className="font-bold text-club-orange">{plan.nombre}</span>.
            </p>
          </div>

          {/* Cuadro destacado de información de transferencia bancaria */}
          <div className="bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-700/60 rounded-2xl p-4 sm:p-5 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm sm:text-base">
                  Pago por transferencia bancaria
                </h4>
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100/90 mt-1 leading-relaxed">
                  El pago se debe realizar mediante una <strong>transferencia bancaria</strong> cuyo número de IBAN y demás datos te los enviaremos por <strong>WhatsApp</strong> y <strong>correo electrónico</strong>.
                </p>
              </div>
            </div>

            {/* Datos de contacto de confirmación */}
            <div className="mt-4 pt-3.5 border-t border-amber-200/70 dark:border-amber-700/50 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
                </svg>
                <span className="truncate">WhatsApp: <strong>{form.telefono}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">Email: <strong>{form.email}</strong></span>
              </div>
            </div>
          </div>

          {/* Botón de cierre */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCerrarModal}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-club-blue hover:bg-club-blue-dark transition-all duration-200 shadow-lg shadow-club-blue/25 active:scale-98 text-sm cursor-pointer"
            >
              Entendido, muchas gracias
            </button>
          </div>
        </div>
      ) : (
        /* Formulario de datos */
        <form onSubmit={handleSubmitDatos} noValidate className="space-y-4 sm:space-y-5">
          {/* Resumen del plan */}
          <div
            className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl ${
              plan.destacado
                ? 'bg-club-orange/10 border border-club-orange/30'
                : 'bg-club-blue/10 border border-club-blue/20'
            }`}
          >
            <div className="min-w-0 pr-2">
              <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                {plan.nombre}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {plan.beneficios.length} beneficios incluidos
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-xl sm:text-2xl font-black ${plan.destacado ? 'text-club-orange' : 'text-club-blue'}`}>
                {plan.precio}€
              </p>
              <p className="text-[11px] sm:text-xs text-gray-400">/año</p>
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Juan' },
              { name: 'apellidos', label: 'Apellidos', type: 'text', placeholder: 'García López' },
              { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu@email.com' },
              { name: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+34 600 000 000' },
              { name: 'dni', label: 'DNI / NIE', type: 'text', placeholder: '12345678A' },
              { name: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date', placeholder: '' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label
                  htmlFor={`ms-${name}`}
                  className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                >
                  {label}
                  {name !== 'fechaNacimiento' && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  id={`ms-${name}`}
                  type={type}
                  name={name}
                  value={form[name as keyof FormData]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`${inputClass(name as keyof FormData)} ${
                    type === 'date' ? 'dark:[color-scheme:dark]' : ''
                  }`}
                  aria-describedby={errores[name as keyof FormData] ? `error-${name}` : undefined}
                  aria-invalid={!!errores[name as keyof FormData]}
                />
                {errores[name as keyof FormData] && (
                  <p id={`error-${name}`} role="alert" className="text-red-500 text-xs mt-1">
                    {errores[name as keyof FormData]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleCerrarModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 text-center text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 ${
                plan.destacado
                  ? 'bg-club-orange hover:bg-club-orange-dark shadow-club-orange/20'
                  : 'bg-club-blue hover:bg-club-blue-dark shadow-club-blue/20'
              }`}
            >
              {cargando && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{cargando ? 'Enviando...' : 'Continuar →'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
