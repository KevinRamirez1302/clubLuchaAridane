// Formulario de contacto con validación
// INTEGRACIÓN BACKEND: POST /api/contacto/mensaje
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FormContacto {
  nombre: string;
  email: string;
  mensaje: string;
}

const initialForm: FormContacto = { nombre: '', email: '', mensaje: '' };

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormContacto>(initialForm);
  const [errores, setErrores] = useState<Partial<FormContacto>>({});
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const validar = (): boolean => {
    const e: Partial<FormContacto> = {};
    if (!form.nombre.trim()) e.nombre = t('errores.campoRequerido');
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = t('errores.emailInvalido');
    if (form.mensaje.trim().length < 10) e.mensaje = t('errores.mensajeCorto');
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrores((err) => ({ ...err, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    setCargando(true);

    // ── INTEGRACIÓN BACKEND ──
    // await fetch('/api/contacto/mensaje', { method: 'POST', body: JSON.stringify(form) })
    await new Promise((r) => setTimeout(r, 1000));
    setCargando(false);
    setEnviado(true);
    setForm(initialForm);
  };

  const inputClass = (campo: keyof FormContacto) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-colors focus:outline-none focus:border-club-blue dark:focus:border-club-blue-light ${
      errores[campo]
        ? 'border-red-400'
        : 'border-gray-200 dark:border-gray-600'
    }`;

  return (
    <div>
      {enviado ? (
        <div className="bg-club-green/10 border border-club-green/30 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-club-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('contacto.exito')}</h3>
          <button
            onClick={() => setEnviado(false)}
            className="mt-4 text-club-blue dark:text-club-blue-light text-sm font-semibold hover:underline"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Nombre */}
          <div>
            <label htmlFor="contact-nombre" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t('contacto.nombre')} <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-nombre"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className={inputClass('nombre')}
              aria-describedby={errores.nombre ? 'error-nombre' : undefined}
              aria-invalid={!!errores.nombre}
            />
            {errores.nombre && (
              <p id="error-nombre" role="alert" className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t('contacto.email')} <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={inputClass('email')}
              aria-describedby={errores.email ? 'error-email' : undefined}
              aria-invalid={!!errores.email}
            />
            {errores.email && (
              <p id="error-email" role="alert" className="text-red-500 text-xs mt-1">{errores.email}</p>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <label htmlFor="contact-mensaje" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t('contacto.mensaje')} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-mensaje"
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              rows={5}
              placeholder="¿En qué podemos ayudarte?"
              className={`${inputClass('mensaje')} resize-none`}
              aria-describedby={errores.mensaje ? 'error-mensaje' : undefined}
              aria-invalid={!!errores.mensaje}
            />
            {errores.mensaje && (
              <p id="error-mensaje" role="alert" className="text-red-500 text-xs mt-1">{errores.mensaje}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-club-blue hover:bg-club-blue-dark text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {cargando && (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {t('contacto.enviar')}
          </button>
        </form>
      )}
    </div>
  );
}
