// Página "Hazte socio" — Pricing + Modal + FAQ + Cuenta de socio
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/common/SEOHead';
import PricingTable from '../components/membership/PricingTable';
import MembershipModal from '../components/membership/MembershipModal';
import FAQSection from '../components/membership/FAQSection';
import MemberAccount from '../components/membership/MemberAccount';
import { useScrollReveal } from '../hooks/useScrollReveal';
import type { PlanMembresia } from '../types';

const BENEFICIOS_GENERALES = [
  { icon: '', texto: 'Entrada a todas las luchadas en casa' },
  { icon: '', texto: 'Comunidad de más de 500 socios' },
  { icon: '', texto: 'Siente nuestra lucha de cerca' },
  { icon: '', texto: 'Apoya a tu club favorito' },
];

export default function Membership() {
  const { t } = useTranslation();
  const [planSeleccionado, setPlanSeleccionado] =
    useState<PlanMembresia | null>(null);
  const [tabActivo, setTabActivo] = useState<'planes' | 'cuenta'>('planes');
  const refHero = useScrollReveal<HTMLElement>();
  const refPlanes = useScrollReveal<HTMLElement>();
  const refFaq = useScrollReveal<HTMLElement>();

  return (
    <>
      <SEOHead
        title="Hazte socio"
        description="Únete a la familia del Club Aridane. Elige tu plan de membresía y disfruta de beneficios exclusivos como socio."
        url="/hazte-socio"
      />

      {/* Hero */}
      <section
        ref={refHero}
        className="reveal py-20 lg:py-32 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800"
        aria-label="Hazte socio — encabezado"
      >
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="section-line mx-auto inline-block mb-4" />
          <h1 className="font-display text-5xl sm:text-7xl text-gray-900 dark:text-white mb-6">
            {t('membresia.titulo')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('membresia.descripcion')}
          </p>

          {/* Beneficios rápidos */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {BENEFICIOS_GENERALES.map(({ icon, texto }) => (
              <span
                key={texto}
                className="bg-club-blue/10 dark:bg-club-blue/20 border border-club-blue/20 text-club-blue dark:text-club-blue-light px-4 py-2 rounded-full text-sm font-medium"
              >
                {icon} {texto}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Planes / Mi Cuenta */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex" role="tablist">
            {[
              { key: 'planes', label: t('membresia.planesTitle') },
              { key: 'cuenta', label: t('membresia.panelSocio') },
            ].map(({ key, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={tabActivo === key}
                onClick={() => setTabActivo(key as typeof tabActivo)}
                className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${
                  tabActivo === key
                    ? 'border-club-orange text-club-orange'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Planes */}
      {tabActivo === 'planes' && (
        <>
          <section
            ref={refPlanes}
            className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950"
            role="tabpanel"
            aria-labelledby="tab-planes"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <div className="inline-block section-line mx-auto" />
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                  {t('membresia.planesTitle')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
                  Elige el plan que mejor se adapte a ti y forma parte de la
                  familia Aridane.
                </p>
              </div>
              <PricingTable onSelectPlan={setPlanSeleccionado} />
            </div>
          </section>

          {/* FAQ */}
          <section
            ref={refFaq}
            className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950"
            aria-labelledby="faq-titulo"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="section-line mx-auto inline-block" />
                <h2
                  id="faq-titulo"
                  className="text-4xl font-bold text-gray-900 dark:text-white"
                >
                  Preguntas frecuentes
                </h2>
              </div>
              <FAQSection />
            </div>
          </section>
        </>
      )}

      {/* Panel Cuenta */}
      {tabActivo === 'cuenta' && (
        <section
          className="py-16 lg:py-24 bg-white dark:bg-gray-950"
          role="tabpanel"
          aria-labelledby="tab-cuenta"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="section-line mx-auto inline-block" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                {t('membresia.miCuenta')}
              </h2>
            </div>
            <MemberAccount />
          </div>
        </section>
      )}

      {/* Modal de suscripción */}
      <MembershipModal
        plan={planSeleccionado}
        onClose={() => setPlanSeleccionado(null)}
      />
    </>
  );
}
