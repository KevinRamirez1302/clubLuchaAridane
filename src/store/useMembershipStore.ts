import { create } from 'zustand';
import { apiFetch, setAccessToken } from '../services/api';

export interface Solicitud {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  plan: string;

  estado: 'pendiente' | 'aceptada' | 'rechazada';
  fechaSolicitud: string;
}

export interface Socio {
  id: string | number;
  nombre: string;
  apellidos?: string;
  email: string;
  dni?: string;
  telefono?: string;
  numeroSocio?: string;
  numSocio?: string;
  plan: string;
  vencimiento?: string;
  activo?: boolean;
  password?: string; // Por defecto '123456'
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

export const useMembershipStore = create<MembershipState>((set, get) => ({
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
        socios: state.socios.map((s) => (s.id === id ? { ...s, ...res.data, ...(datos.password ? { password: datos.password } : {}) } : s)),
        socioAutenticado:
          state.socioAutenticado?.id === id
            ? { ...state.socioAutenticado, ...res.data, ...(datos.password ? { password: datos.password } : {}) }
            : state.socioAutenticado,
      }));
    } catch (err) {
      // Fallback local visual
      set((state) => ({
        socios: state.socios.map((s) => (s.id === id ? { ...s, ...datos } : s)),
        socioAutenticado:
          state.socioAutenticado?.id === id
            ? { ...state.socioAutenticado, ...datos }
            : state.socioAutenticado,
      }));
      throw err;
    }
  },

  toggleEstadoSocio: async (id, activo) => {
    // Solo actualizar la UI si la API confirma el cambio
    await apiFetch(`/socios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo }),
    });
    set((state) => ({
      socios: state.socios.map((s) => (s.id === id ? { ...s, activo } : s)),
    }));
  },

  deleteSocio: async (id) => {
    // Solo eliminar de la UI si la API confirma la baja
    await apiFetch(`/socios/${id}`, {
      method: 'DELETE',
    });
    set((state) => ({
      socios: state.socios.filter((s) => s.id !== id),
    }));
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
      const socioConPassword: Socio = { ...res.data.socio, password: '123456' };
      set((state) => ({
        solicitudes: state.solicitudes.map((s) => (s.id === id ? res.data.solicitud : s)),
        socios: [...state.socios, socioConPassword],
      }));
      return socioConPassword;
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
          plan: solicitud.plan,
          password: '123456',
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
    const cleanDni = dni.trim();
    try {
      const res = await apiFetch<{ accessToken: string; token: string; socio: Socio }>('/auth/socio-login', {
        method: 'POST',
        body: JSON.stringify({ dni: cleanDni, password }),
      });
      const token = res.data.accessToken || res.data.token;
      if (token) {
        setAccessToken(token);
      }
      set({ socioAutenticado: res.data.socio });
      return true;
    } catch {
      // Fallback local simulado
      const state = get();
      
      // Credenciales de prueba (mock) para ver los carnés
      if (dni.toUpperCase() === '11111111A' && password === '123456') {
        set({
          socioAutenticado: {
            id: 'mock-1',
            nombre: 'MARC',
            apellidos: 'GRAU SOLINYÀ',
            email: 'marc@example.com',
            dni: '11111111A',
            plan: 'Socio Abonado',
            vencimiento: '2027-06-30T00:00:00.000Z',
            numeroSocio: '50786',
            foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          }
        });
        return true;
      }
      
      if (dni.toUpperCase() === '22222222B' && password === '123456') {
        set({
          socioAutenticado: {
            id: 'mock-2',
            nombre: 'JUAN',
            apellidos: 'PÉREZ',
            email: 'juan@example.com',
            dni: '22222222B',
            plan: 'Socio Abonado',
            vencimiento: '2027-06-30T00:00:00.000Z',
            numeroSocio: '50787',
            foto: undefined, // Sin foto
          }
        });
        return true;
      }

      const socio = state.socios.find(
        (s) => s.dni?.trim().toUpperCase() === cleanDni.toUpperCase() && s.password === password
      );
      if (socio) {
        set({ socioAutenticado: socio });
        return true;
      }
      return false;
    }
  },

  logoutSocio: () => {
    setAccessToken(null);
    set({ socioAutenticado: null });
  },
}));
