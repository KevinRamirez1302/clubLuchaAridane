// =============================================================================
// API CLIENT SERVICE — Club Aridane
// Cliente HTTP unificado para comunicar React con la API Node.js
// =============================================================================

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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: { page: number; limit: number; total: number };
  error?: { code: string; message: string };
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; meta?: { page: number; limit: number; total: number } }> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Para enviar/recibir cookie refreshToken HttpOnly
  });

  // Si da 401 Unauthorized y no estamos ya en refresh/login, intentamos renovar token
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Reintentar la petición original con el nuevo token
      headers.set('Authorization', `Bearer ${accessToken}`);
      const retryResponse = await fetch(url, { ...options, headers, credentials: 'include' });
      const retryResult: ApiResponse<T> = await retryResponse.json();
      if (!retryResponse.ok || !retryResult.success) {
        throw new Error(retryResult.error?.message || 'Error en la petición reintentada');
      }
      return { data: retryResult.data as T, meta: retryResult.meta };
    }
  }

  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || `Error HTTP ${response.status}`);
  }

  return { data: result.data as T, meta: result.meta };
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      setAccessToken(null);
      return false;
    }
    const result = await res.json();
    if (result.success && result.data?.accessToken) {
      setAccessToken(result.data.accessToken);
      return true;
    }
    setAccessToken(null);
    return false;
  } catch {
    setAccessToken(null);
    return false;
  }
}
