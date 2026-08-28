import { create } from 'zustand';
import type { Noticia, Jugador, PosicionClasificacion, Partido } from '../types';
import { apiFetch } from '../services/api';

// Fallbacks de datos iniciales en caso de fallo de red
import initialNoticias from '../data/noticias.json';
import initialPlantilla from '../data/plantilla.json';
import initialClasificacion from '../data/clasificacion.json';
import initialPartidos from '../data/partidos.json';

interface DataState {
  noticias: Noticia[];
  plantilla: Jugador[];
  clasificacion: PosicionClasificacion[];
  partidos: Partido[];
  isLoading: boolean;
  error: string | null;

  // Carga inicial desde la API
  fetchInitialData: () => Promise<void>;

  // Acciones para Noticias
  addNoticia: (noticia: Omit<Noticia, 'id'>) => Promise<void>;
  updateNoticia: (id: number, data: Partial<Noticia>) => Promise<void>;
  deleteNoticia: (id: number) => Promise<void>;

  // Acciones para Plantilla
  addJugador: (jugador: Omit<Jugador, 'id'>) => Promise<void>;
  updateJugador: (id: number, data: Partial<Jugador>) => Promise<void>;
  deleteJugador: (id: number) => Promise<void>;

  // Acciones para Clasificación
  updateClasificacion: (clasificacion: PosicionClasificacion[]) => Promise<void>;

  // Acciones para Partidos
  updatePartido: (id: number, data: Partial<Partido>) => Promise<void>;
  addPartido: (partido: Omit<Partido, 'id'>) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  noticias: initialNoticias as Noticia[],
  plantilla: initialPlantilla as unknown as Jugador[],
  clasificacion: initialClasificacion as PosicionClasificacion[],
  partidos: initialPartidos as Partido[],
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [noticiasRes, plantillaRes, clasifRes, partidosRes] = await Promise.allSettled([
        apiFetch<Noticia[]>('/noticias?limit=100'),
        apiFetch<Jugador[]>('/plantilla?limit=100'),
        apiFetch<PosicionClasificacion[]>('/clasificacion'),
        apiFetch<Partido[]>('/partidos'),
      ]);

      set({
        noticias: noticiasRes.status === 'fulfilled' ? noticiasRes.value.data : (initialNoticias as Noticia[]),
        plantilla: plantillaRes.status === 'fulfilled' ? plantillaRes.value.data : (initialPlantilla as unknown as Jugador[]),
        clasificacion: clasifRes.status === 'fulfilled' ? clasifRes.value.data : (initialClasificacion as PosicionClasificacion[]),
        partidos: partidosRes.status === 'fulfilled' ? partidosRes.value.data : (initialPartidos as Partido[]),
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar datos de la API';
      set({ isLoading: false, error: message });
    }
  },

  // ── Noticias ─────────────────────────────────────────────────────────────
  addNoticia: async (noticia) => {
    try {
      const res = await apiFetch<Noticia>('/noticias', {
        method: 'POST',
        body: JSON.stringify(noticia),
      });
      set((state) => ({ noticias: [res.data, ...state.noticias] }));
    } catch {
      // Fallback local si la API falla
      const newId = get().noticias.length > 0 ? Math.max(...get().noticias.map((n) => n.id)) + 1 : 1;
      set((state) => ({ noticias: [{ ...noticia, id: newId }, ...state.noticias] }));
    }
  },

  updateNoticia: async (id, data) => {
    try {
      const res = await apiFetch<Noticia>(`/noticias/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      set((state) => ({
        noticias: state.noticias.map((n) => (n.id === id ? res.data : n)),
      }));
    } catch {
      set((state) => ({
        noticias: state.noticias.map((n) => (n.id === id ? { ...n, ...data } : n)),
      }));
    }
  },

  deleteNoticia: async (id) => {
    try {
      await apiFetch(`/noticias/${id}`, { method: 'DELETE' });
    } catch {
      // continuar con borrado en UI
    } finally {
      set((state) => ({
        noticias: state.noticias.filter((n) => n.id !== id),
      }));
    }
  },

  // ── Plantilla ────────────────────────────────────────────────────────────
  addJugador: async (jugador) => {
    try {
      const res = await apiFetch<Jugador>('/plantilla', {
        method: 'POST',
        body: JSON.stringify(jugador),
      });
      set((state) => ({ plantilla: [...state.plantilla, res.data] }));
    } catch {
      const newId = get().plantilla.length > 0 ? Math.max(...get().plantilla.map((j) => j.id)) + 1 : 1;
      set((state) => ({ plantilla: [...state.plantilla, { ...jugador, id: newId }] }));
    }
  },

  updateJugador: async (id, data) => {
    try {
      const res = await apiFetch<Jugador>(`/plantilla/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      set((state) => ({
        plantilla: state.plantilla.map((j) => (j.id === id ? res.data : j)),
      }));
    } catch {
      set((state) => ({
        plantilla: state.plantilla.map((j) => (j.id === id ? { ...j, ...data } : j)),
      }));
    }
  },

  deleteJugador: async (id) => {
    try {
      await apiFetch(`/plantilla/${id}`, { method: 'DELETE' });
    } catch {
      // continuar
    } finally {
      set((state) => ({
        plantilla: state.plantilla.filter((j) => j.id !== id),
      }));
    }
  },

  // ── Clasificación ────────────────────────────────────────────────────────
  updateClasificacion: async (clasificacion) => {
    try {
      const res = await apiFetch<PosicionClasificacion[]>('/clasificacion', {
        method: 'PUT',
        body: JSON.stringify(clasificacion),
      });
      set({ clasificacion: res.data });
    } catch {
      set({ clasificacion });
    }
  },

  // ── Partidos ─────────────────────────────────────────────────────────────
  updatePartido: async (id, data) => {
    try {
      const res = await apiFetch<Partido>(`/partidos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      set((state) => ({
        partidos: state.partidos.map((p) => (p.id === id ? res.data : p)),
      }));
    } catch {
      set((state) => ({
        partidos: state.partidos.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }));
    }
  },

  addPartido: async (partido) => {
    try {
      const res = await apiFetch<Partido>('/partidos', {
        method: 'POST',
        body: JSON.stringify(partido),
      });
      set((state) => ({ partidos: [...state.partidos, res.data] }));
    } catch {
      const newId = get().partidos.length > 0 ? Math.max(...get().partidos.map((p) => p.id)) + 1 : 1;
      set((state) => ({ partidos: [...state.partidos, { ...partido, id: newId }] }));
    }
  },
}));
