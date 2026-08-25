// Layout wrapper con Header, Footer y skip-to-main
// Usa Outlet de React Router v7 para renderizar rutas anidadas
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-club-white dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <main id="main-content" className="flex-1 pt-16 lg:pt-20 page-enter" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
