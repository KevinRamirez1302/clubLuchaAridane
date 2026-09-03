// Página "Hazte socio" — Pricing + Modal + FAQ + Cuenta de socio
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

interface MembershipProps {
  initialTab?: 'planes' | 'cuenta';
}

export default function Membership({ initialTab }: MembershipProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [planSeleccionado, setPlanSeleccionado] =
    useState<PlanMembresia | null>(null);

  const getInitialTab = (): 'planes' | 'cuenta' => {
    if (initialTab) return initialTab;
    if (location.pathname.includes('panel-socio')) return 'cuenta';
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'cuenta') return 'cuenta';
    return 'planes';
  };

  const [tabActivo, setTabActivo] = useState<'planes' | 'cuenta'>(getInitialTab);

  useEffect(() => {
    if (initialTab) {
      setTabActivo(initialTab);
    } else if (location.pathname.includes('panel-socio')) {
      setTabActivo('cuenta');
    } else if (location.pathname === '/hazte-socio') {
      const params = new URLSearchParams(location.search);
      setTabActivo(params.get('tab') === 'cuenta' ? 'cuenta' : 'planes');
    }
  }, [initialTab, location.pathname, location.search]);

  const refHero = useScrollReveal<HTMLElement>();
  const refFaq = useScrollReveal<HTMLElement>();

  return (
    <>
      <SEOHead
        title={tabActivo === 'cuenta' ? t('membresia.panelSocio') : t('membresia.titulo')}
        description={
          tabActivo === 'cuenta'
            ? 'Accede a tu panel de socio del Club Aridane, consulta tu carné digital y ventajas exclusivas.'
            : 'Únete a la familia del Club Aridane. Elige tu plan de membresía y disfruta de beneficios exclusivos como socio.'
        }
        url={tabActivo === 'cuenta' ? '/panel-socios' : '/hazte-socio'}
      />

      {/* Tabs Planes / Mi Cuenta en la parte superior */}
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
                className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
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
          {/* 1. Sección de Planes y Precios (arriba) */}
          <section
            className="py-12 lg:py-16 bg-white dark:bg-gray-950"
            role="tabpanel"
            aria-labelledby="tab-planes"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 sm:mb-12">
                <div className="inline-block section-line mx-auto" />
                <h1 className="font-display text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mt-2">
                  {t('membresia.planesTitle')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
                  Elige el plan que mejor se adapte a ti y forma parte de la familia Aridane.
                </p>
              </div>

              <PricingTable onSelectPlan={setPlanSeleccionado} />
            </div>
          </section>

          {/* 2. Sección Informativa Hazte Socio y Beneficios (abajo) */}
          <section
            ref={refHero}
            className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800"
            aria-label="Hazte socio — información"
          >
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <div className="section-line mx-auto inline-block mb-4" />
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('membresia.titulo')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                {t('membresia.descripcion')}
              </p>

              {/* Beneficios rápidos */}
              <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
                {BENEFICIOS_GENERALES.map(({ icon, texto }) => (
                  <span
                    key={texto}
                    className="bg-club-blue/10 dark:bg-club-blue/20 border border-club-blue/20 text-club-blue dark:text-club-blue-light px-4 py-2 rounded-full text-xs sm:text-sm font-medium"
                  >
                    {icon} {texto}
                  </span>
                ))}
              </div>
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
          className="py-12 lg:py-20 bg-white dark:bg-gray-950"
          role="tabpanel"
          aria-labelledby="tab-cuenta"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="section-line mx-auto inline-block" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mt-2">
                {t('membresia.miCuenta')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base max-w-lg mx-auto">
                Accede a tu cuenta de socio, consulta tu carné digital y gestiona tu información del club.
              </p>
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
