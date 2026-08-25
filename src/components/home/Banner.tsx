// Banner principal hero a pantalla completa
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Imagen de fondo del banner (Unsplash — estadio de fútbol)
const BANNER_IMAGE =
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&auto=format&fit=crop&q=80';

export default function Banner() {
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Banner principal Club Ariadne"
    >
      {/* Imagen de fondo con parallax visual */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
        role="img"
        aria-label="Terrero de lucha del Club Ariadne"
      />

      {/* Overlay con gradiente de colores del club */}
      <div className="gradient-hero absolute inset-0" />

      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-club-orange/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-club-blue-light/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Badge año */}
        <span className="inline-block bg-club-orange/90 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 backdrop-blur-sm">
          Desde 1958
        </span>

        {/* Título principal */}
        <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl text-white leading-none mb-4 drop-shadow-2xl">
          CLUB<br />
          <span className="text-club-orange">ARIADNE</span>
        </h1>

        {/* Eslogan */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-light mb-3 drop-shadow">
          {t('home.banner.eslogan')}
        </p>
        <p className="text-base sm:text-lg text-white/70 mb-10 drop-shadow">
          {t('home.banner.subtitulo')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/hazte-socio"
            className="w-full sm:w-auto bg-club-orange text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-club-orange-dark transition-all duration-200 shadow-2xl hover:shadow-club-orange/30 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t('home.banner.cta')}
          </Link>
          <a
            href="#proximos-partidos"
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-200"
          >
            Ver luchadas
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs">
        <span className="uppercase tracking-widest">Explorar</span>
        <div className="w-0.5 h-8 bg-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-club-orange animate-bounce" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>
    </section>
  );
}
