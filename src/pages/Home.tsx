// Página de Inicio — compone todas las secciones
import SEOHead from '../components/common/SEOHead';
import Banner from '../components/home/Banner';
import MatchWidget from '../components/home/MatchWidget';
import NewsGrid from '../components/home/NewsGrid';
import Signings from '../components/home/Signings';
import Squad from '../components/home/Squad';
import Sponsors from '../components/home/Sponsors';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <>
      <SEOHead
        title="Inicio"
        description="Club Ariadne — Tu club de fútbol desde 1958. Sigue los partidos, conoce nuestra plantilla, los últimos fichajes y hazte socio."
        url="/"
      />

      {/* Banner principal — ocupa el 100vh */}
      <Banner />

      {/* Widget de partidos y clasificación */}
      <MatchWidget />

      {/* Últimas noticias */}
      <NewsGrid />

      {/* Fichajes de la temporada */}
      <Signings />

      {/* Plantilla actual con filtros */}
      <Squad />

      {/* Patrocinadores */}
      <Sponsors />

      {/* Suscripción al boletín */}
      <Newsletter />
    </>
  );
}
