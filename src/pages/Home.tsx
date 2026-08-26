// Página de Inicio — compone todas las secciones
import SEOHead from '../components/common/SEOHead';
import Banner from '../components/home/Banner';
import SponsorBar from '../components/home/SponsorBar';
import MatchWidget from '../components/home/MatchWidget';
import CalendarSection from '../components/home/CalendarSection';
import NewsGrid from '../components/home/NewsGrid';
import Squad from '../components/home/Squad';
import Sponsors from '../components/home/Sponsors';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <>
      <SEOHead
        title="Inicio"
        description="Club Aridane — Tu club de lucha desde 1946. Sigue los partidos, conoce nuestra plantilla, los últimos fichajes y hazte socio."
        url="/"
      />

      {/* Banner principal — ocupa el 100vh */}
      <Banner />

      {/* Barra de patrocinadores principales */}
      <SponsorBar />

      {/* Widget de partidos y clasificación */}
      <MatchWidget />

      {/* Calendario oficial del C.L. Aridane */}
      <CalendarSection />

      {/* Últimas noticias */}
      <NewsGrid />

      {/* Plantilla actual con filtros */}
      <Squad />

      {/* Patrocinadores */}
      <Sponsors />

      {/* Suscripción al boletín */}
      <Newsletter />
    </>
  );
}
