import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Noticia, Jugador, PosicionClasificacion, Partido } from '../types';

// Datos iniciales desde los JSON
import initialNoticias from '../data/noticias.json';
import initialPlantilla from '../data/plantilla.json';
import initialClasificacion from '../data/clasificacion.json';
import initialPartidos from '../data/partidos.json';

interface DataState {
  noticias: Noticia[];
  plantilla: Jugador[];
  clasificacion: PosicionClasificacion[];
  partidos: Partido[];
  
  // Acciones para Noticias
  addNoticia: (noticia: Omit<Noticia, 'id'>) => void;
  updateNoticia: (id: number, data: Partial<Noticia>) => void;
  deleteNoticia: (id: number) => void;

  // Acciones para Plantilla
  addJugador: (jugador: Omit<Jugador, 'id'>) => void;
  updateJugador: (id: number, data: Partial<Jugador>) => void;
  deleteJugador: (id: number) => void;

  // Acciones para Clasificación
  updateClasificacion: (clasificacion: PosicionClasificacion[]) => void;

  // Acciones para Partidos (Próxima luchada)
  updatePartido: (id: number, data: Partial<Partido>) => void;
  addPartido: (partido: Omit<Partido, 'id'>) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      // Cargamos los datos iniciales asumiendo que coinciden con los tipos
      noticias: initialNoticias as Noticia[],
      plantilla: initialPlantilla as unknown as Jugador[],
      clasificacion: initialClasificacion as PosicionClasificacion[],
      partidos: initialPartidos as Partido[],

      // Noticias
      addNoticia: (noticia) =>
        set((state) => {
          const newId = state.noticias.length > 0 ? Math.max(...state.noticias.map(n => n.id)) + 1 : 1;
          return { noticias: [{ ...noticia, id: newId }, ...state.noticias] };
        }),
      updateNoticia: (id, data) =>
        set((state) => ({
          noticias: state.noticias.map((n) => (n.id === id ? { ...n, ...data } : n)),
        })),
      deleteNoticia: (id) =>
        set((state) => ({
          noticias: state.noticias.filter((n) => n.id !== id),
        })),

      // Plantilla
      addJugador: (jugador) =>
        set((state) => {
          const newId = state.plantilla.length > 0 ? Math.max(...state.plantilla.map(j => j.id)) + 1 : 1;
          return { plantilla: [...state.plantilla, { ...jugador, id: newId }] };
        }),
      updateJugador: (id, data) =>
        set((state) => ({
          plantilla: state.plantilla.map((j) => (j.id === id ? { ...j, ...data } : j)),
        })),
      deleteJugador: (id) =>
        set((state) => ({
          plantilla: state.plantilla.filter((j) => j.id !== id),
        })),

      // Clasificación
      updateClasificacion: (clasificacion) => set({ clasificacion }),

      // Partidos
      updatePartido: (id, data) =>
        set((state) => ({
          partidos: state.partidos.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      addPartido: (partido) =>
        set((state) => {
          const newId = state.partidos.length > 0 ? Math.max(...state.partidos.map(p => p.id)) + 1 : 1;
          return { partidos: [...state.partidos, { ...partido, id: newId }] };
        }),
    }),
    {
      name: 'club-aridane-data', // persistance key en localStorage
    }
  )
);
