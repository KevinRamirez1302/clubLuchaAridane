// Tabla de precios de membresía con planes Socio y Socio Premium
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {planes.map((plan) => (
        <div
          key={plan.id}
          className={`relative flex flex-col rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
            plan.destacado
              ? 'border-club-orange shadow-2xl shadow-club-orange/20 scale-105 z-10'
              : 'border-gray-200 dark:border-gray-700 shadow-lg'
          }`}
        >
          {/* Badge destacado */}
          {plan.destacado && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <span className="bg-club-orange text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                Más popular
              </span>
            </div>
          )}

          {/* Header */}
          <div
            className={`p-8 pt-10 ${
              plan.destacado
                ? 'bg-club-orange text-white'
                : 'bg-club-blue text-white'
            }`}
          >
            <h3 className="text-2xl font-black uppercase tracking-wide mb-1">{plan.nombre}</h3>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black">{plan.precio}€</span>
              <span className="text-white/70 mb-1">/año</span>
            </div>
            <p className="text-white/70 text-sm mt-2">
              O {Math.round(plan.precio / 12)}€/mes si pagas mensualmente
            </p>
          </div>

          {/* Beneficios */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-8">
            <ul className="space-y-3 mb-8">
              {plan.beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      plan.destacado ? 'bg-club-orange/20 text-club-orange' : 'bg-club-green/20 text-club-green'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{b}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => onSelectPlan(plan)}
              className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg ${
                plan.destacado
                  ? 'bg-club-orange hover:bg-club-orange-dark shadow-club-orange/30'
                  : 'bg-club-blue hover:bg-club-blue-dark shadow-club-blue/20'
              }`}
            >
              {t('membresia.suscribirme')} — {plan.nombre}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
