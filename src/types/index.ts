// =============================================================================
// TIPOS GLOBALES DEL PROYECTO — Club Aridane
// Estos tipos reflejan la estructura de datos que vendrá del backend via API REST
// Cuando se integre el backend, estos tipos serán la fuente de verdad para los
// modelos de datos recibidos del servidor.
// =============================================================================

export interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string; // HTML o markdown
  imagen: string;    // URL de imagen (lazy loaded)
  fecha: string;     // ISO 8601
  categoria: 'club' | 'competicion' | 'fichaje' | 'institucional';
  autor: string;
}

export interface Fichaje {
  id: number;
  nombre: string;
  clasificacion: string;
  procedencia: string;
  foto: string;
  nacionalidad: string;
  edad: number;
  temporada: string; // ej. "2024/25"
  descripcion?: string;
}

export type ClasificacionLuchador =
  | 'Puntal A' | 'Puntal B' | 'Puntal C'
  | 'Destacado A' | 'Destacado B' | 'Destacado C'
  | 'No clasificado' | 'Juvenil' | 'Cadete' | 'Infantil'
  | 'Técnico Medio' | 'Técnico Superior'
  | 'Presidente' | 'Secretario' | 'Vocal';
export type CategoriaEquipo = 'primera' | 'segunda' | 'tercera' | 'femenina' | 'base' | 'directiva' | 'cuerpo-tecnico';

export interface Jugador {
  id: number;
  nombre: string;
  clasificaciones: ClasificacionLuchador[];
  equipos: CategoriaEquipo[];
  foto: string;
  nacionalidad: string;
  edad: number | null;
  peso: number | null;
  altura: number | null;
  luchadas?: number;
  puntosFavor?: number;
  puntosContra?: number;
  bio?: string;
}

export interface Patrocinador {
  id: number;
  nombre: string;
  logo: string;
  url?: string;
  nivel: 'principal' | 'oficial' | 'colaborador';
}

export interface HitoHistorico {
  id: number;
  año: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
}

export interface ElementoGaleria {
  id: number;
  tipo: 'foto' | 'video';
  url: string;
  miniatura?: string; // para vídeos
  titulo: string;
  descripcion?: string;
  fecha: string;
}

export interface FAQ {
  id: number;
  pregunta: string;
  respuesta: string;
}

export interface PlanMembresia {
  id: 'socio' | 'socio-premium';
  nombre: string;
  precio: number; // €/año
  beneficios: string[];
  destacado: boolean;
  color: string; // token CSS
}

export interface Partido {
  id: number;
  esLocal: boolean;
  rival: string;
  logoRival: string;
  competicion: string;
  fecha: string; // ISO 8601
  resultado?: string; // "2-1" o null si es futuro
  esProximo: boolean;
}

export interface PosicionClasificacion {
  posicion: number;
  equipo: string;
  luchadas: number;
  ganadas: number;
  empatadas: number;
  perdidas: number;
  puntosFavor: number;
  puntosContra: number;
  puntos: number;
  esClub: boolean; // para destacar la fila del club
}
