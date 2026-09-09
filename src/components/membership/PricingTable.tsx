// Tabla de precios de membresía — un único plan Socio Abonado
import { useTranslation } from 'react-i18next';
import planesData from '../../data/planes.json';
import type { PlanMembresia } from '../../types';

const planes = planesData as PlanMembresia[];

interface PricingTableProps {
  onSelectPlan: (plan: PlanMembresia) => void;
}

export default function PricingTable({ onSelectPlan }: PricingTableProps) {
  const { t } = useTranslation();
  const plan = planes[0];

  if (!plan) return null;

  return (
    <div className="flex justify-center pt-6 max-w-lg mx-auto">
      <div className="relative w-full flex flex-col justify-between rounded-3xl bg-gradient-to-b from-club-blue/10 via-white to-white dark:from-club-blue/20 dark:via-gray-900 dark:to-gray-950 border-2 border-club-blue shadow-2xl shadow-club-blue/20 transition-all duration-300">

        {/* Badge superior */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-club-blue to-club-blue-dark text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-club-blue/30 ring-2 ring-white dark:ring-gray-900">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Membresía Oficial
          </span>
        </div>

        {/* Parte superior: Información y Precio */}
        <div className="p-8 sm:p-10 pb-6">
          {/* Categoría y temporada */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-club-blue/10 text-club-blue dark:bg-club-blue/20 dark:text-club-blue-light">
              Abono Temporada
            </span>
            <span className="text-xs text-gray-400 font-semibold">Temporada 2026/27</span>
          </div>

          <h3 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-3">
            {plan.nombre}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
            Hazte socio del Club de Lucha Aridane y disfruta de todos los beneficios durante la temporada apoyando a los nuestros.
          </p>

          {/* Bloque de Precio */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
                {plan.precio}€
              </span>
              <span className="text-base font-bold text-gray-400 dark:text-gray-500">/ temporada</span>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-club-blue/8 dark:bg-club-blue/15 border border-club-blue/20 text-xs font-semibold text-club-blue dark:text-club-blue-light">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pago único por temporada</span>
            </div>
          </div>
        </div>

        {/* Separador */}
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
              {plan.beneficios.map((beneficio, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 border border-emerald-500/30">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm leading-snug text-gray-700 dark:text-gray-300">
                    {beneficio}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botón CTA */}
          <div className="mt-8 pt-4">
            <button
              onClick={() => onSelectPlan(plan)}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer bg-gradient-to-r from-club-blue to-club-blue-dark text-white shadow-lg shadow-club-blue/30 hover:shadow-xl hover:shadow-club-blue/40 hover:scale-[1.02] active:scale-95 ring-2 ring-club-blue/30"
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
    </div>
  );
}
