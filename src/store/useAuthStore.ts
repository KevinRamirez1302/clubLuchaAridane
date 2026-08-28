import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch, setAccessToken, getAccessToken } from '../services/api';

interface User {
  id?: number;
  username?: string;
  email?: string;
  nombre?: string;
  rol?: 'admin' | 'socio';
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: !!getAccessToken(),
      isLoading: false,
      user: null,

      login: async (username, password) => {
        set({ isLoading: true });
        try {
          // Primero intentamos como Admin
          const res = await apiFetch<{ accessToken: string; user: User }>('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
          });

          setAccessToken(res.data.accessToken);
          set({
            isAuthenticated: true,
            user: res.data.user,
            isLoading: false,
          });
          return true;
        } catch {
          // Si falla, intentamos como Socio (asumiendo username como email)
          try {
            const res = await apiFetch<{ accessToken: string; user: User }>('/auth/socio/login', {
              method: 'POST',
              body: JSON.stringify({ email: username, password }),
            });

            setAccessToken(res.data.accessToken);
            set({
              isAuthenticated: true,
              user: res.data.user,
              isLoading: false,
            });
            return true;
          } catch {
            set({ isLoading: false });
            return false;
          }
        }
      },

      logout: async () => {
        try {
          await apiFetch('/auth/logout', { method: 'POST' });
        } catch {
          // Ignorar errores de logout
        } finally {
          setAccessToken(null);
          set({ isAuthenticated: false, user: null });
        }
      },

      checkAuth: async () => {
        if (!getAccessToken()) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        try {
          const res = await apiFetch<User>('/auth/me');
          set({ isAuthenticated: true, user: res.data });
          return true;
        } catch {
          setAccessToken(null);
          set({ isAuthenticated: false, user: null });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);
