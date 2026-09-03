// Página de Política de Privacidad — Club Aridane
import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';

const ULTIMA_ACTUALIZACION = '3 de septiembre de 2025';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
        <span className="h-5 w-1 bg-club-orange rounded-full flex-shrink-0" />
        {title}
      </h2>
      <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed space-y-3 pl-4">
        {children}
      </div>
    </section>
  );
}

const SECCIONES = [
  { id: 'responsable', label: 'Responsable del tratamiento' },
  { id: 'datos-recogidos', label: 'Datos que recogemos' },
  { id: 'finalidad', label: 'Finalidad y base jurídica' },
  { id: 'conservacion', label: 'Conservación de los datos' },
  { id: 'derechos', label: 'Tus derechos' },
  { id: 'cookies', label: 'Política de cookies' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'menores', label: 'Menores de edad' },
  { id: 'contacto', label: 'Contacto' },
];

export default function PoliticaPrivacidad() {
  return (
    <>
      <SEOHead
        title="Política de Privacidad | Club Aridane"
        description="Consulta la política de privacidad del Club Aridane. Información sobre el tratamiento de tus datos personales, tus derechos y cómo protegemos tu privacidad."
        url="/politica-privacidad"
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-club-blue-dark to-club-blue text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-white/10 rounded-full mb-4">
            Legal
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black mb-3">
            Política de Privacidad
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Última actualización: <strong className="text-white">{ULTIMA_ACTUALIZACION}</strong>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Índice lateral (sticky en escritorio) */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                Contenido
              </h2>
              <nav className="space-y-1">
                {SECCIONES.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-club-orange dark:hover:text-club-orange py-1.5 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Si tienes dudas sobre el tratamiento de tus datos, escríbenos a{' '}
                <a href="mailto:claridane46@gmail.com" className="font-bold underline">
                  claridane46@gmail.com
                </a>
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <article className="flex-1 min-w-0 space-y-10">

            <Section id="responsable" title="1. Responsable del tratamiento">
              <p>
                En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo (RGPD) y la Ley Orgánica
                3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD),
                te informamos de que el responsable del tratamiento de tus datos personales es:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm border border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Nombre / Denominación:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Club Lucha Aridane</span>
                <span className="text-gray-500">CIF / NIF:</span>
                <span className="font-semibold text-gray-900 dark:text-white">G38266193</span>
                <span className="text-gray-500">Domicilio:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Polideportivo Camilo León, 38760 Los Llanos de Aridane, Santa Cruz de Tenerife</span>
                <span className="text-gray-500">Correo electrónico:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  <a href="mailto:claridane46@gmail.com" className="text-club-blue dark:text-club-blue-light hover:underline">
                    claridane46@gmail.com
                  </a>
                </span>
              </div>
            </Section>

            <Section id="datos-recogidos" title="2. Datos que recogemos">
              <p>
                Recogemos datos personales en los siguientes contextos:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2">
                <li>
                  <strong>Formulario de contacto:</strong> nombre, correo electrónico y mensaje.
                </li>
                <li>
                  <strong>Solicitud de membresía:</strong> nombre completo, apellidos, correo electrónico, teléfono, DNI/NIE y fecha de nacimiento.
                </li>
                <li>
                  <strong>Panel de socio:</strong> DNI/NIE (utilizado como nombre de usuario) y contraseña para acceder a tu área privada.
                </li>
                <li>
                  <strong>Cookies y datos de navegación:</strong> consultables en la sección "Política de cookies" de esta misma página.
                </li>
              </ul>
              <p>
                No recogemos datos especialmente protegidos (salud, ideología, etc.) ni cedemos tus datos a terceros salvo obligación legal.
              </p>
            </Section>

            <Section id="finalidad" title="3. Finalidad y base jurídica del tratamiento">
              <p>Tratamos tus datos con las siguientes finalidades:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                      <th className="text-left px-4 py-2.5 rounded-tl-lg font-semibold">Finalidad</th>
                      <th className="text-left px-4 py-2.5 font-semibold">Base jurídica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      ['Gestión de socios y membresías', 'Ejecución de contrato (Art. 6.1.b RGPD)'],
                      ['Respuesta a consultas y atención al socio', 'Interés legítimo (Art. 6.1.f RGPD)'],
                      ['Envío de comunicaciones del club (noticias, eventos)', 'Consentimiento (Art. 6.1.a RGPD)'],
                      ['Cumplimiento de obligaciones legales', 'Obligación legal (Art. 6.1.c RGPD)'],
                    ].map(([fin, base]) => (
                      <tr key={fin} className="odd:bg-gray-50 dark:odd:bg-gray-800/30">
                        <td className="px-4 py-2.5 text-gray-700 dark:text-gray-200">{fin}</td>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{base}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="conservacion" title="4. Conservación de los datos">
              <p>
                Conservamos tus datos únicamente durante el tiempo necesario para la finalidad para la que fueron recogidos:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2">
                <li>
                  <strong>Socios activos:</strong> durante toda la vigencia de la relación asociativa y hasta 5 años después de su cancelación, para cumplir obligaciones legales.
                </li>
                <li>
                  <strong>Consultas y formularios de contacto:</strong> 1 año desde la recepción.
                </li>
                <li>
                  <strong>Comunicaciones comerciales:</strong> hasta que revoques tu consentimiento.
                </li>
              </ul>
            </Section>

            <Section id="derechos" title="5. Tus derechos">
              <p>
                Tienes derecho a ejercer en cualquier momento, de forma gratuita, los siguientes derechos sobre tus datos personales:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {[
                  { derecho: 'Acceso', desc: 'Conocer qué datos tratamos sobre ti.' },
                  { derecho: 'Rectificación', desc: 'Corregir datos inexactos o incompletos.' },
                  { derecho: 'Supresión', desc: 'Solicitar la eliminación de tus datos.' },
                  { derecho: 'Oposición', desc: 'Oponerte al tratamiento de tus datos.' },
                  { derecho: 'Portabilidad', desc: 'Recibir tus datos en formato estructurado.' },
                  { derecho: 'Limitación', desc: 'Restringir el tratamiento en ciertos supuestos.' },
                ].map(({ derecho, desc }) => (
                  <div key={derecho} className="flex items-start gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700">
                    <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-club-blue/10 dark:bg-club-blue/25 flex items-center justify-center">
                      <svg className="w-3 h-3 text-club-blue dark:text-club-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{derecho}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                Para ejercer cualquiera de estos derechos, envía un correo a{' '}
                <a href="mailto:claridane46@gmail.com" className="text-club-blue dark:text-club-blue-light font-semibold hover:underline">
                  claridane46@gmail.com
                </a>{' '}
                adjuntando una copia de tu DNI/NIE. Responderemos en el plazo máximo de un mes.
                También puedes presentar una reclamación ante la{' '}
                <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-club-blue dark:text-club-blue-light font-semibold hover:underline">
                  Agencia Española de Protección de Datos (AEPD)
                </a>.
              </p>
            </Section>

            <Section id="cookies" title="6. Política de cookies">
              <p>
                Esta web utiliza cookies propias y de terceros para mejorar la experiencia de navegación:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                      <th className="text-left px-4 py-2.5 font-semibold rounded-tl-lg">Tipo</th>
                      <th className="text-left px-4 py-2.5 font-semibold">Descripción</th>
                      <th className="text-left px-4 py-2.5 font-semibold rounded-tr-lg">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      ['Técnicas / esenciales', 'Necesarias para el funcionamiento del sitio (sesión, preferencias de idioma y tema).', 'Sesión / 1 año'],
                      ['Analíticas', 'Miden el uso del sitio para mejorar la experiencia.', '13 meses'],
                    ].map(([tipo, desc, dur]) => (
                      <tr key={tipo} className="odd:bg-gray-50 dark:odd:bg-gray-800/30">
                        <td className="px-4 py-2.5 font-semibold text-gray-800 dark:text-gray-100">{tipo}</td>
                        <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">{desc}</td>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{dur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Puedes gestionar o revocar tu consentimiento en cualquier momento desde el enlace{' '}
                <strong>"Política de cookies"</strong> en el pie de página.
              </p>
            </Section>

            <Section id="seguridad" title="7. Seguridad">
              <p>
                Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos personales
                contra el acceso no autorizado, la alteración, divulgación o destrucción. Entre ellas:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1.5">
                <li>Transmisión de datos mediante protocolo HTTPS con cifrado TLS.</li>
                <li>Acceso restringido a los datos personales únicamente al personal autorizado.</li>
                <li>Contraseñas almacenadas con hash seguro.</li>
              </ul>
              <p>
                No obstante, ningún sistema es completamente seguro. En caso de brecha de seguridad que afecte
                a tus derechos, te notificaremos en los plazos establecidos por la normativa.
              </p>
            </Section>

            <Section id="menores" title="8. Menores de edad">
              <p>
                Nuestros servicios no están dirigidos a menores de 14 años. Si eres menor de 14 años, necesitas
                el consentimiento de tus padres o tutores legales para facilitarnos tus datos. Si detectamos
                que hemos recogido datos de un menor sin el consentimiento parental, los eliminaremos de
                inmediato.
              </p>
            </Section>

            <Section id="contacto" title="9. Contacto">
              <p>
                Si tienes cualquier duda o consulta relacionada con esta Política de Privacidad, puedes
                ponerte en contacto con nosotros a través de:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1.5">
                <li>
                  <strong>Correo electrónico:</strong>{' '}
                  <a href="mailto:claridane46@gmail.com" className="text-club-blue dark:text-club-blue-light hover:underline font-medium">
                    claridane46@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Dirección postal:</strong> Polideportivo Camilo León, 38760 Los Llanos de Aridane, Santa Cruz de Tenerife
                </li>
              </ul>
            </Section>

            {/* Volver al inicio */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-club-blue dark:text-club-blue-light font-semibold hover:underline"
              >
                ← Volver al inicio
              </Link>
              <Link
                to="/aviso-legal"
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-club-orange dark:hover:text-club-orange transition-colors"
              >
                Leer el Aviso Legal →
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
