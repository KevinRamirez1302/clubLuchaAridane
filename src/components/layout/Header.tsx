// =============================================================================
// HEADER — Club Ariadne
// Navegación principal con menú hamburguesa, dark mode toggle y CTA
// Accesibilidad: roles ARIA, navegación por teclado, skip-to-content
// =============================================================================
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import escudo from '../../assets/escudo.png';

const NAV_LINKS = [
  { to: '/', label: 'nav.inicio' },
  { to: '/quienes-somos', label: 'nav.quienesSomos' },
  { to: '/hazte-socio', label: 'nav.hazteSocio' },
  { to: '/contacto', label: 'nav.contacto' },
] as const;

export default function Header() {
  const { t } = useTranslation();
  const { isDark, toggleDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Cerrar con ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  // Sombra al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 text-sm font-semibold transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-club-orange after:transition-all after:duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange rounded ${
      isActive
        ? 'text-club-orange after:w-full'
        : 'text-white/90 hover:text-white after:w-0 hover:after:w-full'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-club-blue shadow-2xl backdrop-blur-md'
          : 'bg-club-blue/95'
      }`}
      role="banner"
    >
      {/* Skip to main content — accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-club-orange text-white px-4 py-2 rounded-lg font-semibold z-50"
      >
        Ir al contenido principal
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange rounded-lg"
            aria-label="Club Ariadne — Ir al inicio"
          >
            <img
              src={escudo}
              alt="Escudo Club Ariadne"
              className="h-10 w-auto lg:h-12 transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
            />
            <span className="font-display text-2xl lg:text-3xl text-white tracking-wider drop-shadow">
              ARIADNE
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={navLinkClass}>
                {t(label)}
              </NavLink>
            ))}
          </nav>

          {/* Acciones desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* CTA Hazte socio */}
            <Link
              to="/hazte-socio"
              className="bg-club-orange text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-club-orange-dark transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t('nav.hazteSocio')}
            </Link>
          </div>

          {/* Móvil: dark mode + hamburguesa */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleDark}
              aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
              className="p-2 rounded-lg text-white/80 hover:text-white transition-colors"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              ref={hamburgerRef}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t('nav.menuCerrar') : t('nav.menuAbrir')}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="navigation"
        aria-label="Menú móvil"
        className={`lg:hidden bg-club-blue-dark border-t border-white/10 transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-club-orange text-white'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {t(label)}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-white/10">
            <Link
              to="/hazte-socio"
              className="block w-full text-center bg-club-orange text-white px-4 py-3 rounded-xl font-bold hover:bg-club-orange-dark transition-colors"
            >
              {t('nav.hazteSocio')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
