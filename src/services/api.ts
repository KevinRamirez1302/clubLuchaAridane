// =============================================================================
// API CLIENT SERVICE — Club Aridane
// Cliente HTTP unificado con Axios para comunicar React con la API Node.js
// =============================================================================

import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

let accessToken: string | null = localStorage.getItem('accessToken');

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: { page: number; limit: number; total: number };
  error?: { code: string; message: string };
}

// Instancia principal de Axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones: inyecta el token Bearer si existe
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variables para gestionar cola de reintentos durante el refresco del token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de respuestas: reintento automático con refresh token en error 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (res.data.success && res.data.data?.accessToken) {
          const newToken = res.data.data.accessToken;
          setAccessToken(newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          setAccessToken(null);
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        setAccessToken(null);
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Wrapper retrocompatible apiFetch que utiliza apiClient internamente
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; meta?: { page: number; limit: number; total: number } }> {
  let bodyData: unknown = options.body;
  if (typeof options.body === 'string') {
    try {
      bodyData = JSON.parse(options.body);
    } catch {
      bodyData = options.body;
    }
  }

  const config: AxiosRequestConfig = {
    url: endpoint,
    method: (options.method || 'GET') as AxiosRequestConfig['method'],
    data: bodyData,
    headers: options.headers ? (options.headers as Record<string, string>) : undefined,
  };

  try {
    const response = await apiClient.request<ApiResponse<T>>(config);
    const result = response.data;

    if (!result.success) {
      throw new Error(result.error?.message || 'Error en la petición HTTP');
    }

    return { data: result.data as T, meta: result.meta };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const apiErrorMessage = error.response?.data?.error?.message;
      throw new Error(apiErrorMessage || error.message || 'Error de conexión con el servidor');
    }
    throw error;
  }
}
