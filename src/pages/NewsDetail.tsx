// Página de detalle de noticia individual — /noticias/:id
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SEOHead from '../components/common/SEOHead';
import Badge from '../components/common/Badge';
import LazyImage from '../components/common/LazyImage';
import { Skeleton } from '../components/common/Skeleton';
import type { Noticia } from '../types';

const CATEGORIA_VARIANT: Record<Noticia['categoria'], 'blue' | 'green' | 'orange' | 'gray'> = {
  club: 'blue',
  competicion: 'green',
  fichaje: 'orange',
  institucional: 'gray',
};

function formatFechaLarga(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { noticias, cargando } = useApp();

  if (cargando) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-72 w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  const noticia = noticias.find((n) => n.id === Number(id));
  if (!noticia) return <Navigate to="/404" replace />;

  // Noticias relacionadas (excluyendo la actual, máximo 3)
  const relacionadas = noticias.filter((n) => n.id !== noticia.id).slice(0, 3);

  return (
    <>
      <SEOHead
        title={noticia.titulo}
        description={noticia.resumen}
        image={noticia.imagen}
        url={`/noticias/${noticia.id}`}
      />

      <article className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-club-blue transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/#noticias" className="hover:text-club-blue transition-colors">Noticias</Link>
            <span>/</span>
            <span className="text-gray-600 dark:text-gray-300 truncate">{noticia.titulo}</span>
          </nav>

          {/* Badge de categoría */}
          <div className="mb-4">
            <Badge variant={CATEGORIA_VARIANT[noticia.categoria]}>
              {noticia.categoria}
            </Badge>
          </div>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4">
            {noticia.titulo}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={noticia.fecha}>{formatFechaLarga(noticia.fecha)}</time>
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {noticia.autor}
            </span>
          </div>

          {/* Imagen destacada */}
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 shadow-xl">
            <LazyImage
              src={noticia.imagen}
              alt={noticia.titulo}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Resumen */}
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-medium border-l-4 border-club-orange pl-5 italic">
            {noticia.resumen}
          </p>

          {/* Contenido HTML */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-club-blue dark:prose-a:text-club-blue-light"
            dangerouslySetInnerHTML={{ __html: noticia.contenido }}
          />
        </div>

        {/* Noticias relacionadas */}
        {relacionadas.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-16 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Otras noticias</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relacionadas.map((n) => (
                <Link
                  key={n.id}
                  to={`/noticias/${n.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md card-hover block"
                >
                  <div className="h-40 overflow-hidden">
                    <LazyImage
                      src={n.imagen}
                      alt={n.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{formatFechaLarga(n.fecha)}</p>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-club-blue dark:group-hover:text-club-blue-light transition-colors">
                      {n.titulo}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
