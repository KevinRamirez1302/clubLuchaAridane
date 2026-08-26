// =============================================================================
// APP.TSX — Enrutador principal del Club Aridane
// React Router v7 con lazy loading de páginas para optimizar el bundle inicial
// =============================================================================
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import { Skeleton } from './components/common/Skeleton';
import ScrollToHash from './components/common/ScrollToHash';

// Lazy loading de páginas para mejorar el tiempo de carga inicial
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const History = lazy(() => import('./pages/History'));
const Membership = lazy(() => import('./pages/Membership'));
const Contact = lazy(() => import('./pages/Contact'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Fallback de carga durante el lazy loading
function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col gap-6 p-8 max-w-7xl mx-auto w-full">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppProvider>
          <BrowserRouter>
            <ScrollToHash />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<Layout />}>
                  {/* Rutas principales */}
                  <Route path="/" element={<Home />} />
                  <Route path="/quienes-somos" element={<About />} />
                  <Route path="/nuestra-historia" element={<History />} />
                  <Route path="/hazte-socio" element={<Membership />} />
                  <Route path="/contacto" element={<Contact />} />

                  {/* Rutas de detalle */}
                  {/* FUTURO: GET /api/noticias/:id */}
                  <Route path="/noticias/:id" element={<NewsDetail />} />
                  {/* FUTURO: GET /api/plantilla/:id */}
                  <Route path="/jugador/:id" element={<PlayerDetail />} />

                  {/* 404 */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
