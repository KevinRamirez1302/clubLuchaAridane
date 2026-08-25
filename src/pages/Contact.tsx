// Página de Contacto
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/common/SEOHead';
import ContactForm from '../components/contact/ContactForm';
import { useScrollReveal } from '../hooks/useScrollReveal';

const DATOS_CONTACTO = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    titulo: 'Dirección',
    valor: 'Calle del Estadio, 1\n00000 Ciudad, España',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    titulo: 'Teléfono',
    valor: '+34 900 000 000',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    titulo: 'Email',
    valor: 'info@clubariadne.es',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    titulo: 'Horario de oficina',
    valor: 'Lunes a Viernes\n9:00 — 14:00 h',
  },
];

export default function Contact() {
  const { t } = useTranslation();
  const refContent = useScrollReveal<HTMLElement>();

  return (
    <>
      <SEOHead
        title="Contacto"
        description="Ponte en contacto con el Club Ariadne. Estamos aquí para ayudarte con cualquier consulta sobre membresías, partidos o el club."
        url="/contacto"
      />

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="section-line mx-auto inline-block mb-4" />
          <h1 className="font-display text-5xl sm:text-7xl text-gray-900 dark:text-white mb-4">
            {t('contacto.titulo')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl">
            Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <section
        ref={refContent}
        className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Formulario */}
            <div>
              <div className="section-line" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Envíanos un mensaje
              </h2>
              <ContactForm />
            </div>

            {/* Datos de contacto */}
            <div>
              <div className="section-line" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Información de contacto
              </h2>

              <div className="space-y-6 mb-10">
                {DATOS_CONTACTO.map(({ icon, titulo, valor }) => (
                  <div key={titulo} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-club-blue/10 dark:bg-club-blue/20 rounded-xl flex items-center justify-center text-club-blue dark:text-club-blue-light flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">{titulo}</p>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{valor}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mapa embed — Google Maps */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 h-64">
                {/* INTEGRACIÓN: sustituir src con la URL real del mapa del club */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.369!2d-3.70325!3d40.41650!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI0JzU5LjQiTiAzwrA0MScxMS43Ilc!5e0!3m2!1ses!2ses!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del Club Ariadne en Google Maps"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
