// Página de Aviso Legal — Club Aridane
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
        <span className="h-5 w-1 bg-club-blue rounded-full flex-shrink-0" />
        {title}
      </h2>
      <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed space-y-3 pl-4">
        {children}
      </div>
    </section>
  );
}

const SECCIONES = [
  { id: 'titular', label: 'Datos identificativos del titular' },
  { id: 'objeto', label: 'Objeto y ámbito de aplicación' },
  { id: 'propiedad-intelectual', label: 'Propiedad intelectual e industrial' },
  { id: 'condiciones-uso', label: 'Condiciones de uso' },
  { id: 'responsabilidad', label: 'Limitación de responsabilidad' },
  { id: 'enlaces', label: 'Política de enlaces' },
  { id: 'ley-aplicable', label: 'Ley aplicable y jurisdicción' },
  { id: 'modificaciones', label: 'Modificaciones del aviso legal' },
];

export default function AvisoLegal() {
  return (
    <>
      <SEOHead
        title="Aviso Legal | Club Aridane"
        description="Aviso legal del Club Aridane. Información sobre los términos de uso del sitio web, propiedad intelectual y condiciones aplicables."
        url="/aviso-legal"
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest bg-white/10 rounded-full mb-4">
            Legal
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black mb-3">
            Aviso Legal
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Última actualización: <strong className="text-white">{ULTIMA_ACTUALIZACION}</strong>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Índice lateral */}
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
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-club-blue dark:hover:text-club-blue-light py-1.5 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-xl text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
                El acceso y uso de este sitio web implica la aceptación plena del presente Aviso Legal.
              </div>
            </div>
          </aside>

          {/* Contenido */}
          <article className="flex-1 min-w-0 space-y-10">

            <Section id="titular" title="1. Datos identificativos del titular">
              <p>
                En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
                Información y Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos del
                titular del sitio web:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm border border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Denominación:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Club Lucha Aridane</span>
                <span className="text-gray-500">CIF / NIF:</span>
                <span className="font-semibold text-gray-900 dark:text-white">G38266193</span>
                <span className="text-gray-500">Domicilio social:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Polideportivo Camilo León, 38760 Los Llanos de Aridane, Santa Cruz de Tenerife</span>
                <span className="text-gray-500">Correo electrónico:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  <a href="mailto:claridane46@gmail.com" className="text-club-blue dark:text-club-blue-light hover:underline">
                    claridane46@gmail.com
                  </a>
                </span>
                <span className="text-gray-500">Instagram:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  <a href="https://www.instagram.com/cl_aridane_/" target="_blank" rel="noopener noreferrer" className="text-club-blue dark:text-club-blue-light hover:underline">
                    @cl_aridane_
                  </a>
                </span>
                <span className="text-gray-500">Facebook:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  <a href="https://www.facebook.com/profile.php?id=61594125023847" target="_blank" rel="noopener noreferrer" className="text-club-blue dark:text-club-blue-light hover:underline">
                    Club Lucha Aridane
                  </a>
                </span>
              </div>
            </Section>

            <Section id="objeto" title="2. Objeto y ámbito de aplicación">
              <p>
                El presente Aviso Legal regula el acceso y uso del sitio web del Club Lucha Aridane
                (en adelante, "el Club"), club deportivo dedicado a la lucha canaria, fundado en 1946
                en Los Llanos de Aridane, La Palma.
              </p>
              <p>
                El acceso a este sitio web es gratuito. El usuario se compromete a utilizar el sitio
                y sus contenidos conforme a la Ley, la moral, el orden público y el presente Aviso Legal,
                absteniéndose de utilizarlos de manera que pudiera resultar dañina, ilegítima o perjudicial
                para el Club, terceros o el propio sistema informático.
              </p>
              <p>
                El Club se reserva el derecho de modificar, suspender o interrumpir el acceso al sitio
                web en cualquier momento y sin previo aviso.
              </p>
            </Section>

            <Section id="propiedad-intelectual" title="3. Propiedad intelectual e industrial">
              <p>
                Todos los contenidos de este sitio web (textos, fotografías, gráficos, imágenes, logos,
                marcas, iconos, tecnología, software, enlaces y demás contenidos audiovisuales o sonoros)
                son propiedad del Club Lucha Aridane o de terceros que han autorizado su uso, y están
                protegidos por la legislación española e internacional sobre propiedad intelectual e
                industrial.
              </p>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-300">
                <strong>Queda expresamente prohibido</strong> reproducir, distribuir, modificar, comunicar
                públicamente, transformar o descompilar cualquier elemento del sitio web sin autorización
                expresa y por escrito del Club Lucha Aridane.
              </div>
              <p>
                El escudo del club, su nombre, denominaciones y cualquier signo distintivo son marcas
                registradas del Club Lucha Aridane. Su uso no autorizado está prohibido.
              </p>
              <p>
                Las referencias a nombres, marcas registradas o marcas de servicio de terceros son
                propiedad de sus respectivos dueños.
              </p>
            </Section>

            <Section id="condiciones-uso" title="4. Condiciones de uso">
              <p>
                El usuario se obliga a hacer un uso correcto del sitio web y de conformidad con las
                leyes vigentes. En particular, el usuario se compromete a no:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1.5">
                <li>Reproducir, copiar, distribuir o comunicar públicamente cualquier contenido del sitio sin autorización.</li>
                <li>Utilizar técnicas de ingeniería inversa, descompilar o desensamblar el software del sitio.</li>
                <li>Introducir virus, malware o cualquier otro programa que pueda dañar los sistemas del Club o de terceros.</li>
                <li>Suplantar la identidad de otra persona o entidad.</li>
                <li>Recopilar datos de terceros usuarios sin su consentimiento.</li>
                <li>Utilizar el sitio con fines comerciales no autorizados por el Club.</li>
              </ul>
              <p>
                El incumplimiento de estas condiciones puede dar lugar a la adopción de medidas
                legales por parte del Club.
              </p>
            </Section>

            <Section id="responsabilidad" title="5. Limitación de responsabilidad">
              <p>
                El Club Lucha Aridane no garantiza la disponibilidad continua e ininterrumpida del sitio
                web ni la ausencia de errores en sus contenidos. El Club se reserva el derecho de
                modificar los contenidos en cualquier momento sin previo aviso.
              </p>
              <p>
                El Club no será responsable de los daños y perjuicios que pudieran derivarse de:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1.5">
                <li>Interrupciones, errores o falta de disponibilidad del sitio por causas ajenas al Club (fallos de internet, de terceros proveedores, etc.).</li>
                <li>El uso del sitio web por parte del usuario de manera contraria a las presentes condiciones.</li>
                <li>La presencia de virus u otros programas maliciosos en los contenidos o servicios prestados por terceros a través del sitio.</li>
                <li>Errores u omisiones en los contenidos del sitio, sin perjuicio de las responsabilidades del Club por actos propios.</li>
              </ul>
            </Section>

            <Section id="enlaces" title="6. Política de enlaces">
              <p>
                El sitio web puede contener enlaces a páginas de terceros (redes sociales, federaciones
                deportivas, medios de comunicación, etc.). Dichos enlaces se facilitan únicamente a
                efectos informativos. El Club no controla ni se hace responsable de los contenidos,
                políticas de privacidad o prácticas de dichos sitios de terceros.
              </p>
              <p>
                Si algún tercero desea incluir un enlace a este sitio web desde el suyo, deberá solicitar
                autorización previa por escrito al Club. Se prohíbe expresamente el uso de técnicas de
                <em>framing</em> o el establecimiento de <em>deep links</em> sin autorización.
              </p>
            </Section>

            <Section id="ley-aplicable" title="7. Ley aplicable y jurisdicción">
              <p>
                El presente Aviso Legal se rige por la legislación española vigente. Para la resolución
                de cualquier controversia derivada del acceso o uso del sitio web, las partes se someten
                a los Juzgados y Tribunales de <strong>Santa Cruz de Tenerife</strong>, renunciando
                expresamente a cualquier otro fuero que pudiera corresponderles.
              </p>
              <p>
                Normativa aplicable principal:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1">
                <li>Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE).</li>
                <li>Reglamento (UE) 2016/679 General de Protección de Datos (RGPD).</li>
                <li>Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD).</li>
                <li>Real Decreto Legislativo 1/1996 de Propiedad Intelectual (TRLPI).</li>
              </ul>
            </Section>

            <Section id="modificaciones" title="8. Modificaciones del aviso legal">
              <p>
                El Club Lucha Aridane se reserva el derecho de actualizar, modificar o eliminar en
                cualquier momento la información contenida en este Aviso Legal, así como su configuración
                y presentación, sin que ello genere ningún tipo de responsabilidad.
              </p>
              <p>
                Recomendamos al usuario revisar periódicamente este aviso. La fecha de última actualización
                aparece al inicio del documento.
              </p>
            </Section>

            {/* Volver */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-club-blue dark:text-club-blue-light font-semibold hover:underline"
              >
                ← Volver al inicio
              </Link>
              <Link
                to="/politica-privacidad"
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-club-orange dark:hover:text-club-orange transition-colors"
              >
                Leer la Política de Privacidad →
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
