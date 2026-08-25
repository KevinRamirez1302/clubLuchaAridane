// Modal de suscripción — formulario de datos + selección de plan
// INTEGRACIÓN BACKEND: al enviar el formulario se debe conectar con la pasarela de pago
// y el endpoint POST /api/socios/nueva-membresia
import { useState } from 'react';
import Modal from '../common/Modal';
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
  const [paso, setPaso] = useState<'datos' | 'confirmacion'>('datos');
  const [cargando, setCargando] = useState(false);

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

  const handleSubmitDatos = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) setPaso('confirmacion');
  };

  const handlePago = async () => {
    setCargando(true);

    // ════════════════════════════════════════════════════════════════════
    // INTEGRACIÓN BACKEND — PASARELA DE PAGO
    // Aquí se debe:
    // 1. Enviar los datos del socio al backend: POST /api/socios/nueva-membresia
    // 2. Recibir la URL de la pasarela de pago (Stripe, PayPal, Redsys, etc.)
    // 3. Redirigir al usuario: window.location.href = data.checkout_url
    //
    // Ejemplo:
    // const res = await fetch('/api/socios/nueva-membresia', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...form, planId: plan.id }),
    // });
    // const data = await res.json();
    // window.location.href = data.checkout_url;
    // ════════════════════════════════════════════════════════════════════

    // Simulación: esperar 1.5s y mostrar éxito
    await new Promise((r) => setTimeout(r, 1500));
    setCargando(false);
    alert(`✅ ¡Gracias, ${form.nombre}! Tu solicitud de membresía "${plan.nombre}" ha sido registrada. En breve recibirás un email con los pasos para completar el pago.`);
    onClose();
    setForm(initialForm);
    setPaso('datos');
  };

  const inputClass = (campo: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors focus:outline-none focus:border-club-blue dark:focus:border-club-blue-light ${
      errores[campo]
        ? 'border-red-400'
        : 'border-gray-200 dark:border-gray-600'
    }`;

  return (
    <Modal
      isOpen={!!plan}
      onClose={onClose}
      title={paso === 'datos' ? `Hazte socio — ${plan.nombre}` : 'Confirmar suscripción'}
      size="lg"
    >
      {paso === 'datos' ? (
        <form onSubmit={handleSubmitDatos} noValidate>
          {/* Resumen del plan */}
          <div
            className={`flex items-center justify-between p-4 rounded-xl mb-6 ${
              plan.destacado
                ? 'bg-club-orange/10 border border-club-orange/30'
                : 'bg-club-blue/10 border border-club-blue/20'
            }`}
          >
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{plan.nombre}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{plan.beneficios.length} beneficios incluidos</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-black ${plan.destacado ? 'text-club-orange' : 'text-club-blue'}`}>
                {plan.precio}€
              </p>
              <p className="text-xs text-gray-400">/año</p>
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
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
                  className={inputClass(name as keyof FormData)}
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

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 ${
                plan.destacado ? 'bg-club-orange hover:bg-club-orange-dark' : 'bg-club-blue hover:bg-club-blue-dark'
              }`}
            >
              Continuar →
            </button>
          </div>
        </form>
      ) : (
        /* Paso 2: Confirmación */
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Resumen de tu solicitud</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-gray-500">Nombre:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{form.nombre} {form.apellidos}</span>
              <span className="text-gray-500">Email:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{form.email}</span>
              <span className="text-gray-500">Plan:</span>
              <span className={`font-black ${plan.destacado ? 'text-club-orange' : 'text-club-blue'}`}>{plan.nombre}</span>
              <span className="text-gray-500">Importe:</span>
              <span className="font-black text-gray-900 dark:text-white">{plan.precio}€/año</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
            Al hacer clic en "Proceder al pago" serás redirigido a nuestra pasarela de pago segura para completar la suscripción.
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setPaso('datos')} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              ← Volver
            </button>
            <button
              onClick={handlePago}
              disabled={cargando}
              className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 ${
                plan.destacado ? 'bg-club-orange hover:bg-club-orange-dark' : 'bg-club-blue hover:bg-club-blue-dark'
              }`}
            >
              {cargando && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {cargando ? 'Procesando...' : '🔒 Proceder al pago'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
