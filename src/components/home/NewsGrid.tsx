// Grid de noticias con skeleton loaders y enlace a detalle
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import Badge from '../common/Badge';
import { NewsCardSkeleton, SkeletonGrid } from '../common/Skeleton';
import LazyImage from '../common/LazyImage';
import type { Noticia } from '../../types';

const CATEGORIA_VARIANT: Record<Noticia['categoria'], 'blue' | 'green' | 'orange' | 'gray'> = {
  club: 'blue',
  competicion: 'green',
  fichaje: 'orange',
  institucional: 'gray',
};

const CATEGORIA_LABEL: Record<Noticia['categoria'], string> = {
  club: 'Club',
  competicion: 'Competición',
  fichaje: 'Fichaje',
  institucional: 'Institucional',
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface NewsCardProps {
  noticia: Noticia;
}

function NewsCard({ noticia }: NewsCardProps) {
  return (
    <Link
      to={`/noticias/${noticia.id}`}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange"
      aria-label={`Leer noticia: ${noticia.titulo}`}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden h-48">
        <LazyImage
          src={noticia.imagen}
          alt={noticia.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant={CATEGORIA_VARIANT[noticia.categoria]}>
            {CATEGORIA_LABEL[noticia.categoria]}
          </Badge>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{formatFecha(noticia.fecha)}</p>
        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mb-2 group-hover:text-club-blue dark:group-hover:text-club-blue-light transition-colors line-clamp-2">
          {noticia.titulo}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
          {noticia.resumen}
        </p>
        <div className="flex items-center gap-1 mt-4 text-club-blue dark:text-club-blue-light text-sm font-semibold">
          <span>Leer más</span>
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function NewsGrid() {
  const { t } = useTranslation();
  const { noticias, cargando } = useApp();
  const ref = useScrollReveal<HTMLElement>();
  const noticiasMostradas = noticias.slice(0, 3);

  return (
    <section
      ref={ref}
      id="noticias"
      className="reveal py-16 lg:py-24 bg-white dark:bg-gray-950 scroll-mt-20 lg:scroll-mt-24"
      aria-labelledby="noticias-titulo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de sección */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="section-line" />
            <h2
              id="noticias-titulo"
              className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white"
            >
              {t('home.ultimasNoticias')}
            </h2>
          </div>
          <Link
            to="/noticias"
            className="text-club-blue dark:text-club-blue-light font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm group"
          >
            {t('home.verTodasNoticias')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cargando ? (
            <SkeletonGrid count={3}>
              <NewsCardSkeleton />
            </SkeletonGrid>
          ) : noticiasMostradas.length > 0 ? (
            noticiasMostradas.map((n) => <NewsCard key={n.id} noticia={n} />)
          ) : (
            <div className="col-span-3 text-center py-16">
              <p className="text-gray-400 text-lg">{t('comun.sinDatos')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
