import { create } from 'zustand';
import { apiFetch } from '../services/api';

export interface Solicitud {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  plan: string; // 'socio' | 'socio_premium'
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  fechaSolicitud: string;
}

export interface Socio {
  id: string | number;
  nombre: string;
  apellidos?: string;
  email: string;
  dni?: string; // Se usará como usuario
  password?: string; // Por defecto '123456'
  plan: string;
  vencimiento?: string;
  numeroSocio?: string;
  numSocio?: string;
  activo?: boolean;
  creadoEn?: string;
  foto?: string;
}

interface MembershipState {
  solicitudes: Solicitud[];
  socios: Socio[];
  socioAutenticado: Socio | null;
  isLoading: boolean;
  error: string | null;

  fetchSolicitudes: () => Promise<void>;
  fetchSocios: () => Promise<void>;
  updateSocio: (id: string | number, datos: Partial<Socio>) => Promise<void>;
  toggleEstadoSocio: (id: string | number, activo: boolean) => Promise<void>;
  deleteSocio: (id: string | number) => Promise<void>;
  addSolicitud: (datos: Omit<Solicitud, 'id' | 'estado' | 'fechaSolicitud'>) => Promise<void>;
  acceptSolicitud: (id: string) => Promise<Socio | undefined>;
  rejectSolicitud: (id: string) => Promise<void>;
  loginSocio: (dni: string, password: string) => Promise<boolean>;
  logoutSocio: () => void;
}

export const useMembershipStore = create<MembershipState>()((set, get) => ({
  solicitudes: [],
  socios: [],
  socioAutenticado: null,
  isLoading: false,
  error: null,

  fetchSolicitudes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch<Solicitud[]>('/solicitudes');
      set({ solicitudes: res.data, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar solicitudes';
      set({ isLoading: false, error: message });
      // Fallback local: no se hace nada para no borrar las peticiones locales (si aplicara)
    }
  },

  fetchSocios: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch<Socio[]>('/socios');
      set({ socios: res.data, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar socios';
      set({ isLoading: false, error: message });
    }
  },

  updateSocio: async (id, datos) => {
    try {
      const res = await apiFetch<Socio>(`/socios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
      });
      set((state) => ({
        socios: state.socios.map((s) => (s.id === id ? { ...s, ...res.data } : s)),
        socioAutenticado:
          state.socioAutenticado?.id === id
            ? { ...state.socioAutenticado, ...res.data }
            : state.socioAutenticado,
      }));
    } catch {
      // Fallback local visual
      set((state) => ({
        socios: state.socios.map((s) => (s.id === id ? { ...s, ...datos } : s)),
        socioAutenticado:
          state.socioAutenticado?.id === id
            ? { ...state.socioAutenticado, ...datos }
            : state.socioAutenticado,
      }));
    }
  },

  toggleEstadoSocio: async (id, activo) => {
    try {
      await apiFetch(`/socios/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ activo }),
      });
      set((state) => ({
        socios: state.socios.map((s) => (s.id === id ? { ...s, activo } : s)),
      }));
    } catch (err: unknown) {
      console.error('Error al cambiar estado:', err);
      // Fallback local visual
      set((state) => ({
        socios: state.socios.map((s) => (s.id === id ? { ...s, activo } : s)),
      }));
    }
  },

  deleteSocio: async (id) => {
    try {
      await apiFetch(`/socios/${id}`, {
        method: 'DELETE',
      });
      set((state) => ({
        socios: state.socios.filter((s) => s.id !== id),
      }));
    } catch (err: unknown) {
      console.error('Error al eliminar socio:', err);
      // Fallback local visual
      set((state) => ({
        socios: state.socios.filter((s) => s.id !== id),
      }));
    }
  },

  addSolicitud: async (datos) => {
    const res = await apiFetch<Solicitud>('/solicitudes', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    set((state) => ({ solicitudes: [res.data, ...state.solicitudes] }));
  },

  acceptSolicitud: async (id) => {
    try {
      const res = await apiFetch<{ solicitud: Solicitud; socio: Socio }>(`/solicitudes/${id}/accept`, {
        method: 'PUT',
      });
      set((state) => ({
        solicitudes: state.solicitudes.map((s) => (s.id === id ? res.data.solicitud : s)),
        socios: [...state.socios, res.data.socio],
      }));
      return res.data.socio;
    } catch {
      // Fallback local: actualiza visualmente el estado de la solicitud
      const state = get();
      const solicitud = state.solicitudes.find((s) => s.id === id);

      if (solicitud && solicitud.estado === 'pendiente') {
        const nuevoSocio: Socio = {
          id: Math.random().toString(36).substr(2, 9),
          nombre: solicitud.nombre,
          apellidos: solicitud.apellidos,
          email: solicitud.email,
          dni: solicitud.dni,
          plan: solicitud.plan, // string: 'socio' | 'socio_premium'
          vencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          numeroSocio: `ARD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
        };

        set((state) => ({
          solicitudes: state.solicitudes.map((s) => (s.id === id ? { ...s, estado: 'aceptada' } : s)),
          socios: [...state.socios, nuevoSocio],
        }));
        return nuevoSocio;
      }
      return undefined;
    }
  },

  rejectSolicitud: async (id) => {
    try {
      const res = await apiFetch<Solicitud>(`/solicitudes/${id}/reject`, {
        method: 'PUT',
      });
      set((state) => ({
        solicitudes: state.solicitudes.map((s) => (s.id === id ? res.data : s)),
      }));
    } catch {
      // Fallback local simulado
      set((state) => ({
        solicitudes: state.solicitudes.map((s) => (s.id === id ? { ...s, estado: 'rechazada' } : s)),
      }));
    }
  },

  loginSocio: async (dni, password) => {
    try {
      const res = await apiFetch<{ token: string; socio: Socio }>('/auth/socio-login', {
        method: 'POST',
        body: JSON.stringify({ dni, password }),
      });
      set({ socioAutenticado: res.data.socio });
      return true;
    } catch {
      // Fallback local simulado
      const state = get();
      const socio = state.socios.find(
        (s) => s.dni?.toUpperCase() === dni.toUpperCase() && s.password === password
      );
      if (socio) {
        set({ socioAutenticado: socio });
        return true;
      }
      return false;
    }
  },

  logoutSocio: () => {
    // Si hubiese token, lo borraríamos aquí o llamando a api.ts: setAccessToken(null)
    set({ socioAutenticado: null });
  },
}));
