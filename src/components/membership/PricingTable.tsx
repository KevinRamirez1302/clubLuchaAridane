// Tabla de precios de membresía con planes Socio y Socio Premium con diseño premium
import { useTranslation } from 'react-i18next';
import planesData from '../../data/planes.json';
import type { PlanMembresia } from '../../types';

const planes = planesData as PlanMembresia[];

interface PricingTableProps {
  onSelectPlan: (plan: PlanMembresia) => void;
}

export default function PricingTable({ onSelectPlan }: PricingTableProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto pt-6 items-stretch">
      {planes.map((plan) => {
        const esDestacado = plan.destacado;

        return (
          <div
            key={plan.id}
            className={`relative flex flex-col justify-between rounded-3xl transition-all duration-300 ${esDestacado
                ? 'bg-gradient-to-b from-orange-500/10 via-white to-white dark:from-club-orange/15 dark:via-gray-900 dark:to-gray-950 border-2 border-club-orange shadow-2xl shadow-club-orange/20 lg:-translate-y-2'
                : 'bg-gradient-to-b from-blue-500/5 via-white to-white dark:from-club-blue/15 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-white/10 shadow-xl hover:border-club-blue/50 dark:hover:border-club-blue/50'
              }`}
          >
            {/* Badge superior */}
            {esDestacado ? (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-club-orange to-amber-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-orange-500/30 ring-2 ring-white dark:ring-gray-900">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Más popular
                </span>
              </div>
            ) : (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-gray-200 dark:border-gray-700 shadow-sm ring-2 ring-white dark:ring-gray-900">
                  Plan Estándar
                </span>
              </div>
            )}

            {/* Parte superior: Información y Precio */}
            <div className="p-8 sm:p-10 pb-6">
              {/* Categoría y Nombre */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${esDestacado
                      ? 'bg-club-orange/15 text-club-orange dark:bg-club-orange/20 dark:text-club-orange-light'
                      : 'bg-club-blue/10 text-club-blue dark:bg-club-blue/20 dark:text-club-blue-light'
                    }`}
                >
                  {esDestacado ? 'Membresía VIP' : 'Membresía Oficial'}
                </span>
                <span className="text-xs text-gray-400 font-semibold">Temporada 2026/27</span>
              </div>

              <h3 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-3">
                {plan.nombre}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 min-h-[40px] leading-relaxed">
                {esDestacado
                  ? 'La experiencia completa del club con beneficios exclusivos, acceso VIP y eventos especiales.'
                  : 'Todo lo indispensable para disfrutar de cada luchada en casa y apoyar al equipo.'}
              </p>

              {/* Bloque de Precio */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
                    {plan.precio}€
                  </span>
                  <span className="text-base font-bold text-gray-400 dark:text-gray-500">/ año</span>
                </div>

                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <svg className="w-3.5 h-3.5 text-club-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span></span>
                </div>
              </div>
            </div>

            {/* Separador suave */}
            <div className="px-8 sm:px-10">
              <div className="border-t border-gray-100 dark:border-white/10" />
            </div>

            {/* Beneficios */}
            <div className="flex-1 p-8 sm:p-10 pt-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                  Ventajas incluidas:
                </p>

                <ul className="space-y-3.5">
                  {plan.beneficios.map((beneficio, i) => {
                    const esUpgrade = beneficio.toLowerCase().includes('todo lo incluido');
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${esDestacado
                              ? 'bg-club-orange/15 text-club-orange dark:bg-club-orange/25 dark:text-club-orange-light border border-club-orange/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border border-emerald-500/30'
                            }`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span
                          className={`text-sm leading-snug ${esUpgrade
                              ? 'font-bold text-club-orange dark:text-club-orange-light'
                              : 'text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {beneficio}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Botón CTA */}
              <div className="mt-8 pt-4">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${esDestacado
                      ? 'bg-gradient-to-r from-club-orange via-orange-500 to-club-orange-dark text-white shadow-lg shadow-club-orange/30 hover:shadow-xl hover:shadow-club-orange/40 hover:scale-[1.02] active:scale-95 ring-2 ring-club-orange/30'
                      : 'bg-gradient-to-r from-club-blue to-club-blue-dark text-white shadow-md shadow-club-blue/20 hover:shadow-xl hover:shadow-club-blue/30 hover:scale-[1.02] active:scale-95'
                    }`}
                >
                  <span>{t('membresia.suscribirme')} — {plan.nombre}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-2.5 flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Proceso 100% seguro • Alta inmediata</span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
