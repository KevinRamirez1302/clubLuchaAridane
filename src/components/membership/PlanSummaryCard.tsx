// Tarjeta de resumen de suscripción optimizada para UX/UI y accesibilidad WCAG AAA
import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import type { PlanMembresia } from '../../types';

interface PlanSummaryCardProps {
  plan: PlanMembresia;
}

export default function PlanSummaryCard({ plan }: PlanSummaryCardProps) {
  const [expandido, setExpandido] = useState(false);

  // Mostramos los 3 primeros beneficios clave por defecto para no saturar el modal en móviles
  const beneficiosPrincipales = plan.beneficios.slice(0, 3);
  const beneficiosRestantes = plan.beneficios.slice(3);

  return (
    <section
      aria-label="Resumen de la suscripción"
      className="relative rounded-2xl bg-amber-50/90 dark:bg-gray-800/80 border-2 border-amber-200 dark:border-amber-600/40 p-4 sm:p-5 transition-all shadow-sm"
    >
      {/* Cabecera de la tarjeta: Título, Badge y Precio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-950 dark:bg-amber-900/60 dark:text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800 dark:text-amber-300" aria-hidden="true" />
              Temporada 2026/27
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white leading-tight">
            {plan.nombre}
          </h3>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5">
            Membresía oficial del Club de Lucha Aridane
          </p>
        </div>

        <div className="flex items-baseline sm:flex-col sm:items-end gap-1.5 sm:gap-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-amber-900 dark:text-amber-400 tracking-tight">
              {plan.precio}€
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              /temporada
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
            Pago único
          </span>
        </div>
      </div>

      {/* Lista de beneficios destacados para valor inmediato */}
      <div className="mt-3.5">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300 mb-2.5">
          Beneficios incluidos en tu cuota:
        </p>
        <ul className="space-y-2" role="list">
          {beneficiosPrincipales.map((beneficio, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
              <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
              </span>
              <span className="leading-snug">{beneficio}</span>
            </li>
          ))}

          {/* Beneficios adicionales desplegables */}
          {expandido &&
            beneficiosRestantes.map((beneficio, idx) => (
              <li
                key={`extra-${idx}`}
                className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 animate-fadeIn"
              >
                <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                </span>
                <span className="leading-snug">{beneficio}</span>
              </li>
            ))}
        </ul>

        {beneficiosRestantes.length > 0 && (
          <button
            type="button"
            onClick={() => setExpandido(!expandido)}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-club-orange-dark dark:text-club-orange-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange rounded cursor-pointer"
            aria-expanded={expandido}
          >
            {expandido ? (
              <>
                <span>Ver menos</span>
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              </>
            ) : (
              <>
                <span>+ {beneficiosRestantes.length} ventajas adicionales</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
