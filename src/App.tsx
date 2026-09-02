// =============================================================================
// APP.TSX — Enrutador principal del Club Aridane
// React Router v7 con lazy loading de páginas para optimizar el bundle inicial
// =============================================================================
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import { Skeleton } from './components/common/Skeleton';
import ScrollToHash from './components/common/ScrollToHash';
import CookieBanner from './components/common/CookieBanner';

// Lazy loading de páginas para mejorar el tiempo de carga inicial
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const History = lazy(() => import('./pages/History'));
const Membership = lazy(() => import('./pages/Membership'));
const Contact = lazy(() => import('./pages/Contact'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AuthGuard = lazy(() => import('./components/auth/AuthGuard'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminSquad = lazy(() => import('./pages/admin/AdminSquad'));
const AdminStandings = lazy(() => import('./pages/admin/AdminStandings'));
const AdminNextMatch = lazy(() => import('./pages/admin/AdminNextMatch'));
const AdminMemberships = lazy(() => import('./pages/admin/AdminMemberships'));
const AdminSocios = lazy(() => import('./pages/admin/AdminSocios'));

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
          <CookieBanner />
          <BrowserRouter>
            <ScrollToHash />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Rutas Públicas - Login de Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Rutas Privadas - Panel de Administrador */}
                <Route element={<AuthGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/news" element={<AdminNews />} />
                    <Route path="/admin/squad" element={<AdminSquad />} />
                    <Route path="/admin/standings" element={<AdminStandings />} />
                    <Route path="/admin/next-match" element={<AdminNextMatch />} />
                    <Route path="/admin/memberships" element={<AdminMemberships />} />
                    <Route path="/admin/socios" element={<AdminSocios />} />
                  </Route>
                </Route>

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
